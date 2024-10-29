import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Layout/Providers";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "900"],
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
