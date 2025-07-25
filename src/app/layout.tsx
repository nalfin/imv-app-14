import type { Metadata } from 'next'
import { JetBrains_Mono, Inter_Tight } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const interTightSans = Inter_Tight({
    variable: '--font-sans',
    subsets: ['latin']
})

const jetBrainsMono = JetBrains_Mono({
    variable: '--font-mono',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'IMV Management App',
    description: 'Generated by create next app'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${interTightSans.variable} ${jetBrainsMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
