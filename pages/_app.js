import { ChakraProvider } from '@chakra-ui/react';
import { AppContext } from '../context/AppContext';
import { useApi } from '../hooks/useApi';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const {
    token,
    tokenIsReady,
    isTokenExpired,
    loading,
    createAccount,
    login,
    logout,
    cards,
    deleteCard,
    updateCard,
    addCard,
    messages,
    showMessages,
  } = useApi();

  let isAuthenticated = false;
  const hasToken = !!token;
  if (tokenIsReady) {
    if (hasToken && !isTokenExpired()) isAuthenticated = true;
  }

  if (!tokenIsReady) {
    return null;
  }

  return (
    <ChakraProvider>
      <AppContext.Provider
        value={{
          cards,
          token,
          tokenIsReady,
          loading,
          createAccount,
          login,
          logout,
          isAuthenticated,
          deleteCard,
          updateCard,
          addCard,
          messages,
          showMessages,
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
