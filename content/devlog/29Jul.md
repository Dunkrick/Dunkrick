---
title: "Moving to Neon Postgres"
date: "July 29, 2026"
tag: Engineering
---

# Moving to Neon Postgres

Changed the infrastructure today — migrated the Postgres database from a Render DB instance over to Neon Postgres.

To verify the migration, I walked through the full CRUD cycle: registered a new test user, logged in, created a dream, fetched it, updated it, and deleted it. Everything held up cleanly.

The key insight from today: the application was never coupled to Render PostgreSQL. It was coupled to the PostgreSQL *interface*. Swapping the host was just config.