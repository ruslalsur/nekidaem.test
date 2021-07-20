import Head from 'next/head';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Link,
} from '@chakra-ui/react';
import Loader from '../../components/Loader';

export default function Create() {
  const { loading, createAccount } = useContext(AppContext);

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        username: '',
        email: '',
        password: '',
        repassword: '',
      },
      validationSchema: yup.object({
        username: yup
          .string()
          .required('required')
          .max(150, 'max 150 symbols')
          .matches(/^[\w.@+-]+$/, 'only chars, symbols and numbers'),
        email: yup
          .string()
          .email('incorrect email format')
          .required('required')
          .max(254, '254 characters max'),
        password: yup
          .string()
          .min(8, '8 characters min') // в api не указано, на сервере проверяется
          .max(128, '128 characters max')
          .matches(/[a-zA-Z0-9]+/, 'must have chars & numbers') // в api не указано, на сервере проверяется
          .required('required'),
        repassword: yup
          .string()
          .required('required')
          .oneOf([yup.ref('password'), null], 'Passwords must match'),
      }),
      onSubmit: ({ username, email, password }) => {
        try {
          createAccount(username, email, password);
        } catch (err) {
          console.log(err.message || 'user create error');
        }
      },
    });

  if (loading) return <Loader size='md' />;

  return (
    <Flex height='100vh' alignItems='center' justifyContent='center'>
      <Head>
        <title>Users | Create</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <Flex direction='column' background='gray.100' p={10} rounded={6}>
          <Heading mb={6}>Create Account</Heading>

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
              name='email'
              placeholder='suhrugen@gmail.com'
              variant='outline'
              type='email'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              isInvalid={errors.email}
              errorBorderColor='red.300'
            />
            {touched.email && errors.email ? (
              <Text ml={1} fontSize='xs' color='red.300'>
                {errors.email}
              </Text>
            ) : null}
          </Box>

          <Box mb={2}>
            <Input
              name='password'
              placeholder='********'
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

          <Box mb={2}>
            <Input
              name='repassword'
              placeholder='********'
              variant='outline'
              type='password'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.repassword}
              isInvalid={errors.repassword}
              errorBorderColor='red.300'
            />
            {touched.repassword && errors.repassword ? (
              <Text ml={1} fontSize='xs' color='red.300'>
                {errors.repassword}
              </Text>
            ) : null}
          </Box>

          <Button colorScheme='teal' mt={7} mb={2} type='submit'>
            Create
          </Button>
          <Flex justifyContent='center'>
            <Text>
              or{' '}
              <NextLink href='/users/auth'>
                <Link color='teal.500'>back to the log in</Link>
              </NextLink>
            </Text>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
}
