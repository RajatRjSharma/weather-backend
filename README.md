# weather-backend

Backend API for the Weather Dashboard application built with Node.js, Express, and TypeScript. It provides user authentication, saved cities management, weather and forecast data, tourist attractions, and local news services.

---

## Features

- User registration, login, logout, and profile retrieval
- JWT-based authentication and secure session handling with access and refresh tokens
- Management of user saved cities with pagination
- Weather data endpoints for current weather and 5-day forecasts (by city or coordinates)
- Tourism attractions nearby based on coordinates and radius
- Top news headlines by country code
- Comprehensive API documentation with Swagger UI

---

## Getting Started

### Prerequisites

- PostgreSQL database instance
- Node.js (v18+)
- Package manager: npm or yarn

### Installation

1. Clone this repository:

git clone https://github.com/rajatrjsharma/weather-backend.git
cd weather-backend

2. Install dependencies:

npm install

3. Configure your environment variables in `.env` file:

DATABASE_URL="postgresql://postgres:12345@localhost:5432/weather"
PORT=3000
ACCESS_TOKEN_SECRET=your_secret_key_for_access_token
REFRESH_TOKEN_SECRET=your_secret_key_for_refresh_token
GEONAMES_USERNAME=rajatrjsharma
OPENWEATHER_API_KEY=your_openweather_api_key
OPENTRIPMAP_API_KEY=your_opentripmap_api_key
NEWS_API_KEY=your_news_api_key

4. Run Prisma migrations to setup the database schema:

npx prisma migrate dev

5. Start the development server with auto-reload:

npm run dev

6. API will be accessible at `http://localhost:3000/api`

---

## Scripts

- `npm run dev` — Start dev server with hot-reloading
- `npm start` — Run compiled production server
- `npm test` — Run tests (not configured)

---

## API Endpoints

### User Authentication and Management

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/api/users/register`      | Register new user               |
| POST   | `/api/users/login`         | Login user and set auth cookies |
| POST   | `/api/users/logout`        | Logout user and clear cookies   |
| POST   | `/api/users/refresh-token` | Refresh JWT tokens              |
| GET    | `/api/users/profile`       | Get authenticated user profile  |

### Weather

| Method | Endpoint                | Description                           |
| ------ | ----------------------- | ------------------------------------- |
| GET    | `/api/weather/current`  | Get current weather by city or coords |
| GET    | `/api/weather/forecast` | Get 5-day forecast by city or coords  |

### Cities

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/cities/list`            | City search/autocomplete |
| GET    | `/api/cities/reverse-geocode` | Get city by lat/lng      |

### Saved Cities

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/savedCities`      | Get paginated saved cities |
| POST   | `/api/savedCities`      | Add new saved city         |
| DELETE | `/api/savedCities/{id}` | Remove city by ID          |

### Other

| Method | Endpoint                        | Description                   |
| ------ | ------------------------------- | ----------------------------- |
| GET    | `/api/other/attractions/nearby` | Nearby tourist attractions    |
| GET    | `/api/other/news/headlines`     | Top news headlines by country |

---

## Middleware

- Authentication middleware protects routes requiring auth
- Rate limiting middleware on API routes
- CSRF protection and token exposure
- Morgan for HTTP request logging
- Error handling middleware

---

## API Documentation

Swagger docs available at:

http://localhost:3000/api/swagger

Use the interactive API Explorer for route details and testing.

---

## Technologies

- Node.js with Express and TypeScript
- Prisma ORM for database access
- JWT for authentication
- Axios for outbound API calls
- Swagger for API documentation
- Middleware for security, logging, and error handling

---

## License

MIT License

---

For questions, bug reports, or contributions, please open an issue or submit a pull request on the GitHub repository.
