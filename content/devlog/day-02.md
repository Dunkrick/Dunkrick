---
title: "Day 02: SQLite Database Initialization & Schema"
date: "June 14, 2026"
tag: Integration
---

Today was all about giving the dreams a place to live. I wired up a lightweight Express.js API and hooked it into SQLite.

I wrote an auto-creation sequence in `db.js` so that the database initializes itself cleanly on startup. It’s a small detail, but it makes the developer experience so much smoother. 

```javascript
db.run(`
  CREATE TABLE IF NOT EXISTS dreams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  )
`);
```

It feels great to see the basic CRUD operations working. You can `POST` a dream, and it's safely tucked away in the local file system.
