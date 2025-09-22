# 🤖 Radar API — Code-Gen Prompts

This document contains the sequential prompts for a code-generation LLM to implement the Radar API step by step. Each prompt builds on the previous, with no orphaned code.

---

## Prompt 1 — Scaffold & Scripts
```text
You are updating an empty repository. Create a NestJS project named "radar-api" using npm. Then adjust package.json scripts and add an e2e Jest config.

Requirements:
1) Initialize with 'nest new radar-api' (npm). If already initialized, skip creation and ensure structure matches a fresh Nest project.
2) In package.json, set scripts:
   - "start": "nest start"
   - "start:dev": "nest start --watch"
   - "test": "jest --passWithNoTests"
   - "test:e2e": "jest --config ./test/jest-e2e.json"
   - "test:cov": "jest --coverage"
3) Create test/jest-e2e.json with a standard Nest e2e Jest config (testMatch on **/*.e2e-spec.ts, ts-jest preset).
4) Ensure ts-jest and @types/jest are installed if not already.

Acceptance:
- 'npm run start' compiles.
- 'npm run test' runs (even with no tests).
- 'npm run test:e2e' recognizes the e2e config.
```

---

## Prompt 2 — ValidationPipe & Swagger
```text
Modify src/main.ts to:
1) Enable global ValidationPipe with { whitelist: true, forbidNonWhitelisted: true, transform: true }.
2) Install @nestjs/swagger and swagger-ui-express. Initialize Swagger with a DocumentBuilder (title "Radar API", version "1.0") and serve at '/docs'.

Acceptance:
- App starts with 'npm run start:dev'.
- Visiting '/docs' serves Swagger UI (though empty for now).
```

---

## Prompt 3 — Radar Module, Interfaces, DTOs
```text
Create feature module and types:
1) Create src/radar/interfaces/target.interface.ts with Coordinates, Enemies, ScanPoint interfaces.
2) Create src/radar/dto/radar-request.dto.ts with nested DTOs using class-validator and class-transformer.
3) Create src/radar/radar.module.ts exporting a module shell.
4) Create src/radar/radar.service.ts with injectable class RadarService (empty for now).
5) Create src/radar/radar.controller.ts with a POST /radar handler that accepts RadarRequestDto but returns placeholder { x:0, y:0 }.
6) Wire RadarModule into AppModule.

Acceptance:
- App compiles and starts.
- Swagger shows /radar POST with DTO schemas.
```

---

## Prompt 4 — Protocol Interface & Registry
```text
Define protocol infrastructure:
1) Create src/radar/protocols/protocol.interface.ts with ProtocolName union and IProtocol interface.
2) Create src/radar/protocols/index.ts exporting PROTOCOLS registry (empty initially).

Acceptance:
- Build still passes.
```

---

## Prompt 5 — Implement Distance Protocols
```text
1) Implement closest-enemies.protocol.ts: sort ascending by Euclidean distance.
2) Implement furthest-enemies.protocol.ts: sort descending by distance.
3) Update PROTOCOLS registry.

Acceptance:
- Compile passes.
```

---

## Prompt 6 — Implement Ally & Mech Protocols
```text
1) assist-allies: allies-first partition.
2) avoid-crossfire: filter out allies.
3) prioritize-mech: mech-first partition; fallback soldiers if none.
4) avoid-mech: filter out mech.

Update PROTOCOLS registry.

Acceptance:
- Compile passes.
```

---

## Prompt 7 — Distance Utility & Pre-filter
```text
1) Add src/radar/utils/distance.util.ts with Euclidean distance and withinRange (<=100).
2) Update RadarService: pre-filter scan points by withinRange before applying protocols.

Acceptance:
- Compile passes.
- Controller returns first remaining point (temporary).
```

---

## Prompt 8 — Protocol Application Flow
```text
In RadarService:
- Resolve protocol names from PROTOCOLS registry.
- Apply each protocol sequentially on candidates.

Acceptance:
- Compile passes.
```

---

## Prompt 9 — Tie-Breakers & Final Selection
```text
In RadarService:
1) Implement tie-breaker comparator: enemies.number desc, mech>soldier, x asc, y asc.
2) After applying protocols, sort if multiple remain and pick first.
3) If none remain, throw NotFoundException.

Update controller to return { error: ... } for 400/404.

Acceptance:
- App compiles and works with manual tests.
```

---

## Prompt 10 — Unit Tests: Protocols
```text
Add unit tests for each protocol under test/radar/protocols/*.spec.ts.

Acceptance:
- All protocol tests pass with 'npm run test'.
```

---

## Prompt 11 — Unit Tests: Service
```text
Add test/radar/radar.service.spec.ts with cases:
- Distance filter
- Protocol order
- Tie-breakers
- No candidates => NotFound

Acceptance:
- All service tests pass.
```

---

## Prompt 12 — E2E Tests
```text
Add test/e2e/radar.e2e-spec.ts testing:
- 200 happy path
- 400 invalid payload
- 404 no target found
- Multi-protocol case

Acceptance:
- All e2e tests pass.
```

---

## Prompt 13 — Swagger Decorators
```text
Add @ApiTags('radar') to controller, @ApiBody, @ApiOkResponse, @ApiBadRequestResponse, @ApiNotFoundResponse.

Acceptance:
- Swagger docs display endpoint and schemas.
```

---

## Prompt 14 — README & Polish
```text
Update README.md with:
- Setup instructions
- Example requests/responses
- Error examples
- Test scripts
- Swagger docs at /docs

Acceptance:
- README is clear, accurate, project builds and runs.
```

---
