# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /app

# Maven wrapper + POM first so dependency resolution is cached separately from source changes.
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw && ./mvnw -B -ntp dependency:go-offline

# Source last: any source change only invalidates the compile/test layer.
COPY src src

# verify == compile + unit tests. A failing test fails the image build.
RUN ./mvnw -B -ntp clean verify

# ---------- Runtime stage ----------
FROM eclipse-temurin:25-jre

# curl backs the HEALTHCHECK below. Kept in the same layer, apt lists removed.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Run as an unprivileged user.
RUN useradd -m -u 10001 appuser

COPY --from=builder /app/target/mock-server-0.0.1-SNAPSHOT.jar app.jar
RUN chown appuser:appuser app.jar

USER appuser

EXPOSE 8080

# Production is the safe default inside the image: it refuses to start without DATABASE_URL
# instead of silently using an in-memory H2 database. Override for local runs:
#   docker run -e SPRING_PROFILES_ACTIVE=dev -p 8080:8080 quick-route-backend:local
ENV SPRING_PROFILES_ACTIVE=prod

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -fsS http://localhost:8080/ping || exit 1

# JAVA_OPTS lets Elastic Beanstalk / ECS tune the JVM without rebuilding.
ENTRYPOINT ["sh", "-c", "exec java ${JAVA_OPTS:-} -jar /app/app.jar"]
