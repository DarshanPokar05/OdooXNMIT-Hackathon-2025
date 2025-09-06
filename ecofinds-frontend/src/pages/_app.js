import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => console.log('Razorpay script loaded')}
        onError={() => console.error('Failed to load Razorpay script')}
      />
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Layout>
        </CartProvider>
      </AuthProvider>
    </>
  );
}