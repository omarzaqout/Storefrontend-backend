import supertest from "supertest";
import app from "../server";
import { getToken, setToken } from "./testUtils";
import { getUserIdFromToken } from "../middleware/auth";
import jwt from "jsonwebtoken";
const request = supertest(app);

describe("Order Endpoints", () => {
  let token: string;
  let orderId: number;
  let productId: number;
  let userId: number;
  beforeAll(async () => {
    try {
      token = getToken();
    } catch (err) {
      const loginRes = await request.post("/api/users/login").send({
        firstName: "John",
        last_name: "Doe",
        password: "12345",
      });
      token = loginRes.body.token;
      // optional: سجل التوكن عالميًا
      setToken(token);
    }

    userId = (jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as { userId: number }).userId;

    console.log("userIdd", userId);
    console.log("tokenss", token);

    // إنشاء منتج للاستخدام في الطلب
    const productRes = await request
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Product", price: 100, category: "Test" });

    productId = productRes.body.id;
    console.log("ppp", productId);
  });

  it("POST /api/orders should create an order", async () => {
    const res = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: userId, status: "active" });

    expect(res.status).toBe(201);
    expect(res.body.order.status).toBe("active");
    orderId = res.body.order.id;
  });

  it("POST /api/orders/add-product should add product to order", async () => {
    const res = await request
      .post("/api/orders/addProduct")
      .set("Authorization", `Bearer ${token}`)
      .send({ orderId: orderId, productId: productId, quantity: 2 });
    console.log("resss3", res.body);
    expect(res.status).toBe(201);
    expect(res.body.orderProduct.quantity).toBe(2);
  });


  it("GET /api/orders/current should return current active order", async () => {
    const res = await request
      .get("/api/orders/current")
      .set("Authorization", `Bearer ${token}`);

    console.log("resss2", res.body);

    expect(res.status).toBe(200);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.status).toBe("active");
    expect(res.body.products).toBeDefined();
    expect(Array.isArray(res.body.products)).toBeTrue();
  });

  it("PUT /api/orders/status should update order status", async () => {
    if (!orderId) throw new Error("orderId not set before PUT test");
    const res = await request
      .put("/api/orders/updateStatus")
      .set("Authorization", `Bearer ${token}`)
      .send({ orderId: orderId, status: "complete" });
    console.log("resss1", res.body);
    console.log("oo", orderId, "**", res.body.order.status);
    expect(res.status).toBe(200);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.status).toBe("complete");
  });
});
