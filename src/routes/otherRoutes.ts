import express from "express";
import {
  fetchAttractionsNearby,
  fetchTopHeadlines,
} from "../controllers/otherController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Other
 *     description: Tourism attractions and points of interest and Local news and current events
 */

/**
 * @swagger
 * /other/attractions/nearby:
 *   get:
 *     summary: Get nearby tourist attractions by coordinates and radius
 *     tags: [Other]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           example: 51.50853
 *         required: true
 *         description: Latitude coordinate
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *           example: -0.12574
 *         required: true
 *         description: Longitude coordinate
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 1000
 *         required: false
 *         description: Search radius in meters
 *     responses:
 *       200:
 *         description: Nearby tourist attractions
 */
router.get("/attractions/nearby", authenticate, fetchAttractionsNearby);

/**
 * @swagger
 * /other/news/headlines:
 *   get:
 *     summary: Get top news headlines by country
 *     tags: [Other]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           example: us
 *         required: false
 *         description: Country code (ISO 3166-1 alpha-2)
 *     responses:
 *       200:
 *         description: Top news headlines
 */
router.get("/news/headlines", authenticate, fetchTopHeadlines);

export default router;
