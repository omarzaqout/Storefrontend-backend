import supertest from "supertest";
import { Product } from "../models/product.model";
import app from "../server"; // Adjust the path if your Express app is in a different location
import { client } from "../database";
import { getToken } from "./testUtils";
const request = supertest(app);

describe("Product Endpoints", () => {
  let token: string;
  let product: Product;

  beforeAll(async () => {
    token = getToken();
    const res = await request
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "API Product",
        price: 300,
        category: "API",
      });
    console.log("productt", res.body);
    product = res.body;
  });

  it("POST /products should create product (with token)", async () => {
    expect(product).toBeDefined();
    expect(product.name).toBe("API Product");
  });

  it("GET /products should return products", async () => {
    const res = await request.get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /products/:id should return product by id", async () => {
    if (!product || !product.id) {
      fail("No product available for GET by id test");
      return;
    }
    const res = await request.get(`/api/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("API Product");
  });
  // afterAll(async () => {
  //   const conn = await client.connect();
  //   await conn.query("DELETE FROM users WHERE firstName='Test' AND last_name='User'");
  //   conn.release();
  // });
});
