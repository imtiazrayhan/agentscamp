---
name: "pagination-designer"
description: "Design correct, scalable pagination (plus the filtering and sorting that ride with it) for a list endpoint — pick cursor (keyset) vs offset and justify it, define an opaque cursor with a unique tiebreaker so no row is skipped or repeated, return a consistent envelope, bound page size, and name the indexes the sort actually needs. Use when adding a list endpoint, when OFFSET pagination crawls on a large table, or when clients see duplicate or missing rows while paging."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["architecture"]
related: ["skill:rate-limiter-designer", "skill:postgres-index-strategist", "skill:structured-logging-designer"]
featured: false
summary: "Pagination breaks two quiet ways: OFFSET goes O(n), scanning then discarding every prior row on deep pages; a non-unique sort key without a tiebreaker silently drops or duplicates rows across pages. This skill picks cursor vs offset, designs an opaque cursor on (sort key + tiebreaker), bounds page size, names the required indexes, and defines how filters and sorts compose."
---

Pagination looks trivial until the table grows or the data moves under the reader. `OFFSET 100000` doesn't skip to row 100,000 — the database scans and throws away the first 100,000 matching rows on every request, so latency climbs linearly with depth. And sorting by a non-unique column (`created_at`, `name`, `score`) without a tiebreaker gives a *partial* order: rows that tie can reorder between requests, so paging skips some and shows others twice. This skill makes the pagination scheme an explicit decision — keyset vs offset, the cursor encoding, the tiebreaker, the page-size bounds, and the indexes — and defines how filtering and sorting compose with it.

## When to use this skill

- You're adding a list/collection endpoint and need to decide how clients page through it.
- An existing `OFFSET`/`LIMIT` endpoint is fast on page 1 and slow on page 500, or it times out on deep pages.
- Clients report seeing the same row twice or missing rows entirely while scrolling — the classic symptom of an unstable sort under concurrent inserts/deletes.
- The list is large, append-heavy, or actively changing (feeds, logs, events, search results) and you need stable paging that doesn't drift as rows are added.

## Instructions

1. **Choose cursor (keyset) vs offset from the dataset, and justify it.**
   - **Cursor / keyset** — the default for large or actively-changing data. Instead of `OFFSET`, the next page *seeks* on the sort key: `WHERE (created_at, id) < (:last_created_at, :last_id) ORDER BY created_at DESC, id DESC LIMIT :n`. It's stable under inserts/deletes (each page is anchored to a real row, not a positional count) and stays fast at any depth because it uses an index range scan instead of scanning prior rows. Cost: no random page jumps, no total page count.
   - **Offset / limit** — acceptable only for **small, stable, human-paginated** lists where users click numbered pages (an admin table of a few thousand rows). It allows arbitrary jumps and easy "page 7 of 20" UIs. Never use it for infinite scroll, large tables, or feeds.
   State which you chose and the property (depth performance + stability vs random access) that drove it.

2. **Always include a unique tiebreaker so the sort order is total.** A cursor seeking on a non-unique column alone (`created_at`) can't disambiguate ties: two rows with the same timestamp have no defined relative order, so one can land on both sides of a page boundary. Encode the user-facing sort key **plus a unique, monotonic tiebreaker** (the primary key) — the cursor compares on the tuple `(created_at, id)`. This makes the order total: every row has exactly one position, so no row is skipped or repeated. Even when the apparent sort is "by id" alone, that already happens to be unique — but any user-chosen sort needs the explicit `, id` tiebreaker appended.

3. **Make the cursor opaque.** Encode the tuple `(sort_key_value, tiebreaker_value)` (and, if filters/sort are part of the page identity, a version or the sort direction) into a single base64url token — `next_cursor: "eyJjcmVhdGVkX2F0IjoiMjAyNi0wNi0xN1QwOTozMDowMFoiLCJpZCI6IjQ4ODEyIn0"`. Opaque means clients treat it as a blob and pass it back verbatim; you keep freedom to change the internal encoding without breaking them. Do **not** expose raw `(timestamp, id)` as query params — clients will hand-craft them, couple to your schema, and break on the next change.

