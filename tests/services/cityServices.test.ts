import axios from "axios";
import { searchCities, getCityByLatLng } from "../../src/services/cityServices";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("cityServices", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("searchCities", () => {
    it("returns cities on success", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          geonames: [
            {
              name: "City1",
              countryName: "Country1",
              adminName1: "Region1",
              lat: "10",
              lng: "20",
            },
          ],
        },
      });
      const results = await searchCities("test", "demo");
      expect(results[0].name).toBe("City1");
    });

    it("throws on timeout", async () => {
      mockedAxios.get.mockRejectedValue({
        code: "ECONNABORTED",
        isAxiosError: true,
      });
      await expect(searchCities("test", "demo")).rejects.toThrow(
        "GeoNames API request timed out after 5 seconds"
      );
    });

    it("throws on other errors", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));
      await expect(searchCities("test", "demo")).rejects.toThrow(
        "Failed to fetch cities from GeoNames"
      );
    });
  });

  describe("getCityByLatLng", () => {
    it("returns city data if found", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          geonames: [
            {
              name: "CityLatLng",
              countryName: "Country",
              adminName1: "Region",
              lat: "11",
              lng: "21",
            },
          ],
        },
      });
      const city = await getCityByLatLng(10, 20, "demo");
      expect(city?.name).toBe("CityLatLng");
    });

    it("returns null if no city found", async () => {
      mockedAxios.get.mockResolvedValue({ data: { geonames: [] } });
      const city = await getCityByLatLng(10, 20, "demo");
      expect(city).toBeNull();
    });

    it("throws on timeout", async () => {
      mockedAxios.get.mockRejectedValue({
        code: "ECONNABORTED",
        isAxiosError: true,
      });
      await expect(getCityByLatLng(10, 20, "demo")).rejects.toThrow(
        "GeoNames findNearby request timed out after 5 seconds"
      );
    });

    it("throws on general error", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Error"));
      await expect(getCityByLatLng(10, 20, "demo")).rejects.toThrow(
        "Failed to fetch city details by lat/lng"
      );
    });
  });
});
