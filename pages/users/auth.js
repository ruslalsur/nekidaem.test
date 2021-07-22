import Head from 'next/head';
import NextLink from 'next/link';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Link,
  Box,
} from '@chakra-ui/react';
import Loader from '../../components/Loader';

export default function Auth() {
  const { loading, login } = useContext(AppContext);

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validationSchema: yup.object({
        username: yup.string().required('required'),
        password: yup.string().required('required'),
      }),
      onSubmit: async ({ username, password }) => {
        login(username, password);
      },
    });

  if (loading) return <Loader size='md' />;

  return (
    <Flex height='100vh' alignItems='center' justifyContent='center'>
      <Head>
        <title>Users | Login</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <Flex direction='column' background='gray.100' p={10} rounded={6}>
          <Heading mb={6}>Log in</Heading>

          <Box mb={2}>
            <Input
              name='username'
              placeholder='username'
              variant='outline'
              type='text'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              isInvalid={errors.username}
              errorBorderColor='red.300'
            />
            {touched.username && errors.username ? (
              <Text ml={1} fontSize='xs' color='red.300'>
                {errors.username}
              </Text>
            ) : null}
          </Box>

          <Box mb={2}>
            <Input
              name='password'
              placeholder='******'
              variant='outline'
              type='password'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              isInvalid={errors.password}
              errorBorderColor='red.300'
            />
            {touched.password && errors.password ? (
              <Text ml={1} fontSize='xs' color='red.300'>
                {errors.password}
              </Text>
            ) : null}
          </Box>

          <Button colorScheme='teal' mt={5} mb={2} type='submit'>
            Log in
          </Button>
          <Flex justifyContent='center'>
            <Text>
              or{' '}
              <NextLink href='/users/create'>
                <Link color='teal.500'>create an account</Link>
              </NextLink>
            </Text>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}
