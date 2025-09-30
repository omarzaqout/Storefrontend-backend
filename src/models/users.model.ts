import { client } from "../database";

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  password: string;
}

export class UserModel {
  static async create(user: User): Promise<User> {
    const result = await client.query(
      "INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *",
      [user.first_name, user.last_name, user.password]
    );
    return result.rows[0];
  }

  static async findByName(
    first_name: string,
    last_name: string
  ): Promise<User | null> {
    const result = await client.query(
      "SELECT * FROM users WHERE first_name = $1 AND last_name = $2 LIMIT 1",
      [first_name, last_name]
    );
    return result.rowCount ? result.rows[0] : null;
  }

  static async findAll(): Promise<User[]> {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  }
}
