import { neon } from "@neondatabase/serverless";

const sql = neon(process.env["DATABASE_URL"]!);

export { sql };

// User interface for TypeScript
export interface User {
  id?: number;
  username: string;
  accesstoken: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

// Database operations for User table
export class UserRepository {
  // Create the users table if it doesn't exist
  static async createTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        accesstoken TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }

  // Create or update user
  static async upsertUser(
    user: Omit<User, "id" | "created_at" | "updated_at">
  ) {
    const result = await sql`
      INSERT INTO users (username, accesstoken, role)
      VALUES (${user.username}, ${user.accesstoken}, ${user.role})
      ON CONFLICT (username)
      DO UPDATE SET
        accesstoken = EXCLUDED.accesstoken,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    return result[0] as User;
  }

  // Get user by username
  static async getUserByUsername(username: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    return (result[0] as User) || null;
  }

  // Get user by access token
  static async getUserByAccessToken(accessToken: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE accesstoken = ${accessToken}
    `;
    return (result[0] as User) || null;
  }

  // Update user access token
  static async updateAccessToken(username: string, accessToken: string) {
    const result = await sql`
      UPDATE users
      SET accesstoken = ${accessToken}, updated_at = CURRENT_TIMESTAMP
      WHERE username = ${username}
      RETURNING *
    `;
    return result[0] as User;
  }

  // Update user role
  static async updateUserRole(username: string, role: string) {
    const result = await sql`
      UPDATE users
      SET role = ${role}, updated_at = CURRENT_TIMESTAMP
      WHERE username = ${username}
      RETURNING *
    `;
    return result[0] as User;
  }

  // Delete user
  static async deleteUser(username: string) {
    await sql`
      DELETE FROM users WHERE username = ${username}
    `;
  }
}
