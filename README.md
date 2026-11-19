# Spotify Tracks Analysis with MongoDB

## Project Description

This project demonstrates working with MongoDB Atlas using the Spotify Tracks Dataset.

The project includes:
- Loading CSV data into MongoDB.
- Transforming raw documents using MongoDB Aggregation Pipeline.
- Performing analytical queries.
- Creating indexes to improve query performance.

## Technologies

- Python 3.13
- MongoDB Atlas
- MongoDB Shell (mongosh)
- PyMongo 4.7.3
- Pandas
- JavaScript (MongoDB Aggregation Pipeline)

## Project Structure

```text
spotify_mongodb/
├── scripts/
│   ├── 01_load_data.py
│   ├── 02_transform.js
│   └── 03_create_indexes.js
├── queries/
│   ├── part2_queries.js
|   └── part3_indexes.js
├── dataset.csv
├── requirements.txt
├── test_connection.py
├── .env
├── .gitignore
├── README.md
└── README_UA.md
```

## Database Structure

Database: `spotify`

Collections:

- `tracks_raw` — raw data imported from CSV.
- `tracks` — transformed data with nested audio features and additional fields.

## Data Transformation

The aggregation pipeline performs the following operations:

- Converts the artists string into an array.
- Groups audio features into the `audio_features` object.
- Calculates track duration in seconds.
- Assigns popularity tiers: high, medium, low.

## Analytical Queries

The project includes four queries:

1. Finding tracks suitable for parties.
2. Identifying popular artists.
3. Detecting tempo outliers by genre.
4. Finding instrumental background tracks.

## Installation and Execution

Install dependencies:

```bash
py -m pip install -r requirements.txt
```

Configure MongoDB Atlas connection in `.env`:

```text
MONGO_URI=your_mongodb_connection_string
```

Test the connection:

```bash
py test_connection.py
```

Load CSV data:

```bash
py scripts/01_load_data.py
```

Transform data:

```bash
mongosh "YOUR_MONGO_URI" --file scripts/02_transform.js
```

Run analytical queries:

```bash
mongosh "YOUR_MONGO_URI" --file queries/part2_queries.js
```

Create indexes:

```bash
mongosh "YOUR_MONGO_URI" --file scripts/03_create_indexes.js
```

Compare compound indexes:

```bash
mongosh "YOUR_MONGO_URI" --file queries/part3_indexes.js
```


## Results

- 113,999 documents loaded into `tracks_raw`.
- 113,999 documents transformed into `tracks`.
- Four analytical queries implemented and tested.

## Indexing and Query Performance

The experiment compares three compound indexes for the following query:

- `track_genre: "pop"`
- `audio_features.danceability >= 0.7`
- Sort by `popularity` in descending order.

### Performance Comparison

| Index | Documents Examined | Keys Examined | Execution Time | SORT Stage |
|---|---:|---:|---:|---|
| Genre + Popularity | 1,000 | 1,000 | 2 ms | No |
| Genre + Danceability + Popularity | 354 | 354 | 1 ms | Yes |
| Genre + Popularity + Danceability | 354 | 412 | 1 ms | No |

All three indexes returned the same 354 documents.

### Analysis

**Index 1 — Genre + Popularity**

- Examines 1,000 documents.
- Danceability is filtered after index scanning.
- Does not require a separate SORT stage.

**Index 2 — Genre + Danceability + Popularity**

- Examines only 354 documents and 354 index keys.
- Provides efficient filtering by danceability.
- Requires an additional SORT stage.

**Index 3 — Genre + Popularity + Danceability**

- Examines 354 documents and 412 index keys.
- Supports sorting by popularity without a separate SORT stage.
- Provides a reasonable balance between filtering and sorting.

For this query, Index 3 is a good compromise because it supports the requested sorting order while reducing the number of examined documents.

Execution times are very small and may vary between runs. Therefore, the difference between 1 ms and 2 ms should not be considered conclusive.

The experiment uses `explain("executionStats")` and `hint()` to compare indexes explicitly.

The implementation is available in `queries/part3_indexes.js`.

### Instrumental Background Tracks Index

A compound index was created for the following fields:

- `audio_features.instrumentalness`
- `audio_features.speechiness`
- `explicit`

The query filters tracks using:
- instrumentalness > 0.5
- speechiness < 0.1
- explicit = false

Execution statistics:

| Metric | Result |
|---|---:|
| Documents returned | 16,141 |
| Documents examined | 16,141 |
| Index keys examined | 16,844 |
| Execution time | 50 ms |

The execution plan uses IXSCAN followed by FETCH, confirming that MongoDB uses the compound index instead of performing a collection scan.

### Covered Query

A covered query was tested using the compound index:

```javascript
{ track_genre: 1, popularity: -1 }
```

The query retrieves only fields included in the index:

```javascript
db.tracks.find(
    { track_genre: "pop" },
    { _id: 0, track_genre: 1, popularity: 1 }
)
```

**Execution statistics:**

| Metric | Result |
|---|---:|
| Execution time | 0 ms |
| Documents returned | 1,000 |
| Documents examined | 0 |
| Index keys examined | 1,000 |

MongoDB used `PROJECTION_COVERED` and `IXSCAN`. No `FETCH` stage was required.

This confirms that the query was fully satisfied using the index without accessing collection documents.