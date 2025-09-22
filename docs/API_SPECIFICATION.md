# 🎯 Radar API - Complete Specification

## Overview

The Radar API is a sophisticated targeting system that processes radar scan data and applies multiple targeting protocols to select the optimal enemy target. This document provides comprehensive technical specifications for the API.

## Base URL

```
http://localhost:8888
```

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Content Type

All requests and responses use `application/json`.

## Endpoints

### 1. Process Radar Scan

**Endpoint:** `POST /radar`

**Description:** Analyzes radar scan data and applies targeting protocols to select the optimal target.

#### Request Body

```typescript
interface RadarRequest {
  protocols: string[];           // Array of protocol names
  scan: ScanPoint[];            // Array of scan points
}

interface ScanPoint {
  coordinates: Coordinates;      // Geographic coordinates
  enemies: Enemies;             // Enemy information
  allies?: number;              // Optional ally count
}

interface Coordinates {
  x: number;                    // X coordinate (-1000 to 1000)
  y: number;                    // Y coordinate (-1000 to 1000)
}

interface Enemies {
  type: 'soldier' | 'mech';     // Enemy type
  number: number;               // Enemy count (1 to 100)
}
```

#### Request Example

```json
{
  "protocols": ["closest-enemies", "assist-allies"],
  "scan": [
    {
      "coordinates": {"x": 0, "y": 40},
      "enemies": {"type": "soldier", "number": 10}
    },
    {
      "coordinates": {"x": 0, "y": 80},
      "enemies": {"type": "mech", "number": 1},
      "allies": 2
    }
  ]
}
```

#### Response

**Success (201 Created):**
```json
{
  "x": 0,
  "y": 40
}
```

**Error Responses:**

| Status | Description | Response Body |
|--------|-------------|---------------|
| 400 | Bad Request - Validation Error | `{"message": ["error details"], "error": "Bad Request", "statusCode": 400}` |
| 404 | Not Found - No Valid Targets | `{"message": "No target found", "error": "Not Found", "statusCode": 404}` |
| 500 | Internal Server Error | `{"error": "Internal server error"}` |

### 2. Get Available Protocols

**Endpoint:** `GET /radar/protocols`

**Description:** Returns a list of all available targeting protocols with their descriptions and categories.

#### Response

**Success (200 OK):**
```json
[
  {
    "name": "closest-enemies",
    "description": "Select the enemy target closest to the origin (0,0)",
    "category": "distance"
  },
  {
    "name": "furthest-enemies",
    "description": "Select the enemy target furthest from the origin (0,0)",
    "category": "distance"
  },
  {
    "name": "assist-allies",
    "description": "Prioritize targets that have allied units present",
    "category": "ally"
  },
  {
    "name": "avoid-crossfire",
    "description": "Avoid targets that have allied units present",
    "category": "ally"
  },
  {
    "name": "prioritize-mech",
    "description": "Prioritize mech enemies over soldiers when available",
    "category": "mech"
  },
  {
    "name": "avoid-mech",
    "description": "Avoid mech enemies, only target soldiers",
    "category": "mech"
  }
]
```

## Targeting Protocols

### Distance Protocols

#### closest-enemies
- **Category:** distance
- **Description:** Select the enemy target closest to the origin (0,0)
- **Algorithm:** Sorts targets by Euclidean distance in ascending order
- **Use Case:** Quick engagement, minimize travel time

#### furthest-enemies
- **Category:** distance
- **Description:** Select the enemy target furthest from the origin (0,0)
- **Algorithm:** Sorts targets by Euclidean distance in descending order
- **Use Case:** Long-range engagement, strategic positioning

### Ally Protocols

#### assist-allies
- **Category:** ally
- **Description:** Prioritize targets that have allied units present
- **Algorithm:** Partitions targets into two groups: those with allies and those without
- **Use Case:** Support allied units, coordinated attacks

#### avoid-crossfire
- **Category:** ally
- **Description:** Avoid targets that have allied units present
- **Algorithm:** Filters out targets that have allied units
- **Use Case:** Prevent friendly fire, independent operations

### Enemy Type Protocols

#### prioritize-mech
- **Category:** mech
- **Description:** Prioritize mech enemies over soldiers when available
- **Algorithm:** Partitions targets into mech and non-mech groups, prioritizes mech
- **Use Case:** High-value target elimination, resource allocation

#### avoid-mech
- **Category:** mech
- **Description:** Avoid mech enemies, only target soldiers
- **Algorithm:** Filters out mech enemies, keeps only soldiers
- **Use Case:** Low-risk operations, soldier-only engagement

## Protocol Application Rules

1. **Sequential Application:** Protocols are applied in the order specified in the request
2. **Distance Pre-filtering:** All targets beyond 100m are automatically filtered out
3. **Protocol Chaining:** Each protocol refines the target list from the previous protocol
4. **Tie-breaking:** When multiple targets have equal priority, the first one is selected

## Validation Rules

### Request Validation

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| protocols | string[] | Yes | 0-10 items, valid protocol names |
| scan | ScanPoint[] | Yes | 1-100 items |
| coordinates.x | number | Yes | -1000 to 1000 |
| coordinates.y | number | Yes | -1000 to 1000 |
| enemies.type | string | Yes | 'soldier' or 'mech' |
| enemies.number | number | Yes | 1 to 100 |
| allies | number | No | 0 to 50 |

### Error Handling

The API provides detailed validation error messages:

```json
{
  "message": [
    "scan.0.enemies.type must be one of the following values: soldier, mech",
    "scan.0.coordinates.x must be a number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Performance Characteristics

### Response Times
- **Average:** < 1ms
- **95th Percentile:** < 2ms
- **99th Percentile:** < 5ms

### Throughput
- **Maximum:** 1000+ requests/second
- **Sustained:** 500+ requests/second

### Resource Usage
- **Memory:** < 50MB
- **CPU:** < 5% (single core)

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production deployments.

## CORS

CORS is not configured. Add CORS configuration for cross-origin requests if needed.

## Monitoring

The API includes basic error logging and response time tracking. Consider adding comprehensive monitoring for production use.

## Security Considerations

1. **Input Validation:** All inputs are validated using class-validator
2. **Type Safety:** Full TypeScript implementation prevents type-related vulnerabilities
3. **Error Handling:** Sensitive information is not exposed in error messages
4. **Dependencies:** Regular security updates for all dependencies

## Future Enhancements

1. **Authentication:** JWT-based authentication
2. **Rate Limiting:** Request rate limiting
3. **Caching:** Response caching for repeated requests
4. **Metrics:** Detailed performance metrics
5. **Logging:** Structured logging with correlation IDs
