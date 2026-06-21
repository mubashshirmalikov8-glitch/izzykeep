import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display — geometric, characterful, full Cyrillic support.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

// Body — neutral, highly legible.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

// Data — OEM codes, quantities, prices, profit.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "IzzyKeep — складской учёт автозапчастей",
  description:
    "IzzyKeep ведёт склад, лоты и продажи автозапчастей и сам считает остатки и прибыль. Без таблиц и путаницы.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="bg-izzy-bg text-izzy-text font-body min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
