import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import Providers from "../providers";

// Walnut Retro Typography
const playfair = Playfair_Display({ 
    subsets: ["latin"],
    variable: '--font-retro',
    display: 'swap',
});

const sourceSans = Source_Sans_3({ 
    subsets: ["latin"],
    variable: '--font-retro-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "AI Dala",
    description: "AI-Native Web Portal",
    metadataBase: new URL('https://ai-dala.com'),
};

const locales = ['en', 'ru', 'kk'];

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages({ locale });

    return (
        <html lang={locale}>
            <body className={`${playfair.variable} ${sourceSans.variable} font-retro-sans bg-retro-cream`}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <Providers>{children}</Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}
