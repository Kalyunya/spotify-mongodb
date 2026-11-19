db = db.getSiblingDB("spotify");

const tracks = db.getCollection("tracks");

// Create three indexes for comparison
tracks.createIndex(
    { track_genre: 1, popularity: -1 }
);

tracks.createIndex(
    {
        track_genre: 1,
        "audio_features.danceability": 1,
        popularity: -1
    }
);

tracks.createIndex(
    {
        track_genre: 1,
        popularity: -1,
        "audio_features.danceability": 1
    }
);

// Common query
const filter = {
    track_genre: "pop",
    "audio_features.danceability": { $gte: 0.7 }
};

function compareIndex(indexName, label) {
    const result = tracks.find(filter)
        .sort({ popularity: -1 })
        .hint(indexName)
        .explain("executionStats");

    print("\n=== " + label + " ===");

    printjson({
        index: indexName,
        executionTimeMillis: result.executionStats.executionTimeMillis,
        nReturned: result.executionStats.nReturned,
        totalDocsExamined: result.executionStats.totalDocsExamined,
        totalKeysExamined: result.executionStats.totalKeysExamined,
        winningPlan: result.queryPlanner.winningPlan
    });
}

// Compare all three indexes
compareIndex(
    "track_genre_1_popularity_-1",
    "INDEX 1: GENRE + POPULARITY"
);

compareIndex(
    "track_genre_1_audio_features.danceability_1_popularity_-1",
    "INDEX 2: GENRE + DANCEABILITY + POPULARITY"
);

compareIndex(
    "track_genre_1_popularity_-1_audio_features.danceability_1",
    "INDEX 3: GENRE + POPULARITY + DANCEABILITY"
);

// Explain instrumental background tracks query

const instrumentalResult = tracks.find({
    "audio_features.instrumentalness": { $gt: 0.5 },
    "audio_features.speechiness": { $lt: 0.1 },
    explicit: false
})
.hint("audio_features.instrumentalness_1_audio_features.speechiness_1_explicit_1")
.explain("executionStats");

print("\n=== INSTRUMENTAL TRACKS INDEX ===");

printjson({
    executionTimeMillis: instrumentalResult.executionStats.executionTimeMillis,
    nReturned: instrumentalResult.executionStats.nReturned,
    totalDocsExamined: instrumentalResult.executionStats.totalDocsExamined,
    totalKeysExamined: instrumentalResult.executionStats.totalKeysExamined,
    winningPlan: instrumentalResult.queryPlanner.winningPlan
});

// Covered query example
const coveredResult = tracks.find(
    { track_genre: "pop" },
    { _id: 0, track_genre: 1, popularity: 1 }
)
.hint("track_genre_1_popularity_-1")
.explain("executionStats");

print("\n=== COVERED QUERY ===");
printjson({
    executionTimeMillis: coveredResult.executionStats.executionTimeMillis,
    nReturned: coveredResult.executionStats.nReturned,
    totalDocsExamined: coveredResult.executionStats.totalDocsExamined,
    totalKeysExamined: coveredResult.executionStats.totalKeysExamined,
    winningPlan: coveredResult.queryPlanner.winningPlan
});