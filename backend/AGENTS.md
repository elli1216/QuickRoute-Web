## Repo: `QuickRoute-Local` — Lightweight API Mocking Server

### Project state
- All core components implemented: `model/`, `handler/`, `service/`, `controller/` packages exist.
- Package is `com.elli.mockserver`, **not** `com.mock.server` as the README tree shows.

### Stack
- Spring Boot 4.0.6, Java 26, Maven wrapper (`mvnw`).
- Dependencies: `spring-boot-starter-webmvc`, `spring-boot-starter-validation`, `spring-boot-starter-actuator`, `spring-boot-starter-data-jpa`, `spring-boot-starter-thymeleaf`, `spring-boot-devtools` (runtime), `jackson-databind`, `h2` (runtime, dev), `postgresql` (runtime, prod).
- **No Lombok.** Write getters/setters manually.
- **JPA-backed** — JPA entities in `model/`, repositories in `service/`.
- **Profiles**: `dev` (default, H2 in-memory), `prod` (PostgreSQL via `DATABASE_URL` env).
- **CORS** configured to allow React dev server origin (port 3000).
- No lint, formatter, or typecheck configuration.

### Commands
| Action | Command |
|--------|---------|
| Build | `./mvnw compile` |
| Test | `./mvnw test` (single test: `./mvnw test -Dtest=ClassName`) |
| Run | `./mvnw spring-boot:run` (listens on `:8080`) |

### Key classes
| Class | Role |
|-------|------|
| `MockManagementController` | `POST /mock/upload`, `GET /mocks`, `DELETE /mock/{mockId}` |
| `DynamicRouteRegistrar` | Registers/unregisters routes in Spring via `RequestMappingHandlerMapping` at runtime |
| `MockRequestHandler` | Serves mocked responses: delay, path variable substitution in response body |
| `MockRegistryService` | In-memory `ConcurrentHashMap<String, MockConfiguration>` with pattern matching; replaced file persistence with JPA repositories |
| `MockConfigurationRepository` | `JpaRepository<MockConfiguration, String>` |
| `RouteDefinitionRepository` | `JpaRepository<RouteDefinition, Long>` with `findByMockId(String)` |

### Gotchas
- **`@Qualifier("requestMappingHandlerMapping")`** is required on the `RequestMappingHandlerMapping` field in `DynamicRouteRegistrar` — Actuator creates a second bean (`controllerEndpointHandlerMapping`) that causes `NoUniqueBeanDefinitionException`.
- Jackson is **not** transitively included by `spring-boot-starter-webmvc` in Boot 4.x; `jackson-databind` is declared explicitly.
- The README references Gradle commands (`./gradlew bootRun`) — this project is Maven-only.
