import { ProductModel } from "../models/product.model";

const productModel = new ProductModel();

describe("Product Model", () => {
  it("should have an index method", () => {
    expect(productModel.index).toBeDefined();
  });

  it("should create a product", async () => {
    const product = await productModel.create({
      name: "Test Product",
      price: 100,
      category: "Test",
    });
    expect(product).toEqual({
      id: product.id, // auto generated
      name: "Test Product",
      price: 100,
      category: "Test",
    });
  });

  it("should return list of products", async () => {
    const result = await productModel.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return the correct product by id", async () => {
    const created = await productModel.create({
      name: "Another Product",
      price: 200,
      category: "Test",
    });
    const result = await productModel.show(created.id as number);
    expect(result?.name).toBe("Another Product");
  });
});
