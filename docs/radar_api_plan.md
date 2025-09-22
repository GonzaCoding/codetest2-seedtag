# 📝 Radar API — Implementation Plan

This document provides a detailed, step-by-step blueprint for building the Radar API project.

---

# 🔭 Project Blueprint

## Goal
Build a **NestJS** API exposing a single endpoint `POST /radar` that selects the **next target** to attack based on **protocols** and **scan** data. Return `{ "x": number, "y": number }` or an error JSON.

## Core Requirements
- Endpoint: `POST /radar`
- Request: `{ protocols: string[], scan: ScanPoint[] }`
- Response: `{ x: number, y: number }`
- Distance rule: origin at (0,0), **Euclidean**; ignore targets beyond **100** units.
- Protocols (apply in payload order):
  - closest-enemies, furthest-enemies
  - assist-allies, avoid-crossfire
  - prioritize-mech, avoid-mech
- Tie-breakers: 1) enemy count, 2) mech > soldier, 3) x asc, 4) y asc
- Validation: DTOs with class-validator
- Error handling: 400 invalid payload, 404 no target found
- Non-functional: NestJS + TS, Jest tests, Swagger docs, basic logger

## Domain Model
- Coordinates, Enemies, ScanPoint
- Protocol classes implementing a common interface

## Architecture
- main.ts → bootstrap, ValidationPipe, Swagger
- app.module.ts → root
- radar module with controller, service, dto, protocols, interfaces

## Selection Algorithm
1. Filter >100 distance
2. Apply protocols sequentially
3. Apply tie-breakers
4. Return final target or 404

## Testing Plan
- Unit: protocols, service, DTO validation
- E2E: happy path, invalid, not found, multi-protocol
- Jest scripts: test, test:e2e, test:cov

## Documentation
- Swagger at /docs
- README with setup, run, tests, examples

---

# 🧱 Iteration Round 1: Milestones

- **M0**: Scaffolding & Tooling
- **M1**: Domain & DTOs
- **M2**: Protocol Interface & Implementations
- **M3**: Service Logic
- **M4**: Controller & Error Mapping
- **M5**: Tests
- **M6**: Docs & Polish

---

# 🪜 Iteration Round 2: Break into Small Chunks

### M0
- Init project, scripts, ValidationPipe, Swagger

### M1
- Add interfaces, DTOs, module, controller stub, service stub

### M2
- Protocol interface + each protocol class
- Registry mapping names → classes

### M3
- Distance utils, pre-filter
- Apply protocols loop
- Tie-breakers
- Final selection

### M4
- Controller wiring, error mapping, logger

### M5
- Unit tests protocols
- Unit tests service
- E2E tests

### M6
- Swagger decorators
- README polish

---

# 🧩 Iteration Round 3: Micro-Steps

1. Scaffold project (nest new)
2. Adjust package.json scripts
3. Add e2e Jest config
4. Add ValidationPipe
5. Add Swagger config
6. Create interfaces
7. Create DTOs
8. Create module/service/controller stubs
9. Implement protocols one by one
10. Add registry
11. Add distance utils
12. Implement service logic (filter → apply → tie-break → final)
13. Wire controller → service
14. Handle errors 400/404
15. Add logging
16. Unit tests for protocols
17. Unit tests for service
18. E2E tests for controller
19. Add Swagger decorators
20. Write README
21. Final lint/format

---

# ✅ Review
- Steps are small, safe, incremental
- Each step compiles and integrates
- End product: tested, documented, production-ready Radar API
