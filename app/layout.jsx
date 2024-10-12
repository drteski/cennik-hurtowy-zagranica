import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { Providers } from "@/components/Layout/Providers";

const inter = IBM_Plex_Sans({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin-ext"],
});

export const metadata = {
  title: "Prices Podlasiak",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}