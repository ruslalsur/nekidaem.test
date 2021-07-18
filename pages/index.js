import { useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Home.module.css';
import Loader from '../components/Loader';

export default function Home() {
  const router = useRouter();
  const { loading, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);

  if (!isAuthenticated) {
    router.push('/users/auth');
  }

  if (loading) return <Loader />;

  return (
    <>
      <Head>
        <title>NEtest | Cards</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
    </>
  );
}
