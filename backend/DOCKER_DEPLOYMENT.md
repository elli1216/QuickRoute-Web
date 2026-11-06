# Docker Deployment to AWS ECR

## Prerequisites
- AWS CLI configured with credentials
- Docker installed locally
- AWS ECR repository created

## Build and Push to AWS ECR

### 1. Authenticate Docker with AWS ECR
```bash
aws ecr get-login-password --region <AWS_REGION> | \
  docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com
```

Replace:
- `<AWS_REGION>` - Your AWS region (e.g., `us-east-1`)
- `<AWS_ACCOUNT_ID>` - Your AWS account ID

### 2. Build the Docker image
```bash
cd backend
docker build -t mock-server:latest .
```

### 3. Tag the image for ECR
```bash
docker tag mock-server:latest <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/mock-server:latest
```

### 4. Push to ECR
```bash
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/mock-server:latest
```

## One-liner Build and Push
```bash
REGION=us-east-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
IMAGE_URI=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/mock-server

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $IMAGE_URI && \
docker build -t mock-server:latest . && \
docker tag mock-server:latest $IMAGE_URI:latest && \
docker push $IMAGE_URI:latest
```

## Docker Image Details

- **Base Image**: `eclipse-temurin:25-jre` (minimal Java 25 runtime)
- **Port**: 8080
- **Non-root User**: appuser (uid: 1000)
- **Health Check**: `/ping` endpoint
- **Size**: ~300-400MB (optimized with multi-stage build)

## Environment Variables

Set these when running the container:

```bash
docker run -e SPRING_PROFILES_ACTIVE=prod \
           -e DATABASE_URL=postgresql://user:pass@host:5432/mockdb \
           -p 8080:8080 \
           $IMAGE_URI:latest
```

## Local Testing

```bash
docker build -t mock-server:latest .
docker run -p 8080:8080 mock-server:latest
curl http://localhost:8080/ping
```
