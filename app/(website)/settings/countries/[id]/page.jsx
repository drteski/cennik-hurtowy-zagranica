"use client";

import { CountriesEdit } from "@/components/settings/countries/CountriesEdit";

const SettingsCountryPage = ({ params }) => {
  return <CountriesEdit id={params.id} />;
};

export default SettingsCountryPage;
