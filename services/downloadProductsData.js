import { Client } from "basic-ftp";

const { FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS, FTP_LOCATION } = process.env;

export const downloadProductsData = async () => {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: FTP_HOST,
      port: FTP_PORT,
      user: FTP_USER,
      password: FTP_PASS,
      secure: false,
    });
    await client.downloadToDir(
      "./public/temp/data",
      FTP_LOCATION + "fulloffer",
    );
  } catch (err) {
    console.log(err);
  }
  client.close();
};
