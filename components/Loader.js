import { Flex, Heading, Spinner } from '@chakra-ui/react';

export default function Loader() {
  return (
    <Flex
      direction='column'
      background='gray.100'
      p={10}
      rounded={6}
      justifyContent='center'
      alignItems='center'
    >
      <Heading size='md' mb={6}>
        Loading
      </Heading>
      <Spinner size='md' />
    </Flex>
  );
}
