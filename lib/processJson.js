import { config } from "@/config/config";

const { brands } = config;

export const mapBrands = (brandId) => {
  const index = brands.findIndex((brand) => brand.id === brandId);
  return index !== -1 ? brands[index].name : "";
};

export const getLastDaysDate = (days) =>
  new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);
