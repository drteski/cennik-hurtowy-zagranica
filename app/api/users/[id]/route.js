import { NextResponse } from "next/server";
import prisma from "@/db";
import argon from "argon2";

export const GET = async (request, { params }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      country: true,
      userProducts: {
        include: {
          country: true,
        },
      },
    },
  });
  return new NextResponse(JSON.stringify({ user }), {
    status: 200,
  });
};

export const PUT = async (request, { params }) => {
  const { name, email, password } = await request.json();
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser.id !== parseInt(params.id))
    return new NextResponse(
      JSON.stringify({ message: `E-mail is already used by another user.` }),
      {
        status: 200,
      },
    );

  const data =
    password === ""
      ? {
          name,
          email,
        }
      : { name, email, password: await argon.hash(password) };

  const user = await prisma.user.update({
    where: {
      id: parseInt(params.id),
    },
    data,
  });
  return new NextResponse(
    JSON.stringify({ message: `User saved`, id: user.id }),
    {
      status: 200,
    },
  );
};

export const POST = async (request, { params }) => {
  const { active, name, email, password, countries, userProducts, role } =
    await request.json();
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser.id !== parseInt(params.id)) {
    return new NextResponse(
      JSON.stringify({ message: `E-mail is already used by another user` }),
      {
        status: 200,
      },
    );
  }
  const allCountries = await prisma.country.findMany();
  await prisma.user.update({
    where: {
      id: parseInt(params.id),
    },
    data: {
      active,
      name,
      email,
      role,
      password:
        password === "" ? existingUser.password : await argon.hash(password),
      country: {
        disconnect: allCountries.map((country) => {
          return {
            id: country.id,
          };
        }),
      },
    },
  });
  await Promise.all(
    countries.map(async (country) => {
      return prisma.country.update({
        where: {
          id: parseInt(country),
        },
        data: {
          users: {
            connect: {
              id: parseInt(params.id),
            },
          },
        },
      });
    }),
  );
  await Promise.all(
    countries
      .map(async (country) => {
        const existingUserProducts = await prisma.userProducts.findFirst({
          where: {
            country: {
              some: {
                id: parseInt(country),
              },
            },
            User: {
              some: {
                id: parseInt(params.id),
              },
            },
          },
        });
        if (existingUserProducts) {
          const userProductsIndex = userProducts.findIndex(
            (product) => product.id === existingUserProducts.id,
          );
          console.log(userProductsIndex);
          if (userProductsIndex !== -1) {
            return prisma.userProducts.update({
              where: {
                id: userProducts[userProductsIndex].id,
              },
              data: {
                ids: userProducts[userProductsIndex].ids.map((item) =>
                  parseInt(item),
                ),
                variantIds: userProducts[userProductsIndex].variantIds.map(
                  (item) => parseInt(item),
                ),
                skus: userProducts[userProductsIndex].skus.map((item) =>
                  item.replace(/\s/gm, ""),
                ),
                eans: userProducts[userProductsIndex].eans.map((item) =>
                  item.replace(/\s/gm, ""),
                ),
                names: userProducts[userProductsIndex].names.map(
                  (item) => item,
                ),
                onlyWithSku: userProducts[userProductsIndex].onlyWithSku,
                activeProducts: userProducts[userProductsIndex].activeProducts,
                activeVariants: userProducts[userProductsIndex].activeVariants,
                country: {
                  connect: {
                    id: country,
                  },
                },
                User: {
                  connect: {
                    id: parseInt(params.id),
                  },
                },
              },
            });
          }
        } else {
          return prisma.userProducts.create({
            data: {
              ids: [],
              variantIds: [],
              skus: [""],
              eans: [""],
              names: [""],
              country: {
                connect: {
                  id: country,
                },
              },
              User: {
                connect: {
                  id: parseInt(params.id),
                },
              },
            },
          });
        }
      })
      .filter(Boolean),
  );
  return new NextResponse(JSON.stringify({ message: `User saved` }), {
    status: 200,
  });
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
