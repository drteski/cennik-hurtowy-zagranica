-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "ean" TEXT NOT NULL,
    "brand" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPrice" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "oldPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "newPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductName" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "iso" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailingList" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "emails" TEXT[],

    CONSTRAINT "MailingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcludeProducts" (
    "id" SERIAL NOT NULL,
    "variantIds" INTEGER[],
    "skus" TEXT[],
    "eans" TEXT[],
    "names" TEXT[],
    "activeVariants" BOOLEAN NOT NULL DEFAULT false,
    "activeProducts" BOOLEAN NOT NULL DEFAULT false,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "ExcludeProducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductName" ADD CONSTRAINT "ProductName_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingList" ADD CONSTRAINT "MailingList_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcludeProducts" ADD CONSTRAINT "ExcludeProducts_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
