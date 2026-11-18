
# Аналіз Spotify Tracks за допомогою MongoDB

## Опис проєкту

Проєкт демонструє роботу з MongoDB Atlas на основі набору даних Spotify Tracks Dataset.

Проєкт включає:
- Завантаження даних CSV у MongoDB.
- Трансформацію необроблених документів за допомогою MongoDB Aggregation Pipeline.
- Виконання аналітичних запитів.
- Створення індексів для підвищення продуктивності запитів.

## Використані технології

- Python 3.13
- MongoDB Atlas
- MongoDB Shell (mongosh)
- PyMongo 4.7.3
- Pandas
- JavaScript (MongoDB Aggregation Pipeline)

## Структура проєкту

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

## Структура бази даних

База даних: `spotify`

Колекції:

- `tracks_raw` — необроблені дані, імпортовані з CSV.
- `tracks` — трансформовані дані з вкладеними аудіохарактеристиками та додатковими полями.

## Трансформація даних

Конвеєр агрегації виконує такі операції:

- Перетворює рядок виконавців на масив.
- Групує аудіохарактеристики в об'єкт `audio_features`.
- Обчислює тривалість треку в секундах.
- Присвоює рівні популярності: high, medium, low.

## Аналітичні запити

Проєкт містить чотири запити:

1. Пошук треків, придатних для вечірок.
2. Визначення популярних виконавців.
3. Виявлення аномальних значень темпу за жанрами.
4. Пошук інструментальних фонових треків.

## Встановлення та запуск

Встановлення залежностей:

```bash
py -m pip install -r requirements.txt
```

Налаштування підключення до MongoDB Atlas у файлі `.env`:

```text
MONGO_URI=your_mongodb_connection_string
```

Перевірка підключення:

```bash
py test_connection.py
```

Завантаження CSV:

```bash
py scripts/01_load_data.py
```

Трансформація даних:

```bash
mongosh "YOUR_MONGO_URI" --file scripts/02_transform.js
```

Запуск аналітичних запитів:

```bash
mongosh "YOUR_MONGO_URI" --file queries/part2_queries.js
```

Створення індексів:

```bash
mongosh "YOUR_MONGO_URI" --file scripts/03_create_indexes.js
```

## Результати

- 113 999 документів завантажено в `tracks_raw`.
- 113 999 документів трансформовано в `tracks`.
- Реалізовано та перевірено чотири аналітичні запити.
