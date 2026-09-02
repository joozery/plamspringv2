import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import PublicStickyContact from "./components/PublicStickyContact";
import GoogleTranslateProvider from "./components/GoogleTranslateProvider";
import TransitionProvider from "./components/TransitionProvider";
import { connectDB } from "@/lib/mongodb";
import { SiteSetting } from "@/lib/models";

const GTM_ID = "GTM-NQBJT65K";
const GA_ID = "G-KCQ9ZW5JLT";
const AEO_GEO_KEY = process.env.NEXT_PUBLIC_AEO_GEO_KEY;

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://palmspringscm.com"),
  title: "Palm Springs",
  description: "Palm Springs — เลือกปาล์มสปริงส์ เพื่อชีวิตที่ดีกว่า",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch sticky contact settings (non-blocking — graceful fallback on error)
  let stickySettings: { facebook_messenger_url?: string; line_url?: string } = {};
  try {
    await connectDB();
    const doc = await SiteSetting.findOne({ key: "sticky_contact" }).lean();
    if (doc?.value) stickySettings = doc.value as typeof stickySettings;
  } catch {
    // use defaults
  }

  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap" rel="stylesheet" />
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <Script
          id="ga-loader"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
        {AEO_GEO_KEY && (
          <Script
            id="aeo-geo-snippet"
            src={`https://api.ansio.dev/snippet/aeo.js?key=${AEO_GEO_KEY}`}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <GoogleTranslateProvider />
        <TransitionProvider>
          {children}
        </TransitionProvider>
        <PublicStickyContact
          facebookMessengerUrl={stickySettings.facebook_messenger_url}
          lineUrl={stickySettings.line_url}
        />
      </body>
    </html>
  );
}
