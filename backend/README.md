# QuickRoute-Web

Develop and test against realistic API responses **before your real backend exists** — no coding, no restarts, no external dependencies.

Upload a JSON mock definition once and instantly get live HTTP endpoints with the exact status codes, response bodies, and delays you need. Add, remove, or change routes at any point while the server is running: no redeploy, no downtime.

**Why this matters:**

- **Unblock frontend development** — build and test UI flows against real HTTP calls, not fake data in your app code.
- **Simulate real-world conditions** — configure response delays to test loading states, timeouts, and race conditions.
- **Stay in control** — return any HTTP status (200, 201, 404, 500, …) to exercise every branch of your error handling.
- **Automatic cleanup** — mocks expire after a configurable period (default 7 days), so temporary test data doesn't accumulate.
- **Works offline** — no external service to provision; data lives in an embedded database or your own PostgreSQL instance.

---

## Architecture

```
┌─────────────────┐     ┌──────────────────────────────────────────────────────┐
│   Client        │     │             Mock Server (Spring Boot)                │
│ (Postman/UI)    │────>│                                                      │
└─────────────────┘     │  ┌─────────────┐    ┌────────────────────────────┐   │
                        │  │ Upload API  │───>│ MockConfiguration          │   │
                        │  │ /mock/upload│    │ (Entity → JPA Repository)  │   │
                        │  └─────────────┘    └──────────┬─────────────────┘   │
                        │                                │                     │
                        │                                ▼                     │
                        │  ┌─────────────┐    ┌────────────────────────────┐   │
                        │  │ Dynamic     │<───│ MockRegistryService        │   │
                        │  │ Route       │    │ (DB-backed + @Scheduled    │   │
                        │  │ Registrar   │────│  cleanup of expired mocks) │   │
                        │  └─────────────┘    └────────────────────────────┘   │
                        │                                │                     │
                        │                                ▼                     │
                        │  ┌──────────────────────────────────────────────┐    │
                        │  │   Request Handling Dispatcher                │    │
                        │  │   (Forward to registered mock handler)       │    │
                        │  └──────────────────────────────────────────────┘    │
                        └──────────────────────────────────────────────────────┘

              ┌──────────────────────────────────────┐
              │              Database                 │
              │  ┌───────────────────┐               │
              │  │ MockConfiguration │ ◄──┐          │
              │  ├───────────────────┤    │ OneToMany│
              │  │  id (PK, String)  │    │          │
              │  │  createdAt        │    │          │
              │  │  expiresAt        │    │          │
              │  └───────────────────┘    │          │
              │  ┌───────────────────┐    │          │
              │  │ RouteDefinition   │────┘          │
              │  ├───────────────────┤               │
              │  │  id (PK, Long)    │               │
              │  │  method           │               │
              │  │  pathPattern      │               │
              │  │  statusCode       │               │
              │  │  delayMs          │               │
              │  │  responseBody     │               │
              │  │  mock_id (FK)     │               │
              │  └───────────────────┘               │
              │                                      │
              │  Profiles:                           │
              │  • dev — H2 in-memory (default)      │
              │  • prod — PostgreSQL via DATABASE_URL │
              └──────────────────────────────────────┘
```

---

## Browser UI

When the server is running, open `http://localhost:8080` in your browser to access the built-in management UI. No extra tools needed.

The UI lets you:

- Paste or write mock JSON in a textarea with **Format** and **Sample** buttons
- Upload mocks and copy the returned `mockId`
- Browse all registered mocks with their routes, status codes, delays, and full endpoint URLs
- Copy any endpoint URL to the clipboard
- Delete mocks with one click

> **Tip:** You can also use any HTTP client (cURL, Postman, Bruno) to call the same REST API described below.

---

## Project Structure

