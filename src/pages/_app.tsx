import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionUserProvider } from '@/contexts/SessionUserContexts'
import moment from "moment";
import 'moment/locale/id';  // Import the Indonesian locale

export default function App({ Component, pageProps }: AppProps) {
  moment.locale('id');

  return (
    <SessionUserProvider>
      <Component {...pageProps} />
    </SessionUserProvider>
  )
}
