import axios from "axios";

const OPENTRIPMAP_API_KEY = process.env.OPENTRIPMAP_API_KEY!;
const OPENTRIPMAP_BASE_URL = "https://api.opentripmap.com/0.1/en";
const NEWS_API_KEY = process.env.NEWS_API_KEY!;
const NEWS_BASE_URL = "https://newsapi.org/v2";
const TIMEOUT_MS = 5000; // 5 seconds

export const getAttractionsNearby = async (
  lat: number,
  lon: number,
  radius = 1000
) => {
  const url = `${OPENTRIPMAP_BASE_URL}/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&apikey=${OPENTRIPMAP_API_KEY}`;
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error("Request timed out after 5 seconds");
    }
    throw error;
  }
};

export const getTopHeadlinesByCountry = async (countryCode: string) => {
  const url = `${NEWS_BASE_URL}/top-headlines?country=${countryCode}&apiKey=${NEWS_API_KEY}`;
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error("Request timed out after 5 seconds");
    }
    throw error;
  }
};
