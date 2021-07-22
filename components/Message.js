import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

export const Message = ({ type, title, text }) => {
  return (
    <Alert status={type}>
      <AlertIcon />
      <AlertTitle mr={2}>{title}</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  );
};
