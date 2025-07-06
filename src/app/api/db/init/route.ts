import { NextResponse } from "next/server";
import { UserRepository } from "@/utils/database";

export async function POST() {
  try {
    await UserRepository.createTable();
    return NextResponse.json({
      success: true,
      message: "Users table created successfully",
    });
  } catch (error) {
    console.error("Error creating users table:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create users table",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
