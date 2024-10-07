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
}

export const POST = async (request, { params }) => {
  const { active, name, email, password, countries, role } =
    await request.json();
  if (active) {
    const allCountries = await prisma.country.findMany();
    if (password === "") {
      const user = await prisma.user.update({
        where: {
          id: parseInt(params.id),
        },
        data: {
          active,
          name,
          email,
          role,
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
                  id: user.id,
                },
              },
            },
          });
        }),
      );
      await Promise.all(
        countries.map(async (country) => {
          const existingUserProducts = await prisma.userProducts.findFirst({
            where: {
              countryId: parseInt(country),
            },
          });
          if (existingUserProducts) {
            return prisma.userProducts.update({
              where: {
                id: existingUserProducts.id,
              },
              data: {
                ids: [],
                variantIds: [],
                skus: [],
                eans: [],
                names: [],
                country: {
                  connect: {
                    id: country,
                  },
                },
                User: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
          } else {
            return prisma.userProducts.create({
              data: {
                ids: [],
                variantIds: [],
                skus: [],
                eans: [],
                names: [],
                country: {
                  connect: {
                    id: country,
                  },
                },
                User: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
          }
        }),
      );
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
          active,
          name,
          email,
          role,
          country: {
            disconnect: allCountries.map((country) => {
              return {
                id: country.id,
              };
            }),
          },
          password: await argon.hash(password),
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
                  id: user.id,
                },
              },
            },
          });
        }),
      );
      await Promise.all(
        countries.map(async (country) => {
          const existingUserProducts = await prisma.userProducts.findFirst({
            where: {
              countryId: parseInt(country),
            },
          });
          if (existingUserProducts) {
            return prisma.userProducts.update({
              where: {
                id: existingUserProducts.id,
              },
              data: {
                ids: [],
                variantIds: [],
                skus: [],
                eans: [],
                names: [],
                country: {
                  connect: {
                    id: country,
                  },
                },
                User: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
          } else {
            return prisma.userProducts.create({
              data: {
                ids: [],
                variantIds: [],
                skus: [],
                eans: [],
                names: [],
                country: {
                  connect: {
                    id: country,
                  },
                },
                User: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
          }
        }),
      );
      return new NextResponse(
        JSON.stringify({ message: `Użytkownik zapisany`, id: user.id }),
        {
          status: 200,
        },
      );
    }
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
