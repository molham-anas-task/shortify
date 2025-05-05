# Link Shortener – Backend API

A RESTful backend service for a modern link-shortening web application, supporting full user management and analytics.

## Features

- Secure user registration and authentication using JWT.
- Route protection with authentication middleware.
- URL shortening with or without authentication.
- Click tracking for shortened links.
- Ability to save and unsave favorite links.
- Support for deleting previously shortened links.
- Environment-based configuration for flexible deployment.

## Tech Stack

- **Runtime**: Node.js
- **Backend Framework**: Express.js (with TypeScript)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM (with migration support)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Zod (schema-based input validation)
- **Dev Tools**: Nodemon, ESLint, Prettier

## API Endpoints

### Auth

| Method | Endpoint             | Description        | Auth Required |
|--------|----------------------|--------------------|---------------|
| POST   | `/api/auth/register` | Register new user  | No            |
| POST   | `/api/auth/login`    | Log in user        | No            |
| POST   | `/api/auth/logout`   | Log out user       | Yes           |

### Links

| Method | Endpoint                 | Description                     | Auth Required |
|--------|--------------------------|---------------------------------|---------------|
| POST   | `/api/links/shorten`     | Shorten a URL                   | Optional      |
| GET    | `/api/links/user`        | Get user’s shortened links      | Yes           |
| GET    | `/api/links/clicks/:id`  | Get click count for a link      | Yes           |
| DELETE | `/api/links/:id`         | Delete a shortened link         | Yes           |

### Redirection

| Method | Endpoint          | Description                  | Auth Required |
|--------|-------------------|------------------------------|---------------|
| GET    | `/:shortCode`     | Redirect to the original URL | No            |

### Saved Links

| Method | Endpoint                  | Description                    | Auth Required |
|--------|---------------------------|--------------------------------|---------------|
| POST   | `/api/saved/:linkId`      | Save a link to favorites       | Yes           |
| DELETE | `/api/saved/:linkId`      | Unsave a previously saved link | Yes           |
| GET    | `/api/saved`              | Get all saved links            | Yes           |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/molham-anas-task/shortify-backend.git
cd shortify-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root directory with the following environment variables:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
BASE_URL=your_base_url
```

  **Note:** Do not commit your .env file to version control.

### 4. (Optional) Run database migrations

```bash
npm run migrate
```

### 5. Run the development server

```bash
npm run dev
```

The server will start at http://localhost:3000 by default.

## Project Structure

```
src/
├── controllers/ # Handle request/response logic for each route
├── db/ # Database connection and Drizzle configurations
├── middlewares/ # Custom middleware functions (e.g., authentication)
├── repositories/ # Database queries and data access logic
├── routes/ # Route definitions and route-specific middleware
├── services/ # Business logic layer
├── types/ # Shared TypeScript types/interfaces
├── utils/ # Utility/helper functions
├── validators/ # Zod schemas for request validation
├── index.ts # App entry point
.env # Environment variables file
```

