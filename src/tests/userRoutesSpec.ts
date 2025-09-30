import supertest from "supertest";
import app from "../server";
import { client } from "../database";
import { setToken } from "./testUtils";
const request = supertest(app);

describe("User Endpoints", () => {
  let token: string;

  beforeAll(async () => {
    await request.post("/api/users/signUp").send({
      firstName: "John",
      last_name: "Doe",
      password: "12345",
    });
    const loginRes = await request.post("/api/users/login").send({
      firstName: "John",
      last_name: "Doe",
      password: "12345",
    });
    token = loginRes.body.token;
    setToken(token);
  });
  it("POST /api/users/login should login user and return token", () => {
    expect(token).toBeDefined();
  });

  it("GET /api/users should return all users (token required)", async () => {
    const res = await request
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  // afterAll(async () => {
  //   const conn = await client.connect();
  //   await conn.query("DELETE FROM users WHERE firstName='John' AND last_name='Doe'");
  //   conn.release();
  // });
});

