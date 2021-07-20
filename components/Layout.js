import { Container, Flex } from '@chakra-ui/react';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { isAuthenticated, logout } = useContext(AppContext);
  return (
    <>
      {isAuthenticated && <Navbar />}
      <Container maxW='container.lg'>
        <Flex height='100%' justifyContent='center'>
          <main>{children}</main>
        </Flex>
      </Container>
    </>
  );
}