```
src/main/java/com/elli/mockserver/
├── MockServerApplication.java          # @SpringBootApplication + @EnableScheduling
├── controller/
│   ├── HomeController.java             # Serves index.html at /
│   └── MockManagementController.java   # POST /mock/upload, GET /mocks, DELETE /mock/{id}
├── service/
│   ├── MockRegistryService.java        # DB-backed registry + scheduled expiry cleanup
│   └── DynamicRouteRegistrar.java      # Adds/removes routes at runtime via RequestMappingHandlerMapping
├── model/
│   ├── MockConfiguration.java          # @Entity: id, routes, createdAt, expiresAt
│   └── RouteDefinition.java            # @Entity: path, method, responseBody, delay, status
├── repository/
│   ├── MockConfigurationRepository.java  # JpaRepository<String, MockConfiguration>
│   └── RouteDefinitionRepository.java    # JpaRepository<Long, RouteDefinition>
├── handler/
│   └── MockRequestHandler.java         # Serves a mocked endpoint with delay + path var substitution
├── dto/
│   ├── RouteConfigDto.java
│   ├── MockUploadResponse.java
│   ├── RouteResponseDto.java
│   ├── MockSummaryDto.java
│   └── ErrorResponse.java
├── exception/
│   ├── GlobalExceptionHandler.java     # @ControllerAdvice — formats all errors as JSON
│   ├── MockNotFoundException.java
│   ├── MockUploadException.java
│   ├── RouteNotFoundException.java
│   └── RouteRegistrationException.java
├── config/
│   ├── WebConfig.java                  # CORS for React dev server (localhost:5173)
│   ├── JsonObjectConverter.java        # AttributeConverter: Object ↔ TEXT for responseBody
│   └── RateLimitingFilter.java         # Optional rate limiting filter
└── resources/
    ├── static/
    │   ├── index.html                  # Browser UI
    │   └── style.css                   # UI styles
    ├── templates/                      # (Thymeleaf templates, if any)
    ├── application.properties          # Base config (profile-agnostic)
    ├── application-dev.properties      # H2 in-memory, auto DDL
    └── application-prod.properties     # PostgreSQL via DATABASE_URL
```

---

## Key Components

### MockConfiguration — persisted mock root

JPA entity with auto-generated `id` (UUID string), `createdAt`, `expiresAt`, and a `@OneToMany` cascade of `RouteDefinition` children. Persisted to the database — survives restarts without files.

### RouteDefinition — persisted route

JPA entity with `@ManyToOne` back-reference to `MockConfiguration`. Stores HTTP method, path pattern (`/users/:id`), response body (as TEXT via `JsonObjectConverter`), status code, and delay.

### DynamicRouteRegistrar

Uses Spring's `RequestMappingHandlerMapping` to register and unregister new handler methods at runtime without restarting the server. Uses `@Qualifier("requestMappingHandlerMapping")` to disambiguate from Actuator's endpoint handler mapping.

### MockRequestHandler

The core handler that receives all mocked requests, looks up the matching route definition via `MockRegistryService`, applies simulated delays, substitutes path variables (`:var` → captured URL segment), and returns the configured JSON response.

### MockRegistryService

Database-backed registry that handles CRUD of mock configurations, route-matching logic (regex pattern compilation), path variable extraction, and **scheduled cleanup of expired mocks** (runs every 6 hours). Uses `MockConfigurationRepository` and `RouteDefinitionRepository` for persistence.

### MockManagementController

REST endpoints to upload new mock definitions (optional `expiresInHours` query param), list all registered mocks (with `expiresAt`), and delete existing ones.

---

## Execution Flow

1. **Upload** – Client sends a JSON mock definition to `POST /mock/upload?expiresInHours=168`.
2. **Parse** – The definition is converted into a list of `RouteDefinition` objects.
3. **Register** – For each route, `DynamicRouteRegistrar.registerRoute()` adds a new mapping to Spring's `HandlerMapping`.
4. **Persist** – A `MockConfiguration` entity (with `expiresAt` = now + N hours) is saved through JPA to the database (H2 in dev, PostgreSQL in prod).
5. **Request** – A client calls the mocked endpoint (e.g., `/mock/abc123/users/5`).
6. **Dispatch** – The request is dispatched to `MockRequestHandler.handle()`.
7. **Response** – The handler looks up the matching route from the database via `MockRegistryService`, applies any configured delay, substitutes path variables, and returns the JSON response.
8. **Cleanup** – Every 6 hours, a `@Scheduled` method deletes mocks whose `expiresAt` has passed, also unregistering their dynamic routes.

---

## Getting Started

### Prerequisites

- Java 26+
- Maven (wrapped via `mvnw`)

### Build & Run

```bash
./mvnw spring-boot:run
```

The server starts on `http://localhost:8080` using the embedded H2 database (dev profile by default).

