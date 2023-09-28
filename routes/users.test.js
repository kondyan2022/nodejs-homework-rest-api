const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../app");
const { User } = require("../models/user");

const { DB_HOST_TEST, PORT = 3000 } = process.env;

describe("test for user route", () => {
  let server = null;
  let token = "";
  const payload = { email: "testuser@testuser.com", password: "123456" };
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });
  test("Try to login unexisting user - failure ", async () => {
    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(payload);
    expect(statusCode).toBe(401);
    expect(body).toEqual({ message: "Email or password is wrong" });
  });

  test("register user - success", async () => {
    const { statusCode, body } = await request(app)
      .post("/users/register")
      .send(payload);
    expect(statusCode).toBe(201);
    expect(body.user).toEqual({
      email: payload.email,
      subscription: "starter",
    });
  });

  test("Try to register existing user - failure", async () => {
    const { statusCode, body } = await request(app)
      .post("/users/register")
      .send(payload);
    expect(statusCode).toBe(409);
    expect(body).toEqual({ message: "Email in use" });
  });

  test("Try to login existing user with novalid pwd - failure ", async () => {
    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send({ ...payload, password: "654321" });
    expect(statusCode).toBe(401);
    expect(body).toEqual({ message: "Email or password is wrong" });
  });

  test("logining existing user with valid pwd - success", async () => {
    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(payload);
    expect(statusCode).toBe(200);
    expect(body.token).toBeTruthy();
    token = body.token;
    expect(body.user).toEqual({
      email: payload.email,
      subscription: "starter",
    });
  });

  test("Get current user - success", async () => {
    const { statusCode, body } = await request(app)
      .get("/users/current")
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).toBe(200);
    expect(body).toEqual({
      email: payload.email,
      subscription: "starter",
    });
  });

  test("Try to Get current user with bad token- failure", async () => {
    const { statusCode, body } = await request(app)
      .get("/users/current")
      .set("Authorization", `Bearer ${token + "p"}`);
    expect(statusCode).toBe(401);
    expect(body).toEqual({ message: "Not authorized" });
  });

  test("Logout user - success", async () => {
    const { statusCode, body } = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).toBe(204);
    expect(body).toEqual({});
  });

  test("Try Logout noautorized user - failure", async () => {
    const { statusCode, body } = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).toBe(401);
    expect(body).toEqual({ message: "Not authorized" });
  });

  test("Try to get noautorized current user - failure", async () => {
    const { statusCode, body } = await request(app)
      .get("/users/current")
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).toBe(401);
    expect(body).toEqual({ message: "Not authorized" });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });
});
