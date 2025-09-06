import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY!;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const TIMEOUT_MS = 5000; // 5 seconds

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
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error("Current weather request timed out after 5 seconds");
    }
    throw error;
  }
};

export const getFiveDayForecastByCity = async (
  city: string
): Promise<WeatherData> => {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error("5-day forecast request timed out after 5 seconds");
    }
    throw error;
  }
};

export const getCurrentWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error(
        "Current weather by coords request timed out after 5 seconds"
      );
    }
    throw error;
  }
};

export const getFiveDayForecastByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const response = await axios.get(url, { timeout: TIMEOUT_MS });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      throw new Error(
        "5-day forecast by coords request timed out after 5 seconds"
      );
    }
    throw error;
  }
};
