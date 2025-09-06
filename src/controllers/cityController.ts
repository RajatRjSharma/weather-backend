import { Request, Response } from "express";
import * as cityService from "../services/cityServices";

export const getCities = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query) {
    return res
      .status(400)
      .json({ status: false, message: "Query parameter is required" });
  }

  try {
    const geoNamesUsername = process.env.GEONAMES_USERNAME || "demo";
    const cities = await cityService.searchCities(query, geoNamesUsername);
    res.json({ status: true, data: cities });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch cities",
    });
  }
};

export const getCityByLatLng = async (req: Request, res: Response) => {
  const lat = req.query.lat as string;
  const lng = req.query.lng as string;
  if (!lat || !lng) {
    return res.status(400).json({
      status: false,
      message: "Latitude and longitude parameters are required",
    });
  }

  try {
    const geoNamesUsername = process.env.GEONAMES_USERNAME || "demo";
    // Assume cityService.getCityByLatLng implemented similar to searchCities
    const city = await cityService.getCityByLatLng(
      parseFloat(lat),
      parseFloat(lng),
      geoNamesUsername
    );
    if (!city) {
      return res.status(404).json({
        status: false,
        message: "City not found for provided coordinates",
      });
    }
    res.json({
      status: true,
      data: city,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch city details",
    });
  }
};
