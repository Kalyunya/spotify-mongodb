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
│   └── part2_queries.js
├── dataset.csv
├── requirements.txt
├── test_connection.py
├── .env
├── .gitignore
└── README.md
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

## Results

- 113,999 documents loaded into `tracks_raw`.
- 113,999 documents transformed into `tracks`.
- Four analytical queries implemented and tested.

