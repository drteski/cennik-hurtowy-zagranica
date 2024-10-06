"use client";

import { UsersEdit } from "@/components/settings/users/UsersEdit";

const SettingsUserPage = ({ params }) => {
  return <UsersEdit id={params.id} />;
};

export default SettingsUserPage;
