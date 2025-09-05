import { PrismaClient } from "@prisma/client";
import {
  paginate,
  PaginationParams,
  PaginationResult,
} from "../utils/pagination";

const prisma = new PrismaClient();

type SavedCity = {
  id: string;
  userId: string;
  name: string;
  countryName: string;
  adminName1?: string | null;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
};

export const addCityForUser = async (
  userId: string,
  cityData: {
    name: string;
    countryName: string;
    adminName1?: string;
    lat: number;
    lng: number;
  }
) => {
  const city = await prisma.savedCity.upsert({
    where: {
      userId_name_countryName: {
        userId,
        name: cityData.name,
        countryName: cityData.countryName,
      },
    },
    update: {
      adminName1: cityData.adminName1,
      lat: cityData.lat,
      lng: cityData.lng,
    },
    create: {
      userId,
      name: cityData.name,
      countryName: cityData.countryName,
      adminName1: cityData.adminName1,
      lat: cityData.lat,
      lng: cityData.lng,
    },
  });
  return city;
};

export const removeCityForUser = async (userId: string, cityId: string) => {
  return prisma.savedCity.deleteMany({
    where: {
      id: cityId,
      userId,
    },
  });
};

export const getSavedCitiesByUser = async (
  userId: string,
  paginationParams: PaginationParams
): Promise<PaginationResult<SavedCity>> => {
  return paginate<SavedCity>(prisma.savedCity, { userId }, paginationParams);
};
