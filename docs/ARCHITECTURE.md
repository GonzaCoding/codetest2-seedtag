# 🏗️ Architecture Documentation

## Overview

The Radar API is built using a modular, scalable architecture that follows enterprise-grade patterns and best practices. This document provides a comprehensive overview of the system architecture, design decisions, and implementation details.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  HTTP Client  │  Swagger UI  │  Load Balancer  │  API Gateway │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  NestJS Application  │  Validation  │  Error Handling  │  Logging │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Radar Controller  │  Radar Service  │  Protocol Registry  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Protocol Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Distance Protocols  │  Ally Protocols  │  Mech Protocols  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Utility Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Distance Utils  │  Validation Utils  │  Error Utils  │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Strategy Pattern

**Implementation**: Protocol System

Each targeting protocol implements the `IProtocol` interface, allowing for dynamic protocol selection and application.

```typescript
interface IProtocol {
  name: ProtocolName;
  apply(scanPoints: ScanPoint[]): ScanPoint[];
}
```

**Benefits**:
- Easy to add new protocols
- Protocol behavior is encapsulated
- Runtime protocol selection
- Testable individual protocols

### 2. Factory Pattern

**Implementation**: Protocol Registry

The protocol registry acts as a factory for protocol instances, providing a centralized way to access and manage protocols.

```typescript
export const PROTOCOLS: Map<string, IProtocol> = new Map();
```

**Benefits**:
- Centralized protocol management
- Easy protocol discovery
- Consistent protocol instantiation
- Runtime protocol resolution

### 3. DTO Pattern

**Implementation**: Data Transfer Objects

Request and response data are handled through strongly-typed DTOs with validation.

```typescript
export class RadarRequestDto {
  @IsArray()
  @IsString({ each: true })
  protocols: string[];

  @IsArray()
  @ValidateNested({ each: true })
  scan: ScanPointDto[];
}
```

**Benefits**:
- Type safety
- Automatic validation
- Clear API contracts
- Documentation generation

### 4. Dependency Injection

**Implementation**: NestJS DI Container

All dependencies are managed through NestJS's built-in dependency injection system.

```typescript
@Injectable()
export class RadarService {
  constructor(private readonly protocolRegistry: ProtocolRegistry) {}
}
```

**Benefits**:
- Loose coupling
- Easy testing
- Configuration management
- Lifecycle management

## Module Architecture

### Core Modules

#### 1. AppModule
- **Purpose**: Root module that orchestrates the entire application
- **Responsibilities**: Module imports, global configuration
- **Dependencies**: RadarModule

#### 2. RadarModule
- **Purpose**: Core business logic module
- **Responsibilities**: Radar processing, protocol management
- **Dependencies**: None (leaf module)

### Module Structure

```
AppModule
└── RadarModule
    ├── RadarController
    ├── RadarService
    ├── ProtocolRegistry
    ├── DistanceUtils
    └── DTOs
        ├── RadarRequestDto
        ├── RadarResponseDto
        └── ProtocolInfoDto
```

## Data Flow

### 1. Request Processing Flow

```
HTTP Request
    ↓
ValidationPipe (Global)
    ↓
RadarController.processRadar()
    ↓
RadarService.preFilterByDistance()
    ↓
RadarService.applyProtocols()
    ↓
Protocol.apply() (for each protocol)
    ↓
RadarController (return response)
    ↓
HTTP Response
```

### 2. Protocol Application Flow

```
Scan Points
    ↓
Distance Pre-filtering (100m range)
    ↓
Protocol 1 Application
    ↓
Protocol 2 Application
    ↓
...
    ↓
Protocol N Application
    ↓
Target Selection (first element)
    ↓
Response Generation
```

## Component Details

### 1. RadarController

**Responsibilities**:
- HTTP request handling
- Input validation
- Error handling
- Response formatting

**Key Methods**:
- `processRadar()`: Main radar processing endpoint
- `getProtocols()`: Protocol information endpoint

**Design Decisions**:
- Single responsibility for HTTP concerns
- Delegates business logic to service layer
- Comprehensive error handling
- Swagger documentation

### 2. RadarService

**Responsibilities**:
- Business logic orchestration
- Distance filtering
- Protocol application coordination
- Error handling

**Key Methods**:
- `preFilterByDistance()`: Distance-based filtering
- `applyProtocols()`: Sequential protocol application

**Design Decisions**:
- Pure business logic (no HTTP concerns)
- Stateless operations
- Composable protocol application
- Comprehensive error handling

### 3. Protocol System

**Architecture**:
```
IProtocol Interface
├── Distance Protocols
│   ├── ClosestEnemiesProtocol
│   └── FurthestEnemiesProtocol
├── Ally Protocols
│   ├── AssistAlliesProtocol
│   └── AvoidCrossfireProtocol
└── Mech Protocols
    ├── PrioritizeMechProtocol
    └── AvoidMechProtocol
```

**Design Decisions**:
- Interface-based design for flexibility
- Immutable protocol implementations
- Stateless protocol operations
- Composable protocol chains

### 4. Utility Layer

