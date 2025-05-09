import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard Financeiro',
  description: 'Dashboard interativo para análise financeira com KPIs e gráficos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="border-b sticky top-0 z-10 bg-background">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="font-semibold text-lg">Dashboard Financeiro</div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}