import { Request, Response } from "express";
import * as otherService from "../services/otherServices";

export const fetchAttractionsNearby = async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    const radius = parseInt((req.query.radius as string) || "1000");

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: "Invalid latitude or longitude" });
    }

    const data = await otherService.getAttractionsNearby(lat, lon, radius);
    res.json({ status: true, data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nearby attractions" });
  }
};

export const fetchTopHeadlines = async (req: Request, res: Response) => {
  try {
    const country = (req.query.country as string) || "us";
    const data = await otherService.getTopHeadlinesByCountry(country);
    res.json({ status: true, data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news headlines" });
  }
};
