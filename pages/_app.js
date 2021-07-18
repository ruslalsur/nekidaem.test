import { ChakraProvider } from '@chakra-ui/react';
import { AuthContext } from '../context/AuthContext';
import { useNekidaemApi } from '../hooks/useNekidaemApi';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const {
    token,
    tokenReady,
    isTokenExpired,
    loading,
    createAccount,
    login,
    logout,
  } = useNekidaemApi();

  let isAuthenticated = false;
  const hasToken = !!token;
  if (tokenReady) {
    if (hasToken && !isTokenExpired()) isAuthenticated = true;
  }

  if (!tokenReady) {
    return null;
  }

  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{
          token,
          tokenReady,
          loading,
          createAccount,
          login,
          logout,
          isAuthenticated,
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
