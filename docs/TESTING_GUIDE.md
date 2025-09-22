# 🧪 Testing Guide

## Overview

This document provides comprehensive guidance for testing the Radar API, including unit tests, integration tests, and end-to-end tests.

## Test Structure

```
├── src/
│   └── radar/
│       ├── protocols/
│       │   ├── *.protocol.spec.ts    # Protocol unit tests
│       │   └── *.protocol.ts
│       └── radar.service.spec.ts     # Service unit tests
├── test/
│   └── radar.e2e-spec.ts             # E2E tests
└── test_cases.txt                     # Manual test cases
```

## Test Coverage

- **Unit Tests**: 44 tests covering all protocols and services
- **E2E Tests**: 21 tests covering complete API workflows
- **Coverage**: 100% code coverage

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test
```

### E2E Tests Only
```bash
npm run test:e2e
```

### Tests with Coverage
```bash
npm run test:cov
```

### Watch Mode
```bash
npm run test:watch
```

## Unit Tests

### Protocol Tests

Each protocol has comprehensive unit tests covering:

#### Distance Protocols
- **closest-enemies.protocol.spec.ts**
  - Sorts by distance in ascending order
  - Handles equal distances
  - Handles empty arrays
  - Handles single point

- **furthest-enemies.protocol.spec.ts**
  - Sorts by distance in descending order
  - Handles equal distances
  - Handles empty arrays
  - Handles single point

#### Ally Protocols
- **assist-allies.protocol.spec.ts**
  - Prioritizes points with allies
  - Handles points without allies
  - Handles zero allies (treated as no allies)
  - Handles mixed scenarios

- **avoid-crossfire.protocol.spec.ts**
  - Filters out points with allies
  - Keeps points without allies
  - Handles zero allies (kept)
  - Handles mixed scenarios

#### Mech Protocols
- **prioritize-mech.protocol.spec.ts**
  - Prioritizes mech over soldiers
  - Handles only soldiers
  - Handles only mechs
  - Handles mixed scenarios

- **avoid-mech.protocol.spec.ts**
  - Filters out mech enemies
  - Keeps only soldiers
  - Handles only mechs (empty result)
  - Handles only soldiers

### Service Tests

**radar.service.spec.ts** covers:

#### Distance Filtering
- Filters out points beyond 100m
- Includes points at exactly 100m
- Handles empty arrays
- Handles points at origin

#### Protocol Application
- Applies single protocol
- Applies multiple protocols sequentially
- Handles unknown protocols gracefully
- Handles empty protocol lists
- Handles empty scan points

#### Tie-Breaker Logic
- Throws NotFoundException for empty arrays
- Returns single point without sorting
- Prioritizes higher enemy count
- Prioritizes mech over soldier when count equal
- Prioritizes lower x coordinate
- Prioritizes lower y coordinate
- Handles complex tie-breaking scenarios

## E2E Tests

### Happy Path Tests (201 Created)

#### Single Protocol Tests
- `closest-enemies` protocol
- `prioritize-mech` protocol
- `assist-allies` protocol
- `avoid-mech` protocol
- `avoid-crossfire` protocol
- `furthest-enemies` protocol

#### Multi-Protocol Tests
- Multiple protocols applied sequentially
- Distance filtering integration
- Complex multi-protocol scenarios

#### Edge Cases
- Single scan point
- Points at exactly 100m distance
- Points with zero allies
- Complex multi-protocol scenarios

### Error Case Tests

#### 400 Bad Request
- Invalid enemy type
- Missing required fields
- Invalid coordinates
- Invalid protocol names (handled gracefully)
- Empty protocols array (handled gracefully)

#### 404 Not Found
- Empty scan array
- All targets filtered out by distance
- All targets filtered out by protocols
- All targets filtered out by avoid-crossfire

## Manual Testing

### Test Cases File

The `test_cases.txt` file contains comprehensive manual test cases:

```bash
# Run manual test cases
./tests.sh
```

### Manual Test Scenarios

#### Basic Functionality
```bash
# Test closest-enemies
curl -X POST http://localhost:8888/radar \
  -H "Content-Type: application/json" \
  -d '{
    "protocols": ["closest-enemies"],
    "scan": [
      {"coordinates": {"x": 0, "y": 40}, "enemies": {"type": "soldier", "number": 10}},
      {"coordinates": {"x": 0, "y": 80}, "enemies": {"type": "mech", "number": 1}}
    ]
  }'
