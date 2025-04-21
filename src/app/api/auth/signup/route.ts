import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
