import NextLink from 'next/link';
import { Container, Flex, Box, Heading, Button, Link } from '@chakra-ui/react';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useContext(AppContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Flex
      borderBottom='2px'
      borderColor='gray.100'
      height='54px'
      width='100%'
      zIndex={2}
      alignItems='center'
      flexWrap='nowrap'
    >
      <Container maxW='container.lg'>
        <Flex>
          <Box flex={1}>
            <NextLink href='/'>
              <Link>
                <Heading as='h3' size='lg' color='blackAlpha.700'>
                  <span style={{ color: '#00A4FF' }}>NE</span>kidaem test
                </Heading>
              </Link>
            </NextLink>
          </Box>
          <Box>
            <Button onClick={handleLogout} colorScheme='blue' variant='ghost'>
              Log out
            </Button>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}
