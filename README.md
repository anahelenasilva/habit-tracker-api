# Habit Tracker API

A habits tracking API built with Node.js, TypeScript, Serverless Framework, and AWS Lambda.

## Features

- Create, read, update, and delete habits
- Track habit completion and failures
- Support for daily, weekly, and monthly habits
- Comprehensive statistics and analytics
- User management
- RESTful API design

## Project Structure

```
src/
├── application/        # Business logic layer
│   ├── contracts/      # Interfaces and contracts
│   ├── controllers/    # HTTP request handlers
│   │   ├── auth/       # Authentication controllers
│   │   ├── accounts/   # User account controllers
│   │   ├── habits/     # Habits management controllers
│   │   ├── stats/      # Statistics management controllers
│   │   ├── entities/   # Domain entities (Habit, User, etc.)
│   ├── errors/         # Error definitions
│   ├── query/          # Query objects for complex data retrieval
│   ├── queues/         # Queue consumers for background processing, if any
│   ├── services/       # Domain services
│   └── usecases/       # Business use cases
├── infra/              # Infrastructure layer
│   ├── clients/        # AWS SDK clients
│   ├── database/       # Database repositories and items
│   ├── emails/         # Email templates and components, if any
│   └── gateways/       # External service gateways, if any
├── kernel/             # Core utilities and DI
│   ├── decorators/     # Custom decorators
│   └── di/             # Dependency injection container
├── main/               # Infrastructure layer
│   ├── adapter/        # Lambda adapters (HTTP, S3, SQS, etc)
│   ├── functions/      # Lambda function handlers
│   └── utils/          # Utility functions
└── shared/             # Shared types and utilities
    ├── config/         # Configuration management
    ├── file/           # File handling utilities
    ├── time/           # Time utilities
    └── types/          # Shared type definitions
```

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Type checking:**
```bash
npm run typecheck
```

## Deployment

Deploy to AWS using the Serverless Framework:

```bash
serverless deploy
```

Deploy to a specific stage:

```bash
serverless deploy --stage production
```

After deployment, you'll see output similar to:

```
Deploying "habit-tracker-api" to stage "dev" (sa-east-1)

✔ Service deployed to stack habit-tracker-api-dev (91s)

endpoint: POST - https://xxxxxxxxxx.execute-api.sa-east-1.amazonaws.com/auth/sign-up
functions:
  signUp: habit-tracker-api-dev-signUp (1.6 kB)
```

## API Routes

### Authentication

#### POST /auth/sign-up
Creates a new user account.

**Request Body:**
```json
{
  "account": {
    "email": "user@example.com",
    "password": "yourpassword"
  }
}
```

**Response (201):**
```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

**Validation Rules:**
- Email must be a valid email address
- Password must be at least 8 characters long

**Error Responses:**
- `400 Bad Request`: Invalid request body or validation errors
- `500 Internal Server Error`: Server-side errors

### Habits
- `POST /habits` - Create a new habit
- `GET /habits` - Get all user habits
- `GET /habits/{id}` - Get specific habit
- `PUT /habits/{id}` - Update habit
- `DELETE /habits/{id}` - Delete habit

### Habit Tracking
- `POST /habits/{habitId}/complete` - Mark habit as completed
- `POST /habits/{habitId}/failed` - Mark habit as failed
- `GET /habits/{habitId}/logs` - Get habit logs

### Statistics
- `GET /habits/{habitId}/stats` - Get habit statistics
- `GET /users/{userId}/stats` - Get user statistics

## Data Model

Tables (DynamoDB):

- Habits: id (PK), GSI on userId
- Habit Logs: id (PK), GSI on (habitId, date)
- Users: id (PK) (placeholder for future auth integration)

Habit object fields:
id, userId, name, description (nullable), frequency (daily|weekly|monthly), targetPerPeriod (nullable), createdAt, updatedAt, archived (nullable)

## AWS Resources

The application creates the following AWS resources:

- **API Gateway**: HTTP API for handling requests
- **Lambda Functions**: Serverless function handlers
- **Cognito User Pool**: User authentication and management
- **Cognito User Pool Client**: Application client for authentication flows

### Cognito Configuration

- **Authentication Flow**: USER_PASSWORD_AUTH
- **Username Attributes**: Email
- **Password Policy**: Minimum 8 characters
- **Auto Verification**: Email
- **Token Validity**: 12 hours for access tokens

## Development Guidelines

### Adding New Routes

1. Create a controller in `src/application/controllers/`
2. Define the schema in `schemas/` subfolder, if needed
3. Implement the use case in `src/application/usecases/`
4. Create the Lambda handler in `src/main/functions/`
5. Add the function configuration to `sls/functions/`

### Error Handling

The API uses standardized error responses:
- Validation errors return detailed field-level error messages
- HTTP errors use custom error codes
- Unexpected errors return generic 500 responses

### Dependency Injection

Controllers and use cases use the `@Injectable()` decorator for automatic dependency injection. The DI container resolves dependencies at runtime.

## Security

- All user data is managed through AWS Cognito
- Passwords are hashed and stored securely
- JWT tokens are used for authentication
- Email verification is enabled by default

## Testing the API

### Sign Up a New User

```bash
curl -X POST https://your-api-endpoint/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "account": {
      "email": "user@example.com",
      "password": "mypassword123"
    }
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Technology Stack

- **Runtime**: Node.js 22.x
- **Language**: TypeScript
- **Framework**: Serverless Framework v4
- **Validation**: Zod
- **Authentication**: AWS Cognito
- **Cloud Provider**: AWS (Lambda, API Gateway, Cognito)
- **Bundler**: esbuild
- **Code Quality**: ESLint
