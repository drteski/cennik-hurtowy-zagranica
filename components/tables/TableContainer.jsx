import { DataTable } from "@/components/tables/DataTable";
import prisma from "@/db";

export const TableContainer = async ({ country }) => {
  // const filters = await prisma.excludeProducts.findFirst();
  const data = await prisma.product.findMany({
    where: {},
    include: {
      names: {
        where: {
          lang: country.iso,
        },
      },
      prices: {
        where: {
          lang: country.iso,
        },
      },
    },
  });

  const products = data.map((product) => {
    const { id, sku, ean, names, prices, brand } = product;
    return {
      id: id.toString(),
      sku,
      ean,
      name: names.length === 0 ? "" : names[0].name,
      brand,
      price: {
        currency: prices.length === 0 ? "" : prices[0].currency,
        oldPrice: prices.length === 0 ? 0 : prices[0].oldPrice,
        newPrice: prices.length === 0 ? 0 : prices[0].newPrice,
        difference:
          prices.length === 0 ? 0 : prices[0].oldPrice - prices[0].newPrice,
      },
    };
  });
  // .filter(
  //   (product) =>
  //     !filters.names.some((name) =>
  //       product.name.toLowerCase().includes(name.toLocaleString()),
  //     ),
  // )
  // .filter(
  //   (product) =>
  //     !filters.skus.some(
  //       (sku) => product.sku.toLowerCase() === sku.toLowerCase(),
  //     ),
  // )
  // .filter((product) => !filters.eans.some((ean) => product.ean === ean))
  // .filter((product) => !filters.variantIds.some((vid) => product.id === vid));

  const productsWithDifferences = products.filter(
    (product) => product.price.difference !== 0,
  );
  const productsWithoutDifferences = products.filter(
    (product) => product.price.difference === 0,
  );
  const priceChanges = productsWithDifferences.reduce(
    (previousValue, currentValue) => {
      if (currentValue.price.difference > 0) previousValue.priceDown++;
      if (currentValue.price.difference < 0) previousValue.priceUp++;
      return previousValue;
    },
    {
      priceUp: 0,
      priceDown: 0,
    },
  );

  const productProps = [
    ...productsWithDifferences,
    ...productsWithoutDifferences,
  ];
  return (
    <div className="px-4 h-[calc(100dvh_-_120px)] overflow-clip">
      {productProps.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <span className="block text-2xl uppercase font-medium">
            No product data
          </span>
        </div>
      ) : (
        <DataTable
          products={productProps}
          priceChanges={priceChanges}
          country={country}
        />
      )}
    </div>
  );
};
