import prisma from "@/db";
import { NextResponse } from "next/server";
import argon from "argon2";

export async function GET() {
  const users = await prisma.user.findMany({
    where: {},
    include: {
      country: true,
      userProducts: true,
    },
  });
  return new NextResponse(
    JSON.stringify({ users: users.sort((a, b) => a.id - b.id) }),
    {
      status: 200,
    },
  );
}

export async function POST(request) {
  const { active, name, email, password, role } = await request.json();
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser)
    return new NextResponse(
      JSON.stringify({ message: `E-mail is already used by another user.` }),
      {
        status: 200,
      },
    );

  await prisma.user.create({
    data: {
      active,
      name,
      email,
      role,
      password: await argon.hash(password),
    },
  });
  return new NextResponse(JSON.stringify({ message: `User added` }), {
    status: 200,
  });
}
