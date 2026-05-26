# gql-project-mgr — Claude Context

## What This Service Is

A NestJS Apollo Federation 2 subgraph for project management. Part of the personal-enterprise federated GraphQL layer.

Created from `gql-subgraph-template`. All patterns, structure, and tooling are inherited from that template — refer to its CLAUDE.md for the full reference on patterns, conventions, and setup.

---

## Domains

### `projects`
Project tracking — name, description, status, dates, etc.

| Detail | Value |
|---|---|
| ID prefix | `PRJ-` |
| Collection env var | `PROJECTS_COLLECTION` |
| Collection default | `projects` |

### `tasks`
Tasks always belong to a project (`projectId` required). Separate domain and collection — not embedded in project documents — so tasks can be queried independently (e.g. all tasks due this week across projects).

| Detail | Value |
|---|---|
| ID prefix | `TSK-` |
| Collection env var | `TASKS_COLLECTION` |
| Collection default | `tasks` |

---

## Current State

- Created from `gql-subgraph-template` via GitHub template
- `package.json` name updated to `gql-project-mgr`
- No domain code written yet — `example/` domain from template is still in place as reference
- **Next**: build `projects` domain, then `tasks` domain; remove `example/` once both are working
