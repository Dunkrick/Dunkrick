---
title: "Day 02: SQLite Database Initialization & Schema"
date: "June 14, 2026"
tag: Integration
---

Today was all about giving the dreams a place to live. I wired up a lightweight Express.js API and hooked it into SQLite.

The first thing I wrote was an auto-creation sequence in `db.js` — a small script that initializes the database cleanly on startup, no manual setup required.

```javascript
db.run(`
  CREATE TABLE IF NOT EXISTS dreams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  )
`);
```

It's a small detail, but it makes a real difference. Anyone who clones this repo gets a working database on the first `npm start`. No README steps to miss, no "did you run the migration?" messages in Slack.

There's something deeply satisfying about watching your first `POST` request land and knowing the data is safely persisted. The dreams have a home now.
