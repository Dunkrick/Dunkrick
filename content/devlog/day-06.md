---
title: "Day 06: Prisma ORM & End-to-End Type Safety"
date: "June 26, 2026"
tag: Integration
---

Writing raw SQL strings inside TypeScript felt like wearing a seatbelt with the buckle undone. You have type safety everywhere *except* the most dangerous part — the database boundary.

*EP-004: Depend on abstractions, not implementations.*

Today, I migrated every database read and write to **Prisma**. Prisma acts as an abstraction over PostgreSQL, and now every single query is fully type-checked. If I misspell a column name, the app won't even compile. That's not just convenient — it's a fundamentally different relationship with your data layer.

With this, the complete migration from JavaScript to TypeScript is done. Every raw PostgreSQL call has been replaced. The backend is now strictly typed from the route handler all the way down to the database. No gaps, no escape hatches.
