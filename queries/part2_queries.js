db = db.getSiblingDB("spotify");

const tracks = db.getCollection("tracks");

// 1. Party tracks
const partyTracks = tracks.find({
    "audio_features.danceability": { $gt: 0.7 },
    "audio_features.energy": { $gt: 0.7 },
    duration_ms: { $gte: 180000, $lte: 300000 }
}).limit(20);

partyTracks.forEach(track => printjson({
    name: track.track_name,
    artists: track.artists,
    danceability: track.audio_features.danceability,
    energy: track.audio_features.energy,
    duration_sec: track.duration_sec
}));


// 2. Top artists by popularity
tracks.aggregate([
    {
        $unwind: "$artists"
    },
    {
        $group: {
            _id: "$artists",
            tracks_count: { $sum: 1 },
            min_popularity: { $min: "$popularity" },
            avg_popularity: { $avg: "$popularity" }
        }
    },
    {
        $match: {
            tracks_count: { $gte: 3 },
            min_popularity: { $gte: 60 }
        }
    },
    {
        $sort: {
            avg_popularity: -1
        }
    },
    {
        $limit: 20
    }
]).forEach(printjson);


// 3. Genre tempo outliers
tracks.aggregate([
    {
        $group: {
            _id: "$track_genre",
            avg_tempo: { $avg: "$audio_features.tempo" },
            stdDev_tempo: { $stdDevPop: "$audio_features.tempo" }
        }
    },
    {
        $project: {
            genre: "$_id",
            avg_tempo: 1,
            outlier_threshold: {
                $add: ["$avg_tempo", { $multiply: [2, "$stdDev_tempo"] }]
            }
        }
    },
    {
        $lookup: {
            from: "tracks",
            let: {
                genre: "$genre",
                threshold: "$outlier_threshold"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$track_genre", "$$genre"] },
                                { $gt: ["$audio_features.tempo", "$$threshold"] }
                            ]
                        }
                    }
                }
            ],
            as: "outlier_tracks"
        }
    },
    {
        $project: {
            _id: 0,
            genre: 1,
            avg_tempo: 1,
            outlier_threshold: 1,
            outlier_tracks: {
                $map: {
                    input: "$outlier_tracks",
                    as: "track",
                    in: {
                        track_name: "$$track.track_name",
                        tempo: "$$track.audio_features.tempo"
                    }
                }
            }
        }
    },
    {
        $match: {
            "outlier_tracks.0": { $exists: true }
        }
    }
]).forEach(printjson);

// 4. Background music
tracks.find({
    "audio_features.loudness": { $lt: -10 },
    "audio_features.speechiness": { $lt: 0.1 },
    "audio_features.instrumentalness": { $gt: 0.5 },
    explicit: false
}).limit(20).forEach(printjson);