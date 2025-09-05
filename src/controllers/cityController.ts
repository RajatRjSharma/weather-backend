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
