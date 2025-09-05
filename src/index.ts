import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import userRoutes from "./routes/userRoutes";
import cityRoutes from "./routes/cityRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import otherRoutes from "./routes/otherRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Weather backend API is running");
});

app.use("/api/users", userRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/other", otherRoutes);

app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error Handler Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
