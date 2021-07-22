import { Container, Flex, Box, useToast } from '@chakra-ui/react';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import Navbar from './Navbar';
import { Message } from './Message';

export default function Layout({ children }) {
  const { isAuthenticated, messages } = useContext(AppContext);

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Container maxW='container.lg'>
        <Flex height='100%' justifyContent='center'>
          <Box w='100%'>{children}</Box>
        </Flex>
        <Flex justifyContent='center'>
          <Box pos='fixed' bottom={2}>
            {messages && (
              <Message
                type={messages?.type || 'error'}
                title={messages?.title || ''}
                text={messages?.text || ''}
              />
            )}
          </Box>
        </Flex>
      </Container>
    </>
  );
}
