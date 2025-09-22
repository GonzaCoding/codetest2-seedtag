# 📘 Radar API — Detailed Specification

## 1. Overview
We need a **NestJS application** exposing a single endpoint:

- `POST /radar`
- Accepts a JSON payload with **protocols** and **scan** data.
- Returns the **next target coordinates `{x,y}`** or an **error**.

The service applies **protocol rules** in order, filters out invalid candidates, applies tie-breakers, and returns one deterministic target.

---

## 2. Request Schema

### Example Request
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

### Rules
- **protocols**: array of strings (each one must match a known protocol).
- **scan**: array of points, each containing:
  - `coordinates: { x: number, y: number }`
  - `enemies: { type: "soldier" | "mech", number: number }`
  - `allies?: number`

---

## 3. Response Schema

### Success Response
```json
{ "x": 0, "y": 40 }
```

### Error Responses
- **400 Bad Request**
  ```json
  { "error": "invalid payload" }
  ```
- **404 Not Found**
  ```json
  { "error": "target not found" }
  ```

---

## 4. Protocol Rules

- **closest-enemies** → prioritize nearest enemy (Euclidean distance from (0,0)).
- **furthest-enemies** → prioritize farthest enemy.
- **assist-allies** → prioritize points with allies.
- **avoid-crossfire** → exclude points with allies.
- **prioritize-mech** → prefer mech targets, fallback to soldier if none.
- **avoid-mech** → exclude mechs entirely.

### Multiple Protocols
- Applied **in the order they appear** in the payload.

---

## 5. Filters
- Ignore any target with **distance > 100**.
- If **all enemies are filtered**, return `404 target not found`.

---

## 6. Tie-breaker Rules
When multiple candidates remain after protocol application:
1. **Number of enemies** (prefer more).  
2. **Enemy type** (prefer mech over soldier).  
3. **Coordinates**: lower `x`; if still tied, lower `y`.

---

## 7. Project Structure

```
src/
 ├── app.module.ts
 ├── main.ts
 ├── radar/
 │    ├── radar.module.ts
 │    ├── radar.controller.ts
 │    ├── radar.service.ts
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
 │    │    ├── closest-enemies.protocol.spec.ts
 │    │    ├── ...
 └── e2e/
      └── radar.e2e-spec.ts
```

---

## 8. Validation

Using **class-validator**:

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
  @IsArray()
  @ArrayNotEmpty()
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

## 9. Service Logic

- **Step 1**: Filter out points with `distance > 100`.  
- **Step 2**: Apply each protocol in request order.  
- **Step 3**: If multiple remain, apply tie-breakers.  
- **Step 4**: Return `{x, y}` of selected target.  
- **Step 5**: If none remain, throw 404.  

---

## 10. Testing

### Unit Tests
- Each protocol individually.  
- RadarService applying protocols.  
- DTO validation errors.  
- Tie-breakers.  

### E2E Tests (supertest)
- ✅ Happy path (target found).  
- ❌ Invalid payload → 400.  
- ❌ No target found → 404.  
- ✅ Multiple protocols applied.  

---

## 11. Swagger Docs

- Installed with `@nestjs/swagger`.  
- Exposed at `/docs`.  
- Documents request/response schemas for `/radar`.

---

## 12. Scripts

In `package.json`:

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

## 13. README.md

### Contents
- Setup (`npm install`, `npm run start:dev`).  
- Running tests (`npm run test`, `npm run test:e2e`, `npm run test:cov`).  
- Example request/response.  
- Error cases.  
- Swagger docs at `/docs`.  
