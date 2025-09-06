import express from "express";
import { getCities, getCityByLatLng } from "../controllers/cityController";
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

/**
 * @swagger
 * /cities/reverse-geocode:
 *   get:
 *     summary: Get city detail by latitude and longitude
 *     tags:
 *       - Cities
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: string
 *           example: "51.50853"
 *         required: true
 *         description: Latitude coordinate
 *       - in: query
 *         name: lng
 *         schema:
 *           type: string
 *           example: "-0.12574"
 *         required: true
 *         description: Longitude coordinate
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: City details for given coordinates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: London
 *                     countryName:
 *                       type: string
 *                       example: United Kingdom
 *                     adminName1:
 *                       type: string
 *                       example: England
 *                     lat:
 *                       type: string
 *                       example: "51.50853"
 *                     lng:
 *                       type: string
 *                       example: "-0.12574"
 *       '400':
 *         description: Latitude or longitude missing
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
 *                   example: Latitude and longitude parameters are required
 *       '404':
 *         description: City not found
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
 *                   example: City not found for provided coordinates
 *       '500':
 *         description: Failed to fetch city details
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
 *                   example: Failed to fetch city details
 */
router.get("/reverse-geocode", authenticate, getCityByLatLng);

export default router;
