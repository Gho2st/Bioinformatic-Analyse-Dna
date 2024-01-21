import { Poppins} from 'next/font/google'
import './globals.css'

const poppins = Poppins({ subsets: ['latin'], weight:["100","200","300","400","500"] })

export const metadata = {
  title: 'Analiza danych biologicznych',
  description: 'by Dominik.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
