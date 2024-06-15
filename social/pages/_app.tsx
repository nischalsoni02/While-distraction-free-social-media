import { Layout } from '@/components';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';


const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <MantineProvider defaultColorScheme="light">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </>
  );
};

export default App;