4. **Return one consistent envelope.** Every list endpoint returns the same shape:
   ```json
   { "data": [ ... ], "next_cursor": "…", "has_more": true }
   ```
   `next_cursor` is `null` when there are no more rows. Derive `has_more` reliably by fetching `LIMIT n + 1`: if you get `n + 1` rows, there's another page — drop the extra row and set `next_cursor` from the last *kept* row. This avoids a separate `COUNT` and is correct even when the last page is exactly full. Do not return a total count for keyset pagination; computing it scans the whole filtered set and defeats the point.

5. **Bound page size with a sane default and a hard max.** Read the page size from `limit` (or `page_size`), clamp it: default 20–50, hard max 100–200 — never unbounded. An unbounded `limit` lets one client request a million rows and OOM the server or exhaust the DB. Clamp silently (return `min(requested, max)`) and document the cap.

6. **Name the indexes the sort actually needs — this is non-negotiable for keyset.** The `ORDER BY (sort_key, tiebreaker)` and the `WHERE (sort_key, tiebreaker) < (...)` seek are only fast if a **composite index on those exact columns in that exact order and direction** exists. Sorting `created_at DESC, id DESC` needs an index supporting that; a plain index on `created_at` alone forces a sort and undoes the win. If filters narrow the set, the index should lead with the equality-filter columns, then the sort columns: `(tenant_id, created_at, id)` for a query filtered by tenant and sorted by time. Verify the index exists or flag it as required.

7. **Define how filtering and sorting compose with the cursor.** The cursor is only valid *for the filter and sort it was issued under* — a cursor minted for `?status=active&sort=created_at` is meaningless if the next request changes `status` or `sort`. Specify the contract: which fields are filterable, which are sortable (whitelist them — never interpolate a client-supplied column name into `ORDER BY`), and that **changing any filter or sort param invalidates the cursor and resets to the first page**. For multi-column sorts, the tiebreaker is appended after *all* user sort columns, and the seek predicate must compare the full tuple (row-value comparison `(a, b, c) < (:a, :b, :c)`, not `a < :a OR (a = :a AND b < :b) OR …` unless your engine lacks tuple comparison).

> [!WARNING]
> Deep `OFFSET` is O(n), not O(1). `OFFSET 100000 LIMIT 20` makes the database read and discard 100,000 matching rows before returning 20 — every request, getting worse as users page deeper, holding locks and burning IO the whole time. Page 1 being fast tells you nothing about page 5,000. If the table can grow large or users can reach deep pages, use keyset.

> [!WARNING]
> A non-unique sort key without a tiebreaker silently corrupts paging. With `ORDER BY created_at` and several rows sharing a timestamp, the engine may return those tied rows in a different order on the next request — so a row sitting on the page boundary gets skipped on one page and the previous boundary row reappears on the next. There is no error, just missing and duplicated data. Always append a unique tiebreaker (`, id`) to every sort.

> [!NOTE]
> Offset and keyset can coexist behind one envelope: serve numbered offset pages for a small admin UI and keyset for the public feed, both returning `{ data, next_cursor, has_more }` (offset endpoints simply also accept `page`/leave `next_cursor` null). Pick per endpoint from its access pattern, not one rule for the whole API.

## Output

A pagination spec stating: the chosen **scheme** (cursor vs offset) + rationale; the **response envelope** (`data` / `next_cursor` / `has_more`, with the `null`-when-done and `LIMIT n+1` rules); the **cursor encoding** — the exact tuple `(sort key, unique tiebreaker)` and that it's base64url-opaque; the **page-size** default and hard max; the **required indexes** (exact columns, order, and direction, leading with equality-filter columns); and the **filter/sort contract** — the filterable/sortable field whitelist, the tuple seek predicate, and that changing any filter or sort param invalidates the cursor.