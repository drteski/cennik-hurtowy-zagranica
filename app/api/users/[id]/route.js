import { NextResponse } from "next/server";
import prisma from "@/db";
import argon from "argon2";

export async function GET(request, { params }) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      country: true,
    },
  });
  return new NextResponse(JSON.stringify({ user }), {
    status: 200,
  });
}

export const PUT = async (request, { params }) => {
  const { active, name, email, password } = await request.json();
  if (active) {
  } else {
    if (password === "") {
      const user = await prisma.user.update({
        where: {
          id: parseInt(params.id),
        },
        data: {
          name,
          email,
        },
      });
      return new NextResponse(
        JSON.stringify({ message: `Użytkownik zapisany`, id: user.id }),
        {
          status: 200,
        },
      );
    } else {
      const user = await prisma.user.update({
        where: {
          id: parseInt(params.id),
        },
        data: {
          name,
          email,
          password: await argon.hash(password),
        },
      });
      return new NextResponse(
        JSON.stringify({ message: `Użytkownik zapisany`, id: user.id }),
        {
          status: 200,
        },
      );
    }
  }
};

export async function DELETE(request, { params }) {
  await prisma.user.delete({
    where: {
      id: parseInt(params.id),
    },
  });
  return new NextResponse(JSON.stringify({ message: "Użytkownik usunięty" }), {
    status: 201,
  });
}
