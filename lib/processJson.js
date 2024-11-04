import { config } from "@/config/config";
import fs from "fs";

const { brands, tariff } = config;

const dataPath = `${process.cwd().replace(/\\\\/g, "/")}/public/temp/data/`;
export const mapBrands = (brandId) => {
  const index = brands.findIndex((brand) => brand.id === brandId);
  return index !== -1 ? brands[index].name : "";
};

export const getLastDaysDate = (days) =>
  new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);

export const mapTitles = (titles) => {
  return tariff.reduce((prev, curr) => {
    const dataIndex = titles
      .map((title) => {
        if (title.$lang === "et") return { ...title, $lang: "ee" };
        if (title.$lang === "bn") return { ...title, $lang: "be" };
        if (title.$lang === "os") return { ...title, $lang: "at" };
        if (title.$lang === "ga") return { ...title, $lang: "ie" };
        if (title.$lang === "sl") return { ...title, $lang: "si" };
        if (title.$lang === "el") return { ...title, $lang: "gr" };
        if (title.$lang === "uk") return { ...title, $lang: "ua" };
        return title;
      })
      .findIndex((d) => d.$lang === curr.lang);
    if (dataIndex === -1) {
      return [
        ...prev,
        {
          lang: curr.lang,
          value: "",
        },
      ];
    }
    return [
      ...prev,
      {
        lang: curr.lang,
        value:
          titles[dataIndex].$ === undefined
            ? ""
            : titles[dataIndex].$ === "---"
              ? ""
              : titles[dataIndex].$,
      },
    ];
  }, []);
};

export const processFile = (file) => {
  return new Promise(async (resolve, reject) => {
    await fs.readFile(dataPath + file, "utf8", async (error, data) => {
      if (error) reject(error);
      resolve(JSON.parse(data));
    });
  });
};

export const mapPrices = (data) => {
  const preparedPrices = [];
  if (data.length !== 0) {
    if (data.price.length !== undefined) {
      preparedPrices.push(
        ...data.price.map((price) => ({
          tariff: parseInt(price.$tariff_strategy),
          tax: parseInt(price.$tax),
          price: parseFloat(price.$gross),
        })),
      );
    } else {
      preparedPrices.push({
        tariff: parseInt(data.price.$tariff_strategy),
        tax: parseInt(data.price.$tax),
        price: parseFloat(data.price.$gross),
      });
    }
  }
  return tariff
    .map((tar) => {
      const priceId = preparedPrices.findIndex(
        (price) => price.tariff === tar.tariff,
      );
      if (priceId !== -1) {
        return {
          tariff: tar.tariff,
          tax: tar.tax,
          price: preparedPrices[priceId].price,
          currency: tar.currency,
          lang: tar.lang,
        };
      }
      return {
        tariff: tar.tariff,
        tax: tar.tax,
        price: 0,
        currency: tar.currency,
        lang: tar.lang,
      };
    })
    .reduce((prev, curr) => {
      return [
        ...prev,
        {
          price: curr.price,
          lang: curr.lang,
          currency: curr.currency,
        },
      ];
    }, []);
};
