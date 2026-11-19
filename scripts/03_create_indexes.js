
// scripts/03_create_indexes.js

db = db.getSiblingDB("spotify");

const collection = db.getCollection("tracks");

// 1. Index by track_id
collection.createIndex(
    { track_id: 1 },
    // { unique: true }
);

// 2. Index by track_genre
collection.createIndex(
    { track_genre: 1 }
);

// 3. Index by popularity
collection.createIndex(
    { popularity: -1 }
);

// 4. Compound index: genre and popularity
collection.createIndex(
    { track_genre: 1, popularity: -1 }
);

// 5. Index by artists
collection.createIndex(
    { artists: 1 }
);

// 6. Compound index for instrumental background tracks
collection.createIndex({
    "audio_features.instrumentalness": 1,
    "audio_features.speechiness": 1,
    explicit: 1
});

print("Indexes created successfully!");
printjson(collection.getIndexes());
