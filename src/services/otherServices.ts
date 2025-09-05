import axios from "axios";

const OPENTRIPMAP_API_KEY = process.env.OPENTRIPMAP_API_KEY!;
const OPENTRIPMAP_BASE_URL = "https://api.opentripmap.com/0.1/en";
const NEWS_API_KEY = process.env.NEWS_API_KEY!;
const NEWS_BASE_URL = "https://newsapi.org/v2";

export const getAttractionsNearby = async (
  lat: number,
  lon: number,
  radius = 1000
) => {
  const url = `${OPENTRIPMAP_BASE_URL}/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&apikey=${OPENTRIPMAP_API_KEY}`;
  const response = await axios.get(url);
  return response.data; // List of nearby tourist places
};

export const getTopHeadlinesByCountry = async (countryCode: string) => {
  const url = `${NEWS_BASE_URL}/top-headlines?country=${countryCode}&apiKey=${NEWS_API_KEY}`;
  const response = await axios.get(url);
  return response.data; // News articles
};
