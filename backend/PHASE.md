# Database-backed QuickRoute — Implementation Plan

This plan describes the changes needed to build a new project (separate from this local-only repo) that replaces the file-based persistence with a SQL database, making it deployable online with a React frontend.

---

## Phase 1 — Database infra

1. Add `spring-boot-starter-data-jpa` to `pom.xml`
2. Add database driver: `h2` (dev profile) + `postgresql` (prod profile)
3. Create `application-dev.properties` with H2 in-memory connection
4. Create `application-prod.properties` with PostgreSQL connection string
5. Add CORS config in `WebConfig` — allow the React origin

## Phase 2 — JPA entities & repositories

6. Convert `MockConfiguration` → `@Entity`
   - `id` as `@Id` (the UUID mockId)
   - `createdAt` as `LocalDateTime`
   - `@OneToMany(mappedBy = "mock", cascade = ALL)`

7. Convert `RouteDefinition` → `@Entity`
   - Auto-generated `Long id`
   - `@ManyToOne` back to `MockConfiguration`
   - `method`, `pathPattern`, `delayMs`, `statusCode` as regular columns
   - `responseBody` as `@Column(columnDefinition = "TEXT")` — store the JSON as a string
   - Add helper methods to serialize `Object` ↔ `String` at the service layer

8. Create `MockConfigurationRepository extends JpaRepository<MockConfiguration, String>`

9. Create `RouteDefinitionRepository extends JpaRepository<RouteDefinition, Long>`
   - `List<RouteDefinition> findByMockId(String mockId)`

## Phase 3 — Data layer swap

10. Delete `PersistenceService` — no longer needed
11. Rewrite `MockRegistryService`:
    - Inject repositories instead of using `ConcurrentHashMap`
    - `registerMock()` → save entities via repositories
    - `removeMock()` → delete entities via repositories
    - `findRoute()` → load from DB on each request (or add a lightweight cache)
    - Remove `loadAllMocksOnStartup()` — JPA handles this
12. Optional: add a `@PostConstruct` migration that reads existing `mock-store/*.json` files, imports them into the database, and moves the files to a backup folder

## Phase 4 — Frontend support

13. Add `WebConfig` with `addCorsMappings()` to allow the React dev server origin
14. API contract stays the same — all existing endpoints and DTOs work unchanged

---

## What does NOT change

| Component | Status |
|-----------|--------|
| `DynamicRouteRegistrar` | Same |
| `MockRequestHandler` | Same |
| `MockManagementController` | Same |
| `GlobalExceptionHandler` | Same |
| All DTOs | Same |
| Upload JSON format | Same |
| Dynamic endpoint URLs (`/mock/{mockId}/**`) | Same |
