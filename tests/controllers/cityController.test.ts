import request from "supertest";
import express from "express";
import * as cityController from "../../src/controllers/cityController";
import * as cityService from "../../src/services/cityServices";

const app = express();
app.get("/cities", cityController.getCities);
app.get("/cityByCoords", cityController.getCityByLatLng);

jest.mock("../../src/services/cityServices");

describe("City Controller", () => {
  describe("getCities", () => {
    it("returns 400 if query missing", async () => {
      const res = await request(app).get("/cities");
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/required/);
    });

    it("returns 200 and city list on success", async () => {
      (cityService.searchCities as jest.Mock).mockResolvedValue([
        {
          name: "Test",
          countryName: "Country",
          adminName1: "Region",
          lat: "1",
          lng: "2",
        },
      ]);
      const res = await request(app).get("/cities?query=test");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("returns 500 on service failure", async () => {
      (cityService.searchCities as jest.Mock).mockRejectedValue(
        new Error("Failure")
      );
      const res = await request(app).get("/cities?query=test");
      expect(res.status).toBe(500);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Failure");
    });
  });

  describe("getCityByLatLng", () => {
    it("returns 400 if lat or lng missing", async () => {
      const res = await request(app).get("/cityByCoords");
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/required/);
    });

    it("returns 404 if city not found", async () => {
      (cityService.getCityByLatLng as jest.Mock).mockResolvedValue(null);
      const res = await request(app).get("/cityByCoords?lat=1&lng=2");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/);
    });

    it("returns 200 and city data on success", async () => {
      (cityService.getCityByLatLng as jest.Mock).mockResolvedValue({
        name: "City",
        countryName: "Country",
        adminName1: "Region",
        lat: "1",
        lng: "2",
      });
      const res = await request(app).get("/cityByCoords?lat=1&lng=2");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.name).toBe("City");
    });

    it("returns 500 on service failure", async () => {
      (cityService.getCityByLatLng as jest.Mock).mockRejectedValue(
        new Error("Service Error")
      );
      const res = await request(app).get("/cityByCoords?lat=1&lng=2");
      expect(res.status).toBe(500);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Service Error");
    });
  });
});
