import { DataTable } from "@/components/tables/DataTable";
import prisma from "@/db";

export const TableContainer = async ({ country }) => {
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

  const products = (data.length === 0 ? [] : data).map((product) => {
    const { id, sku, ean, names, prices, brand } = product;
    return {
      id: id.toString(),
      sku,
      ean,
      name: names[0].name,
      brand,
      price: {
        currency: prices[0].currency,
        oldPrice: prices[0].oldPrice,
        newPrice: prices[0].newPrice,
        difference: prices[0].oldPrice - prices[0].newPrice,
      },
    };
  });

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
