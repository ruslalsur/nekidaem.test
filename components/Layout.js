import { Container, Flex } from '@chakra-ui/react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Container maxW='container.lg'>
        <Flex
          pt='54px'
          height='100vh'
          alignItems='center'
          justifyContent='center'
        >
          <main>{children}</main>
        </Flex>
      </Container>
    </>
  );
}
