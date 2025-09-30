import { client } from "../database";

export type Order = {
  id?: number;
  user_id: number;
  status: string; // active or complete
};
export type OrderProduct = {
  id?: number;
  quantity: number;
  order_id: number;
  product_id: number;
};

export class OrderModel {
  async currentOrderByUser(userId: number): Promise<Order | null> {
    const conn = await client.connect();
    const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'";
    const result = await conn.query(sql, [userId]);
    conn.release();
    return result.rows[0] || null;
  }

  async completedOrdersByUser(userId: number): Promise<Order[]> {
    const conn = await client.connect();
    const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='complete'";
    const result = await conn.query(sql, [userId]);
    conn.release();
    return result.rows;
  }

  async create(o: Order): Promise<Order> {
    const conn = await client.connect();
    const sql =
      "INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *";
    const result = await conn.query(sql, [o.user_id, o.status]);
    conn.release();
    return result.rows[0];
  }

  async updateStatus(orderId: number, status: string): Promise<Order | null> {
    const conn = await client.connect();
    const sql = "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *";
    const result = await conn.query(sql, [status, orderId]);
    conn.release();
    return result.rows[0] || null;
  }
}
export class OrderProductModel {
  async addProduct(op: OrderProduct): Promise<OrderProduct> {
    const conn = await client.connect();
    const sql =
      "INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *";
    const result = await conn.query(sql, [
      op.quantity,
      op.order_id,
      op.product_id,
    ]);
    conn.release();
    return result.rows[0];
  }

  async getProductsByOrder(orderId: number): Promise<OrderProduct[]> {
    const conn = await client.connect();
    const sql = "SELECT * FROM order_products WHERE order_id=($1)";
    const result = await conn.query(sql, [orderId]);
    conn.release();
    return result.rows;
  }
}
