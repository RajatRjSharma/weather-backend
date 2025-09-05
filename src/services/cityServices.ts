import axios from "axios";

export interface City {
  name: string;
  countryName: string;
  adminName1: string; // region/state
  lat: string;
  lng: string;
}

export const searchCities = async (
  query: string,
  username: string
): Promise<City[]> => {
  const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(
    query
  )}&maxRows=10&username=${username}&featureClass=P`;

  try {
    const response = await axios.get(url);
    return response.data.geonames.map((city: any) => ({
      name: city.name,
      countryName: city.countryName,
      adminName1: city.adminName1,
      lat: city.lat,
      lng: city.lng,
    }));
  } catch (error) {
    console.error("GeoNames API error:", error);
    throw new Error("Failed to fetch cities from GeoNames");
  }
};
