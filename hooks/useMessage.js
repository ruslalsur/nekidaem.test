import { useToast } from '@chakra-ui/react';

export const useMessage = () => {
  const toast = useToast();

  const message = (type = 'error', title = 'Error', text = '') => {
    toast({
      title,
      description: text,
      status: type,
      duration: 3000,
      isClosable: true,
    });
  };

  return { message };
};
