import { Client } from "basic-ftp";
import fs from "fs";

const { FTP_HOST, FTP_PORT, FTP_USER, FTP_PASS, FTP_LOCATION } = process.env;

export const downloadProductsData = async () => {
  let tries = 0;
  return new Promise(async (resolve, reject) => {
    const client = new Client();
    try {
      const connection = await client.access({
        host: FTP_HOST,
        port: FTP_PORT,
        user: FTP_USER,
        password: FTP_PASS,
        secure: false,
      });

      if (connection.code === 220) {
        await fs.readdir("./public/temp/data", async (error, files) => {
          if (error) return;
          if (files.length !== 1)
            return files.forEach((file) => {
              if (file !== ".gitkeep")
                fs.unlinkSync("./public/temp/data/" + file);
            });
        });
      }

      await client.downloadToDir(
        "./public/temp/data",
        FTP_LOCATION + "fulloffer",
      );
      client.close();
      resolve();
    } catch (err) {
      if (tries === 3) {
        client.close();
        return reject;
      }
      tries += 1;
      await downloadProductsData();
    }
  });
};
