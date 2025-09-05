import express from "express";
import { authenticate } from "../middleware/authenticate";
import {
  addCity,
  removeCity,
  getCities,
} from "../controllers/savedCityController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: SavedCities
 *     description: User saved cities management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SavedCity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         userId:
 *           type: string
 *           example: "a12345b6-c789-123d-f012-3456789abcde"
 *         name:
 *           type: string
 *           example: "London"
 *         countryName:
 *           type: string
 *           example: "United Kingdom"
 *         adminName1:
 *           type: string
 *           example: "England"
 *           nullable: true
 *         lat:
 *           type: number
 *           example: 51.50853
 *         lng:
 *           type: number
 *           example: -0.12574
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-05T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-05T00:00:00.000Z"
 */

/**
 * @swagger
 * /savedCities:
 *   get:
 *     summary: Get paginated saved cities for authenticated user
 *     tags: [SavedCities]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of cities per page
 *     responses:
 *       200:
 *         description: Paginated list of saved cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 50
 *                   description: Total number of saved cities
 *                 page:
 *                   type: integer
 *                   example: 1
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                   description: Number of items per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SavedCity'
 */
router.get("/", authenticate, getCities);

/**
 * @swagger
 * /savedCities:
 *   post:
 *     summary: Add a new city to user's saved dashboard
 *     tags: [SavedCities]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - countryName
 *               - lat
 *               - lng
 *             properties:
 *               name:
 *                 type: string
 *                 example: "London"
 *               countryName:
 *                 type: string
 *                 example: "United Kingdom"
 *               adminName1:
 *                 type: string
 *                 example: "England"
 *               lat:
 *                 type: number
 *                 example: 51.50853
 *               lng:
 *                 type: number
 *                 example: -0.12574
 *     responses:
 *       201:
 *         description: City added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SavedCity'
 */
router.post("/", authenticate, addCity);

/**
 * @swagger
 * /savedCities/{id}:
 *   delete:
 *     summary: Remove a saved city from user's dashboard
 *     tags: [SavedCities]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: City ID to remove
 *         schema:
 *           type: string
 *           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *     responses:
 *       200:
 *         description: City removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: City removed from dashboard
 *       404:
 *         description: City not found or not owned by user
 */
router.delete("/:id", authenticate, removeCity);

export default router;
