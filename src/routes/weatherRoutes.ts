import express from "express";
import {
  getCurrentWeather,
  getFiveDayForecast,
} from "../controllers/weatherController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Weather
 *     description: Weather and forecast endpoints
 */

/**
 * @swagger
 * /weather/current:
 *   get:
 *     summary: Get current weather by city or coordinates
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           example: London
 *         description: City name
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           example: 51.50853
 *         description: Latitude coordinate
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *           example: -0.12574
 *         description: Longitude coordinate
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current weather data
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/current", authenticate, getCurrentWeather);

/**
 * @swagger
 * /weather/forecast:
 *   get:
 *     summary: Get 5-day weather forecast by city or coordinates
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           example: London
 *         description: City name
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           example: 51.50853
 *         description: Latitude coordinate
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *           example: -0.12574
 *         description: Longitude coordinate
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 5-day weather forecast data
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/forecast", authenticate, getFiveDayForecast);

export default router;
