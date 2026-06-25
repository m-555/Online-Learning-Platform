import { Hanken_Grotesk, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

// latin-ext covers the French and Luxembourgish diacritics (ë, é, à, …).
// next/font requires these arguments to be inline literals (no spreads/variables).
export const fontDisplay = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-schibsted",
  display: "swap",
});

export const fontSans = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});
