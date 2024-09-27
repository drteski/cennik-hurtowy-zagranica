-- CreateTable
CREATE TABLE "ProductPrices" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "oldPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "newPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProductPrices_pkey" PRIMARY KEY ("id")
);
