import "./globals.css";
import { Lato } from "next/font/google";
import { Providers } from "@/components/Layout/Providers";

const inter = Lato({
  weight: ["100", "300", "400", "700", "900"],
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
