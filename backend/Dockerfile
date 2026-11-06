# Build stage
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Fix Maven wrapper permissions
RUN chmod +x ./mvnw

# Download dependencies (cache layer)
RUN ./mvnw dependency:resolve

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:25-jre

WORKDIR /app

# Create non-root user
RUN useradd -m -u 10001 appuser

# Copy JAR from builder
COPY --from=builder /app/target/mock-server-0.0.1-SNAPSHOT.jar app.jar

# Change ownership to non-root user
RUN chown appuser:appuser app.jar

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ping || exit 1

# Run the application with prod profile
# Set SPRING_PROFILES_ACTIVE and DATABASE_URL at runtime
ENTRYPOINT ["java", "-jar", "app.jar"]
CMD ["--spring.profiles.active=prod"]
