---
title: "Day 06: Prisma ORM & End-to-End Type Safety"
date: "June 26, 2026"
tag: Integration
---

Writing raw SQL strings inside TypeScript defeats half the purpose of using TypeScript. 

Today, I migrated all database reads and writes to **Prisma**. 

*EP-004: Depend on abstractions, not implementations.*

Prisma acts as an abstraction over PostgreSQL. Now, every single database query is fully type-checked. If I misspell a column name, the app won't even compile. The complete migration of the backend from JS to TS is finally done. We have officially removed all raw PostgreSQL access.
