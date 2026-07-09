# Implementation Plan: QuickRoute-Web Next-Gen Features

This document outlines the phased implementation plan for adding four major features to QuickRoute-Web: Authentication Enforcement, Dynamic Data Generation, Sequential Responses, and a Request History Dashboard.

The plan is structured to introduce incremental complexity, allowing for stable releases at the end of each phase.

---

## Phase 1: Authentication / Authorization Enforcement
*Allows users to secure their mock endpoints by requiring specific Bearer tokens or headers.*

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
*Allows mock responses to generate dynamic data (names, UUIDs, dates) on every request.*

### 2.1 Backend Updates (`backend/`)
*Since the backend serves the mock, the dynamic resolution must happen in Java.*
- [x] **Dependencies**: Add a Java-based faker library like `datafaker` (`net.datafaker:datafaker`) to `pom.xml`.
- [x] **Response Parser**: Create a `TemplateResolutionService`. 
  - When the backend retrieves the response body from the DB, it scans for mustache-like syntax (e.g., `{{name.firstName}}`, `{{internet.email}}`, `{{id.uuid}}`).
  - Replace these placeholders with dynamically generated data using Datafaker before sending the HTTP response.

### 2.2 Frontend Updates (`frontend/`)
- [x] **JSON Editor Enhancements**: 
  - Add helper text or a floating panel in the response body editor listing popular Faker variables.
  - Optional: Use `@faker-js/faker` on the frontend purely for providing "Preview" functionality in the builder so users can see what the generated payload will look like.

---

## Phase 3: Sequential Responses (Stateful Mocking)
*Allows a single endpoint to return a sequence of different responses across consecutive calls.*

### 3.1 Backend Updates (`backend/`)
- [ ] **Database Schema Updates**:
  - Refactor the `Route` entity. Instead of a single `responseBody` and `statusCode`, it should map to a collection of `ResponseSequence` entities (One-to-Many).
  - Add a `currentIndex` (Integer) to the `Route` entity to keep track of state.
- [ ] **Request Handling**:
  - When a request hits a sequential route, retrieve the response at `currentIndex`.
  - Increment `currentIndex` and save it to the database (if it reaches the end of the sequence, it can either loop back to 0 or stay on the last response, based on a configuration flag).

### 3.2 Frontend Updates (`frontend/`)
- [ ] **Response Builder UI**:
  - Add a toggle for "Response Type: Static vs. Sequential".
  - If Sequential, display a dynamic list of response blocks. 
  - Users can click "Add Next Response" to define a sequence (e.g., Response 1: 500 Error, Response 2: 200 Success).
- [ ] **Validation**: Ensure the UI validates all responses in the sequence before submission.

---

## Phase 4: Request History & Inspector Dashboard
*Provides a live view for developers to inspect the exact requests hitting their mock endpoints.*

### 4.1 Backend Updates (`backend/`)
- [ ] **Database Schema**: Create a `RequestLog` entity linked to a `Mock` ID.
  - Fields: `method`, `path`, `headers` (JSON), `queryParams` (JSON), `body` (Text), `timestamp`, `responseStatus`.
- [ ] **Logging Interceptor**: 
  - After serving a mock request, asynchronously save a `RequestLog` record to the database.
- [ ] **New API Endpoint**: 
  - `GET /api/mocks/{mockId}/logs` to fetch the recent request history. 
  - Ensure this is paginated or limited to the last 50-100 requests to save database space.

### 4.2 Frontend Updates (`frontend/`)
- [ ] **New Route**: Create `/mock/$mockId/dashboard` via TanStack Router.
- [ ] **Dashboard UI**:
  - Split view: Left sidebar lists incoming requests (Method, Path, Time), right pane shows request details (Headers, Query Params, Body).
  - [ ] **Live Updates**: Implement polling (e.g., every 3-5 seconds via React Query) to fetch new logs automatically so the user doesn't have to refresh.
- [ ] **Navigation**: Provide a clear link in the success modal (after mock creation) pointing to the Dashboard alongside the base API URL.
