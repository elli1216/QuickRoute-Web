# Implementation Plan: QuickRoute-Web Next-Gen Features

This document outlines the phased implementation plan for adding three major features to QuickRoute-Web: Authentication Enforcement, Dynamic Data Generation and a Request History Dashboard.

The plan is structured to introduce incremental complexity, allowing for stable releases at the end of each phase.

---

## Phase 1: Authentication / Authorization Enforcement

_Allows users to secure their mock endpoints by requiring specific Bearer tokens or headers._

### 1.1 Backend Updates (`backend/`)

- [x] **Database Schema**: Update the `Route` entity to include:
  - `authType` (Enum: `NONE`, `BEARER`, `API_KEY`)
  - `expectedToken` (String, nullable)
- [x] **Request Interceptor**: Modify the mock request handling logic. Before returning the mocked response, check if the `Route` requires authentication.
  - If `BEARER`: Check the `Authorization: Bearer <token>` header.
  - If `API_KEY`: Check the configured custom header (e.g., `X-API-Key`).
  - If the token is missing or incorrect, immediately return a `401 Unauthorized` JSON response.

### 1.2 Frontend Updates (`frontend/`)

- [x] **Route Builder UI**: Add an "Authentication" section in the visual builder for each route.
  - Dropdown to select Auth Type (None, Bearer Token, Custom Header).
  - Input field to specify the expected token/value.
- [x] **API Payload**: Ensure the new fields are serialized and sent to the backend during the mock creation API call.

---

## Phase 2: Dynamic Data Generation (Faker Integration)

_Allows mock responses to generate dynamic data (names, UUIDs, dates) on every request._

### 2.1 Backend Updates (`backend/`)

_Since the backend serves the mock, the dynamic resolution must happen in Java._

- [x] **Dependencies**: Add a Java-based faker library like `datafaker` (`net.datafaker:datafaker`) to `pom.xml`.
- [x] **Response Parser**: Create a `TemplateResolutionService`.
  - When the backend retrieves the response body from the DB, it scans for mustache-like syntax (e.g., `{{name.firstName}}`, `{{internet.email}}`, `{{id.uuid}}`).
  - Replace these placeholders with dynamically generated data using Datafaker before sending the HTTP response.

### 2.2 Frontend Updates (`frontend/`)

- [x] **JSON Editor Enhancements**:
  - Add helper text or a floating panel in the response body editor listing popular Faker variables.
  - Optional: Use `@faker-js/faker` on the frontend purely for providing "Preview" functionality in the builder so users can see what the generated payload will look like.

---

## Phase 3: Request History & Inspector Dashboard

_Provides a live view for developers to inspect the exact requests hitting their mock endpoints._

### 3.1 Backend Updates (`backend/`)

- [ ] **Database Schema**: Create a `RequestLog` entity linked to a `Mock` ID.
  - Fields: `method`, `path`, `headers` (JSON), `queryParams` (JSON), `body` (Text), `timestamp`, `responseStatus`.
- [ ] **Logging Interceptor**:
  - After serving a mock request, asynchronously save a `RequestLog` record to the database.
- [ ] **New API Endpoint**:
  - `GET /api/mocks/{mockId}/logs` to fetch the recent request history.
  - Ensure this is paginated or limited to the last 20 requests to save database space.

### 3.2 Frontend Updates (`frontend/`)

- [x] **New Route**: Create `/mock/$mockId/dashboard` via TanStack Router.
- [x] **Dashboard UI**:
  - Split view: Left sidebar lists incoming requests (Method, Path, Time), right pane shows request details (Headers, Query Params, Body).
  - [x] **Live Updates**: Implement polling (e.g., every 3-5 seconds via React Query) to fetch new logs automatically so the user doesn't have to refresh.
- [x] **Navigation**: Provide a clear link in the success modal (after mock creation) pointing to the Dashboard alongside the base API URL.
