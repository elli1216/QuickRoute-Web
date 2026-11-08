# Backend Docker Guide (Phase 1)

Phase 1 scope: build the backend image locally, run it, and verify the API. AWS (RDS, ECR, Elastic Beanstalk, CodePipeline) comes in later phases — see the deployment roadmap.

## Image facts

| Item | Value |
|------|-------|
| Build stage | `eclipse-temurin:25-jdk` |
| Runtime stage | `eclipse-temurin:25-jre` |
| Build command | `./mvnw clean verify` (unit tests are **not** skipped) |
| Port | `8080` |
| User | `appuser` (uid 10001, non-root) |
| Health check | `GET /ping` via `curl` |
| Default profile in image | `prod` (requires `DATABASE_URL`) |

## Local build

```bash
cd backend
docker build -t quick-route-backend:local .
```

Build fails if any JUnit test fails — that is intentional.

## Local run (H2, no database needed)

The image defaults to the `prod` profile, so override it for local work:

```bash
docker run --rm -e SPRING_PROFILES_ACTIVE=dev -p 8080:8080 quick-route-backend:local
```

Verify:

```bash
curl http://localhost:8080/ping      # -> Server is pinged.
curl http://localhost:8080/mocks     # -> []
curl http://localhost:8080/api/stats
```

H2 console (dev profile only): http://localhost:8080/h2-console

## Run against PostgreSQL

Never bake credentials into the image or into git. Pass them at runtime:

```bash
docker run --rm -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL="jdbc:postgresql://<host>:5432/<database>" \
  -e SPRING_DATASOURCE_USERNAME="<user>" \
  -e SPRING_DATASOURCE_PASSWORD="<password>" \
  quick-route-backend:local
```

> `DATABASE_URL` must use the JDBC form (`jdbc:postgresql://...`), not a bare `postgresql://` URI.
> Credentials come from Spring's `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` mapping.
> Phase 1.5 will split the URL into `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` and add a migration tool.

Local values for development can live in `backend/.env` (git-ignored). Never commit it.

## ECR push (Phase 2, reference only)

```bash
REGION=ap-southeast-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
IMAGE_URI=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/quick-route-backend
TAG=$(git rev-parse --short HEAD)

aws ecr get-login-password --region $REGION \
  | docker login --username AWS --password-stdin "$IMAGE_URI"
docker build -t "$IMAGE_URI:$TAG" .
docker push "$IMAGE_URI:$TAG"
```

Use the Git commit SHA as the image tag for traceability. `latest` is for convenience only.

## Known follow-ups

- Phase 1.5: RDS PostgreSQL, Flyway migrations (`ddl-auto=validate` needs a real schema), credential split, Secrets Manager.
- Phase 3: Elastic Beanstalk `Dockerrun.aws.json` pointing at the ECR image, `SPRING_PROFILES_ACTIVE=prod` set as an environment property.
- Phase 5: ECR image scanning, lifecycle policy, CloudWatch alarms.
