import { client } from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductModel {
  async index(): Promise<Product[]> {
    const conn = await client.connect();
    const sql = "SELECT * FROM products";
    const result = await conn.query(sql);
    conn.release();
    return result.rows.map((row) => ({ ...row, price: parseFloat(row.price) }));
  }

  async show(id: number): Promise<Product | null> {
    const conn = await client.connect();
    const sql = "SELECT * FROM products WHERE id=($1)";
    const result = await conn.query(sql, [id]);
    conn.release();
    if (result.rows[0]) {
      result.rows[0].price = parseFloat(result.rows[0].price);
      return result.rows[0];
    }
    return null;
  }

  async create(p: Product): Promise<Product> {
    const conn = await client.connect();
    const sql =
      "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *";
    const result = await conn.query(sql, [p.name, p.price, p.category]);
    conn.release();
    const row = result.rows[0];
    row.price = parseFloat(row.price);
    return row;
  }

  async productsByCategory(category: string): Promise<Product[]> {
    const conn = await client.connect();
    const sql = "SELECT * FROM products WHERE category=($1)";
    const result = await conn.query(sql, [category]);
    conn.release();
    return result.rows.map((row) => ({ ...row, price: parseFloat(row.price) }));
  }

  async topProducts(): Promise<Product[]> {
    const conn = await client.connect();
    const sql = `
      SELECT p.*, COUNT(op.product_id) as order_count
      FROM products p
      JOIN order_products op ON p.id = op.product_id
      GROUP BY p.id
      ORDER BY order_count DESC
      LIMIT 5
    `;
    const result = await conn.query(sql);
    conn.release();
    return result.rows.map((row) => ({ ...row, price: parseFloat(row.price) }));
  }
}
