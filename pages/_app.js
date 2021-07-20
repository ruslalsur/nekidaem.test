import { ChakraProvider } from '@chakra-ui/react';
import { AppContext } from '../context/AppContext';
import { useApi } from '../hooks/useApi';
import { useMessage } from '../hooks/useMessage';
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
    cards,
    setCards,
    deleteCard,
    updateCard,
    addCard,
  } = useApi();

  const { message } = useMessage();

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
      <AppContext.Provider
        value={{
          cards,
          setCards,
          token,
          tokenReady,
          loading,
          message,
          createAccount,
          login,
          logout,
          isAuthenticated,
          deleteCard,
          updateCard,
          addCard,
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
