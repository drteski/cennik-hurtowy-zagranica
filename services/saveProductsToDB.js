import {
  processPriceHistory,
  processProducts,
} from "@/services/processProducts";
import axios from "axios";

export const saveProductsToDB = async () => {
  return new Promise(async (resolve) => {
    const products = await axios
      .get("https://files.lazienka-rea.com.pl/prices_all.json")
      .then((res) => res.data);

    await processProducts(products);

    await processPriceHistory();
    resolve("Zapisano");
  });
};