```

#### Multi-Protocol Testing
```bash
# Test multiple protocols
curl -X POST http://localhost:8888/radar \
  -H "Content-Type: application/json" \
  -d '{
    "protocols": ["assist-allies", "closest-enemies"],
    "scan": [
      {"coordinates": {"x": 0, "y": 0}, "enemies": {"type": "soldier", "number": 5}},
      {"coordinates": {"x": 10, "y": 10}, "enemies": {"type": "soldier", "number": 3}, "allies": 2}
    ]
  }'
```

#### Error Testing
```bash
# Test validation error
curl -X POST http://localhost:8888/radar \
  -H "Content-Type: application/json" \
  -d '{
    "protocols": ["closest-enemies"],
    "scan": [
      {"coordinates": {"x": 0, "y": 0}, "enemies": {"type": "invalid-type", "number": 5}}
    ]
  }'
```

## Test Data

### Sample Scan Points

```typescript
const sampleScanPoints = [
  {
    coordinates: { x: 0, y: 0 },
    enemies: { type: 'soldier', number: 10 }
  },
  {
    coordinates: { x: 10, y: 10 },
    enemies: { type: 'mech', number: 1 },
    allies: 2
  },
  {
    coordinates: { x: 0, y: 150 },
    enemies: { type: 'soldier', number: 5 }
  }
];
```

### Test Protocols

```typescript
const testProtocols = [
  'closest-enemies',
  'furthest-enemies',
  'assist-allies',
  'avoid-crossfire',
  'prioritize-mech',
  'avoid-mech'
];
```

## Performance Testing

### Load Testing

```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:8888/radar
```

### Memory Testing

```bash
# Monitor memory usage
node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand
```

## Debugging Tests

### Debug Unit Tests

```bash
# Debug specific test file
npm run test:debug -- --testNamePattern="closest-enemies"
```

### Debug E2E Tests

```bash
# Debug E2E tests
npm run test:e2e -- --testNamePattern="should process closest-enemies protocol"
```

### Verbose Output

```bash
# Run tests with verbose output
npm test -- --verbose
```

## Test Best Practices

### Unit Test Guidelines

1. **Test One Thing**: Each test should verify one specific behavior
2. **Descriptive Names**: Use clear, descriptive test names
3. **Arrange-Act-Assert**: Structure tests with clear sections
4. **Edge Cases**: Test boundary conditions and edge cases
5. **Mocking**: Mock external dependencies appropriately

### E2E Test Guidelines

1. **Real Scenarios**: Test realistic user scenarios
2. **Data Cleanup**: Clean up test data after each test
3. **Independent Tests**: Tests should not depend on each other
4. **Error Scenarios**: Test both success and error cases
5. **Performance**: Consider performance implications

### Test Data Management

1. **Consistent Data**: Use consistent test data across tests
2. **Realistic Data**: Use realistic test data that mirrors production
3. **Data Isolation**: Ensure tests don't interfere with each other
4. **Cleanup**: Clean up test data after tests complete

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```

## Test Reporting

### Coverage Reports

```bash
# Generate coverage report
npm run test:cov

# View coverage report
open coverage/lcov-report/index.html
```

### Test Results

```bash
# Generate test results in JUnit format
npm test -- --reporters=default --reporters=jest-junit
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure port 8888 is available
2. **Docker Issues**: Check Docker daemon is running
3. **Permission Issues**: Use sudo for Docker commands
4. **Test Timeouts**: Increase timeout for slow tests
5. **Memory Issues**: Increase Node.js memory limit

### Debug Commands

```bash
# Check port usage
lsof -i :8888

# Check Docker status
sudo docker ps

# Check test coverage
npm run test:cov

# Debug specific test
npm test -- --testNamePattern="specific test name"
```