**Components**:
- `DistanceUtils`: Euclidean distance calculations
- `ValidationUtils`: Input validation helpers
- `ErrorUtils`: Error handling utilities

**Design Decisions**:
- Pure functions for testability
- No side effects
- Reusable across modules
- Performance optimized

## Error Handling Strategy

### 1. Error Hierarchy

```
Error
├── HttpException
│   ├── BadRequestException (400)
│   ├── NotFoundException (404)
│   └── InternalServerErrorException (500)
└── ValidationError
    ├── FieldValidationError
    └── SchemaValidationError
```

### 2. Error Handling Flow

```
Exception Thrown
    ↓
Global Exception Filter
    ↓
Error Classification
    ↓
HTTP Status Code Mapping
    ↓
Error Response Formatting
    ↓
Client Response
```

### 3. Error Response Format

```typescript
interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
  timestamp: string;
  path: string;
}
```

## Performance Considerations

### 1. Algorithm Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Distance Filtering | O(n) | Linear scan through points |
| Protocol Application | O(n log n) | Sorting for distance protocols |
| Target Selection | O(1) | First element selection |
| Overall | O(n log n) | Dominated by sorting |

### 2. Memory Management

- **Object Pooling**: Reuse of scan point objects
- **Immutable Data**: Prevents accidental mutations
- **Garbage Collection**: Minimal object allocation
- **Memory Limits**: 50MB maximum usage

### 3. Caching Strategy

- **Protocol Registry**: Cached protocol instances
- **Distance Calculations**: Cached for repeated calculations
- **Validation Rules**: Cached validation schemas

## Security Architecture

### 1. Input Validation

```typescript
// Multi-layer validation
@IsArray()
@IsString({ each: true })
@IsNotEmpty()
protocols: string[];
```

### 2. Error Information

- **No Sensitive Data**: Error messages don't expose internals
- **Structured Logging**: Security events are logged
- **Input Sanitization**: All inputs are validated and sanitized

### 3. Type Safety

- **TypeScript**: Compile-time type checking
- **Runtime Validation**: class-validator for runtime checks
- **Interface Contracts**: Clear API contracts

## Testing Architecture

### 1. Test Pyramid

```
    ┌─────────────────┐
    │   E2E Tests     │  ← 21 tests
    │   (21 tests)    │
    ├─────────────────┤
    │  Integration    │  ← 0 tests (covered by E2E)
    │   Tests         │
    ├─────────────────┤
    │   Unit Tests    │  ← 44 tests
    │   (44 tests)    │
    └─────────────────┘
```

### 2. Test Categories

#### Unit Tests
- **Protocol Tests**: Individual protocol behavior
- **Service Tests**: Business logic validation
- **Utility Tests**: Helper function validation

#### E2E Tests
- **API Tests**: Complete request/response cycles
- **Error Tests**: Error handling validation
- **Integration Tests**: Cross-component testing

### 3. Test Data Management

- **Test Fixtures**: Consistent test data
- **Mock Objects**: Isolated testing
- **Test Utilities**: Reusable test helpers

## Scalability Considerations

### 1. Horizontal Scaling

- **Stateless Design**: No server-side state
- **Load Balancer Ready**: Multiple instance support
- **Container Ready**: Docker containerization

### 2. Performance Optimization

- **Algorithm Efficiency**: O(n log n) complexity
- **Memory Optimization**: Minimal allocations
- **CPU Optimization**: Efficient calculations

### 3. Monitoring and Observability

- **Health Checks**: `/radar/protocols` endpoint
- **Metrics Collection**: Request/response metrics
- **Logging**: Structured application logs

## Future Enhancements

### 1. Planned Features

- **Authentication**: JWT-based authentication
- **Rate Limiting**: Request rate limiting
- **Caching**: Response caching layer
- **Metrics**: Prometheus metrics integration

### 2. Architecture Evolution

- **Microservices**: Split into smaller services
- **Event-Driven**: Event-based communication
- **CQRS**: Command Query Responsibility Segregation
- **Event Sourcing**: Event-driven state management

### 3. Technology Upgrades

- **NestJS Updates**: Framework version updates
- **TypeScript Updates**: Language version updates
- **Dependency Updates**: Security and feature updates

## Decision Records

### 1. Technology Choices

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| NestJS | Enterprise features, TypeScript support | Express.js, Fastify |
| TypeScript | Type safety, developer experience | JavaScript, Dart |
| Docker | Containerization, deployment | VM, Serverless |
| Jest | Testing framework | Mocha, Vitest |

### 2. Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Strategy Pattern | Protocol flexibility | Increased complexity |
| DTO Pattern | Type safety | Boilerplate code |
| Dependency Injection | Testability | Learning curve |
| Stateless Design | Scalability | No session state |

## Conclusion

The Radar API architecture is designed for:

- **Maintainability**: Clear separation of concerns
- **Testability**: Comprehensive test coverage
- **Scalability**: Horizontal scaling ready
- **Performance**: Optimized algorithms and memory usage
- **Security**: Input validation and error handling
- **Extensibility**: Easy to add new protocols and features

This architecture provides a solid foundation for current requirements while remaining flexible enough to accommodate future enhancements and scaling needs.