### Running with PostgreSQL

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/quickroute
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## API Endpoints

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/`                          | Browser UI (index.html)      |
| POST   | `/mock/upload`               | Upload a new mock definition |
| GET    | `/mocks`                     | List all registered mocks    |
| DELETE | `/mock/{mockId}`             | Delete a mock and its routes |
| ANY    | `/mock/{mockId}/**`          | Mocked endpoint (dynamic)    |

---

## Tutorial

### POST /mock/upload — Create a new mock

Upload a JSON object where each key is `"METHOD /path"` and each value is a route configuration.

**Query parameters:**

| Parameter       | Type    | Default | Description                                |
| --------------- | ------- | ------- | ------------------------------------------ |
| `expiresInHours`| `int`   | `168`   | Hours until the mock auto-expires (7 days) |

**Request body:**

| Field                | Type      | Required | Description                                                                                              |
| -------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `"METHOD /path"` key | `string`  | yes      | HTTP method and path, e.g. `"GET /users/:id"`. Path segments starting with `:` are treated as variables. |
| `status`             | `integer` | no       | HTTP status code. Default: `200`.                                                                        |
| `delay`              | `integer` | no       | Response delay in milliseconds. Default: `0`.                                                            |
| `body`               | any JSON  | no       | The response body. Can be an object, array, string, number, or `null`.                                   |

**Example request:**

```json
{
  "GET /users": {
    "status": 200,
    "body": [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" }
    ]
  },
  "GET /users/:id": {
    "status": 200,
    "body": { "id": ":id", "name": "User :id" }
  },
  "POST /users": {
    "status": 201,
    "body": { "id": 99, "name": "Created" },
    "delay": 500
  }
}
```

**Success response (201):**

```json
{
  "mockId": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
}
```

**Error responses:**

```json
// 400 — Invalid route key format
{ "error": "Invalid route key: badkey — expected format: METHOD /path", "timestamp": "2026-06-08T22:00:00Z" }

// 400 — Missing or invalid fields
{ "error": "Invalid status for GET /users: must be an integer", "timestamp": "2026-06-08T22:00:00Z" }
```

---

### GET /mocks — List all registered mocks

Returns every registered mock with its routes (without response bodies).

**Success response (200):**

```json
{
  "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d": {
    "mockId": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "routeCount": 3,
    "createdAt": "2026-06-08T22:00:00",
    "expiresAt": "2026-06-15T22:00:00",
    "routes": [
      { "method": "GET", "pathPattern": "/users", "statusCode": 200, "delayMs": 0 },
      { "method": "GET", "pathPattern": "/users/:id", "statusCode": 200, "delayMs": 0 },
      { "method": "POST", "pathPattern": "/users", "statusCode": 201, "delayMs": 500 }
    ]
  }
}
// Empty list:
{}
```

---

### DELETE /mock/{mockId} — Delete a mock

Removes all registered routes and the database record for the given mock ID.

**Success response (204):** No body.

**Error response (404):**

```json
{ "error": "Mock not found: unknown-id", "timestamp": "2026-06-08T22:00:00Z" }
```

---

### ANY /mock/{mockId}/** — Call a mocked endpoint

After uploading, call any registered route under the mock's base path. Path variables (`:id`, `:name`, etc.) are captured from the URL and substituted into `:variable` placeholders in the response body.

**Example calls using the mock above:**

```bash
# Returns the users list
curl http://localhost:8080/mock/a1b2c3d4-e5f6-.../users

# Returns a single user with :id substituted
curl http://localhost:8080/mock/a1b2c3d4-e5f6-.../users/42

# Creates a user — waits 500ms then returns 201
curl -X POST http://localhost:8080/mock/a1b2c3d4-e5f6-.../users
```

**Responses:**

```json
// GET /users → 200
[{ "id": 1, "name": "Alice" }, { "id": 2, "name": "Bob" }]

// GET /users/42 → 200  (:id variable substituted into response body)
{ "id": "42", "name": "User 42" }

// POST /users → 201  (after 500ms delay)
{ "id": 99, "name": "Created" }
```

**Error response (404) — no matching route:**

```json
{
  "error": "Route not found: GET /mock/a1b2c3d4-e5f6-.../nonexistent",
  "timestamp": "2026-06-08T22:00:00Z"
}
```

---

## Profiles

| Profile | Default? | Database     | Config                     |
| ------- | -------- | ------------ | -------------------------- |
| `dev`   | Yes      | H2 in-memory | `application-dev.properties` |
| `prod`  | No       | PostgreSQL   | `application-prod.properties` |

In **prod** mode the server expects a `DATABASE_URL` environment variable pointing to your PostgreSQL instance.

---

## Automatic Mock Expiry

Every mock uploaded via `POST /mock/upload` has a built-in expiry. You control it with the `expiresInHours` query parameter (default: 168 hours = 7 days). A background task runs every 6 hours, deletes expired mocks from the database, and unregisters their dynamic routes from Spring. This prevents stale test data from accumulating and keeps the routing table clean.
