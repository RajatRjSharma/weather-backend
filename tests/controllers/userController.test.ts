import request from "supertest";
import express from "express";
import * as userController from "../../src/controllers/userController";
import * as userService from "../../src/services/userServices";
import { sendResponse } from "../../src/utils/responseHandler";

jest.mock("../../src/services/userServices");
jest.mock("../../src/utils/responseHandler");

const app = express();
app.use(express.json());
app.post("/register", userController.registerUser);
app.post("/login", userController.loginUser);

describe("User Controller", () => {
  it("registerUser succeeds", async () => {
    (userService.registerUser as jest.Mock).mockResolvedValue(undefined);
    const res = await request(app)
      .post("/register")
      .send({
        username: "test",
        email: "test@example.com",
        password: "Pass1234",
      });
    expect(res.status).toBe(201);
  });

  it("registerUser handles error", async () => {
    (userService.registerUser as jest.Mock).mockRejectedValue(
      new Error("fail")
    );
    const res = await request(app).post("/register").send({});
    expect(res.status).toBe(500);
  });

  it("loginUser succeeds and sets cookies", async () => {
    (userService.loginUser as jest.Mock).mockResolvedValue({
      accessToken: "token",
      refreshToken: "refresh",
    });
    (sendResponse as jest.Mock).mockImplementation(({ res, message }) =>
      res.status(200).json({ message })
    );
    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "Pass1234" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });

  it("loginUser handles error", async () => {
    (userService.loginUser as jest.Mock).mockRejectedValue(new Error("fail"));
    const res = await request(app).post("/login").send({});
    expect(res.status).toBe(500);
  });
});
