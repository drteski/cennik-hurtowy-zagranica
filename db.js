import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ["info"] });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["error", "info", "warn"],
      errorFormat: "pretty",
    });
  }
  prisma = global.prisma;
}

export default prisma;
