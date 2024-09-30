-- CreateTable
CREATE TABLE "ExcludeProducts" (
    "id" SERIAL NOT NULL,
    "variantIds" TEXT[],
    "skus" TEXT[],
    "eans" TEXT[],
    "names" TEXT[],

    CONSTRAINT "ExcludeProducts_pkey" PRIMARY KEY ("id")
);
