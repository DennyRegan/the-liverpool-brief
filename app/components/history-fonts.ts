import { IM_Fell_English, IM_Fell_English_SC, Old_Standard_TT } from "next/font/google";

// The Back Pages typefaces, used only on Looking Back pages (requested by Denny
// on 7 November 2026): IM Fell English for text, its true small caps for labels,
// Old Standard TT bold for headlines. No blackletter. Each sets a CSS variable;
// app/looking-back/history.css and app/components/history-article.css use them.
const body = IM_Fell_English({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--lb-f-body" });
const smallCaps = IM_Fell_English_SC({ weight: "400", subsets: ["latin"], variable: "--lb-f-caps" });
const headline = Old_Standard_TT({ weight: "700", subsets: ["latin"], variable: "--lb-f-headline" });

/** Class names that define the Looking Back font variables. */
export const historyFonts = `${body.variable} ${smallCaps.variable} ${headline.variable}`;
