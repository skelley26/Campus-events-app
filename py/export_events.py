import json
import sqlite3
from pathlib import Path

from scraper import eventsScraper

project_dir = Path(__file__).resolve().parents[1]
db_path = project_dir / "dbs" / "events.db"
json_path = project_dir / "html" / "events.json"


def main():
    scraped_events = eventsScraper.scraper()
    if not scraped_events:
        raise RuntimeError("The scraper found no events; existing data was left unchanged")

    with sqlite3.connect(db_path) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                location TEXT,
                date TEXT
            )
            """
        )
        connection.execute("DELETE FROM events")
        connection.executemany(
            "INSERT INTO events (title, date, location) VALUES (?, ?, ?)",
            scraped_events,
        )
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            "SELECT title, location, date FROM events"
        ).fetchall()

    json_path.write_text(
        json.dumps([dict(row) for row in rows], indent=2),
        encoding="utf-8",
    )
    print(f"Saved {len(rows)} events to {db_path} and {json_path}")


if __name__ == "__main__":
    main()