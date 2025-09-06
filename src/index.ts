import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import userRoutes from "./routes/userRoutes";
import cityRoutes from "./routes/cityRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import otherRoutes from "./routes/otherRoutes";
import cookieParser from "cookie-parser";
import savedCityRoutes from "./routes/savedCityRoutes";
import { apiLimiter } from "./middleware/rateLimiter";
import {
  csrfErrorHandler,
  csrfProtection,
  exposeCsrfToken,
  parseCookies,
} from "./middleware/csrfProtection";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));

const allowedOrigins = [
  "https://rajatrjsharma.github.io",
  "http://localhost:5174",
  "https://weather.rajatkumarsharma.com",
];

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) {
      // Allow requests with no origin like curl, postman
      callback(null, true);
      return;
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
// Rate limiting on all /api routes
app.use("/api", apiLimiter);

// Cookie parser middleware before CSRF middleware
// app.use(parseCookies);

// CSRF protection middleware for all /api routes that mutate data
// app.use("/api", csrfProtection);

// Middleware to send CSRF token for client usage
// app.use(exposeCsrfToken);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Weather backend API is running");
});

app.use("/api/users", userRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/other", otherRoutes);
app.use("/api/savedCities", savedCityRoutes);

app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CSRF error handler (put after routes)
// app.use(csrfErrorHandler);

// Error Handler Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
