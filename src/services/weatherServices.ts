import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY!;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherData {
  // Define minimal types for your use case or use `any` to start
  [key: string]: any;
}

export const getCurrentWeatherByCity = async (
  city: string
): Promise<WeatherData> => {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

export const getFiveDayForecastByCity = async (
  city: string
): Promise<WeatherData> => {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

export const getCurrentWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

export const getFiveDayForecastByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};
