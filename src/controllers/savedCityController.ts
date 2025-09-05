import { Request, Response } from "express";
import * as savedCityService from "../services/savedCityServices";

export const addCity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const { name, countryName, adminName1, lat, lng } = req.body;

    if (!name || !countryName || lat === undefined || lng === undefined) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const city = await savedCityService.addCityForUser(userId, {
      name,
      countryName,
      adminName1,
      lat,
      lng,
    });

    res.status(201).json({ status: true, data: city });
  } catch (error: any) {
    res.status(500).json({ status: false, message: "Failed to add city" });
  }
};

export const removeCity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const cityId = req.params.id;

    const deleted = await savedCityService.removeCityForUser(userId, cityId);
    if (deleted.count === 0) {
      return res.status(404).json({
        status: false,
        message: "City not found or not owned by user",
      });
    }

    res.json({ status: true, message: "City removed" });
  } catch (error: any) {
    res.status(500).json({ status: false, message: "Failed to remove city" });
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const paginatedData = await savedCityService.getSavedCitiesByUser(userId, {
      page,
      limit,
    });
    res.json({ status: true, ...paginatedData });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch saved cities" });
  }
};
