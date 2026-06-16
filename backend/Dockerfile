FROM bellsoft/liberica-openjdk-alpine:26 AS build
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && sed -i 's/\r$//' mvnw
RUN --mount=type=cache,target=/root/.m2 ./mvnw dependency:go-offline -q
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 ./mvnw package -DskipTests -q

FROM bellsoft/liberica-openjdk-alpine:26
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
