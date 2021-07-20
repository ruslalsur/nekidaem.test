import { Flex, Heading, Spinner } from '@chakra-ui/react';

export default function Loader() {
  return (
    <Flex height='90vh' alignItems='center' justifyContent='center'>
      <Flex
        direction='column'
        background='blackAlpha.50'
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
    </Flex>
  );
}
