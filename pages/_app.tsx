import { AppProps } from 'next/app'; // Импортируем AppProps для типизации

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {  // Типизируем пропсы
  return (
    <div className="min-h-screen bg-gray-100">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
