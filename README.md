# gql-project-mgr

A NestJS Apollo Federation 2 subgraph for project management. Part of the [personal-enterprise](https://github.com/Strangebrewer/personal-enterprise) federated GraphQL layer.

---

## Domains

**projects** — Project tracking: name, description, status, dates, and other project-level metadata.

**tasks** — Task tracking within projects. Tasks always belong to a project but are stored in a separate collection — not embedded — so they can be queried independently across projects.

---

## Setup & Patterns

This service was created from [gql-subgraph-template](https://github.com/Strangebrewer/gql-subgraph-template). Refer to that repo for:

- Project structure and six-file domain pattern
- Local dev setup and environment variables
- JWT auth and MongoDB connection patterns
- Running and testing instructions
