import { Request, Response } from "express";

import * as weatherService from "../services/weatherServices";

export const getCurrentWeather = async (req: Request, res: Response) => {
  try {
    const city = req.query.city;
    const lat = req.query.lat;
    const lon = req.query.lon;

    // Check city first (must be string)
    if (typeof city === "string") {
      const data = await weatherService.getCurrentWeatherByCity(city);
      return res.json(data);
    }

    // Check lat and lon must both be strings
    if (typeof lat !== "string" || typeof lon !== "string") {
      return res.status(400).json({
        error: "Provide either city name or valid lat and lon as strings",
      });
    }

    // Parse lat/lon strings to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Validate parsed numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude must be valid numbers" });
    }

    // Fetch weather by coordinates
    const data = await weatherService.getCurrentWeatherByCoords(
      latitude,
      longitude
    );
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch current weather" });
  }
};

export const getFiveDayForecast = async (req: Request, res: Response) => {
  try {
    const city = req.query.city;
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (typeof city === "string") {
      const data = await weatherService.getFiveDayForecastByCity(city);
      return res.json(data);
    }

    if (typeof lat !== "string" || typeof lon !== "string") {
      return res.status(400).json({
        error: "Provide either city name or valid lat and lon as strings",
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude must be valid numbers" });
    }

    const data = await weatherService.getFiveDayForecastByCoords(
      latitude,
      longitude
    );
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch 5-day forecast" });
  }
};
