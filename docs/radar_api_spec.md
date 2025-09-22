# 🚀 Radar API — Developer Specification

## 1. Project Overview
We need to build a **NestJS application** that exposes a **single API endpoint**:

- **Endpoint**: `POST /radar`  
- **Purpose**: Given a set of detected enemy positions and operational protocols, determine **the next point to attack**.  
- **Response**: `{x, y}` coordinates of the selected target.  

The service must strictly follow **protocol rules**, apply **filters and tie-breakers**, handle **errors gracefully**, and provide **tests and documentation**.

---

## 2. Requirements

### Functional
- Accept a JSON payload containing:
  - `protocols`: array of strings defining selection strategies.
  - `scan`: array of detected enemy positions.
- Return the coordinates of the **next attack target**.
- Apply protocols in **the order provided**.
- Enforce **distance limit of 100 units**.
- Return consistent, deterministic results using defined **tie-breakers**.
- Reject invalid requests with proper error messages.

### Non-Functional
- Implemented in **NestJS** with **TypeScript**.
- Use **class-validator** for input validation.
- Use **NestJS Logger** for basic logging.
- Provide **Swagger docs** at `/docs`.
- Include **unit and e2e tests** with Jest + supertest.
- No Docker required — runnable via `npm run start:dev`.

---

## 3. API Design

### Request Schema
```json
{
  "protocols": ["avoid-mech", "closest-enemies"],
  "scan": [
    {
      "coordinates": { "x": 0, "y": 40 },
      "enemies": { "type": "soldier", "number": 10 }
    },
    {
      "coordinates": { "x": 80, "y": 70 },
      "enemies": { "type": "mech", "number": 5 },
      "allies": 3
    }
  ]
}
```

### Response Schema
✅ Success:
```json
{ "x": 0, "y": 40 }
```

❌ Invalid Payload:
```json
{ "error": "invalid payload" }
```

❌ No Target Found:
```json
{ "error": "target not found" }
```

---

## 4. Protocol Rules

- **closest-enemies** → pick nearest enemy by Euclidean distance from `(0,0)`.
- **furthest-enemies** → pick farthest enemy.
- **assist-allies** → prioritize points with allies.
- **avoid-crossfire** → exclude points with allies.
- **prioritize-mech** → prefer mechs, fallback to soldiers.
- **avoid-mech** → exclude mechs entirely.

👉 Multiple protocols can be provided; they are applied **in request order**.

---

## 5. Filters
- Compute **Euclidean distance** from `(0,0)`.  
- Discard any target with `distance > 100`.  

---

## 6. Tie-Breakers
If multiple candidates remain:
1. Higher **enemy count**.
2. Prefer **mech** over soldier.
3. Lower **x**, then lower **y**.

---

## 7. Error Handling
- **400 Bad Request** if payload is malformed or missing fields.  
- **404 Not Found** if no valid target survives filtering.  
- Always respond with a JSON object containing an `"error"` message.

---

## 8. Architecture & Structure

```
src/
 ├── app.module.ts
 ├── main.ts
 ├── radar/
 │    ├── radar.module.ts
 │    ├── radar.controller.ts   # Defines POST /radar
 │    ├── radar.service.ts      # Implements business logic
 │    ├── dto/
 │    │    └── radar-request.dto.ts
 │    ├── interfaces/
 │    │    └── target.interface.ts
 │    └── protocols/
 │         ├── protocol.interface.ts
 │         ├── closest-enemies.protocol.ts
 │         ├── furthest-enemies.protocol.ts
 │         ├── assist-allies.protocol.ts
 │         ├── avoid-crossfire.protocol.ts
 │         ├── prioritize-mech.protocol.ts
 │         └── avoid-mech.protocol.ts
test/
 ├── radar/
 │    ├── radar.service.spec.ts
 │    ├── radar.controller.spec.ts
 │    ├── protocols/
 │    │    └── closest-enemies.protocol.spec.ts
 └── e2e/
      └── radar.e2e-spec.ts
```

---

## 9. Validation

### DTO Example
```ts
export class CoordinatesDto {
  @IsInt() x: number;
  @IsInt() y: number;
}

export class EnemiesDto {
  @IsIn(["soldier", "mech"]) type: string;
  @IsInt() @Min(1) number: number;
}

export class ScanDto {
  @ValidateNested() @Type(() => CoordinatesDto) coordinates: CoordinatesDto;
  @ValidateNested() @Type(() => EnemiesDto) enemies: EnemiesDto;
  @IsOptional() @IsInt() @Min(0) allies?: number;
}

export class RadarRequestDto {
  @IsArray() @ArrayNotEmpty()
  @IsIn(
    [
      "closest-enemies",
      "furthest-enemies",
      "assist-allies",
      "avoid-crossfire",
      "prioritize-mech",
      "avoid-mech"
    ],
    { each: true }
  )
  protocols: string[];

  @IsArray() @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ScanDto)
  scan: ScanDto[];
}
```

---

## 10. Service Logic
1. Filter out targets with `distance > 100`.
2. Sequentially apply each protocol from `protocols`.
3. If multiple remain → apply tie-breakers.
4. If none remain → throw 404.
5. Return `{x, y}` of selected target.

---

## 11. Testing Plan

### Unit Tests
- ✅ Protocol logic individually.
- ✅ RadarService applying multiple protocols.
- ✅ DTO validation errors.
- ✅ Tie-breaker resolution.

### E2E Tests
- ✅ Happy path request → 200 `{x,y}`.
- ❌ Invalid payload → 400 `{error}`.
- ❌ No target found → 404 `{error}`.
- ✅ Multiple protocols applied correctly.

### Scripts
```json
"scripts": {
  "start": "nest start",
  "start:dev": "nest start --watch",
  "test": "jest --passWithNoTests",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  "test:cov": "jest --coverage"
}
```

---

## 12. Documentation

- Swagger docs served at **`/docs`**.
- README must include:
  - Installation and run instructions.
  - Testing instructions.
  - Example requests/responses.
  - Error cases.
  - Swagger link.

---

## 13. Deliverables

- ✅ Full NestJS project.  
- ✅ Unit + e2e tests passing.  
- ✅ Swagger docs available at `/docs`.  
- ✅ README.md with usage instructions.  
