import axios from "axios";

export interface City {
  name: string;
  countryName: string;
  adminName1: string; // region/state
  lat: string;
  lng: string;
}

const TIMEOUT_MS = 5000; // 5 seconds

export const searchCities = async (
  query: string,
  username: string
): Promise<City[]> => {
  const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(
    query
  )}&maxRows=10&username=${username}&featureClass=P`;

  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data.geonames.map((city: any) => ({
      name: city.name,
      countryName: city.countryName,
      adminName1: city.adminName1,
      lat: city.lat,
      lng: city.lng,
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error("GeoNames API request timed out after 5 seconds");
    }
    console.error("GeoNames API error:", error);
    throw new Error("Failed to fetch cities from GeoNames");
  }
};

export const getCityByLatLng = async (
  lat: number,
  lng: number,
  username: string
): Promise<City | null> => {
  const url = `http://api.geonames.org/findNearbyJSON?lat=${lat}&lng=${lng}&username=${username}&featureClass=P&maxRows=1`;

  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    const geo = response.data.geonames && response.data.geonames[0];
    if (!geo) return null;

    const city: City = {
      name: geo.name,
      countryName: geo.countryName,
      adminName1: geo.adminName1,
      lat: geo.lat,
      lng: geo.lng,
    };
    return city;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error("GeoNames findNearby request timed out after 5 seconds");
    }
    console.error("GeoNames findNearby error:", error);
    throw new Error("Failed to fetch city details by lat/lng");
  }
};
