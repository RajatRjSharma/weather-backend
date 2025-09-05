import express from "express";
import { getCities } from "../controllers/cityController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cities
 *     description: City search and discovery endpoints
 */

/**
 * @swagger
 * /cities/list:
 *   get:
 *     summary: City search with autocomplete
 *     tags:
 *       - Cities
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           example: Lon
 *         required: true
 *         description: Partial city name to search for
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: List of matching cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: London
 *                       countryName:
 *                         type: string
 *                         example: United Kingdom
 *                       adminName1:
 *                         type: string
 *                         example: England
 *                       lat:
 *                         type: string
 *                         example: "51.50853"
 *                       lng:
 *                         type: string
 *                         example: "-0.12574"
 *       '400':
 *         description: Query parameter missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Query parameter is required
 *       '500':
 *         description: Failed to fetch cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to fetch cities
 */
router.get("/list", authenticate, getCities);

export default router;
