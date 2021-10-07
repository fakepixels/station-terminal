import React from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { ethers } from 'ethers';
import { ThemeProvider } from '@emotion/react';
import { ApolloProvider } from '@apollo/client';

import { client } from '../apollo/client';
import { globalStyles } from '../shared/styles';
import { theme } from '../shared/style/theme';
import {
  Contracts,
  accountContext,
  contractsContext,
  web3Context,
} from '../shared/contexts';
import 'react-toastify/dist/ReactToastify.css';

declare const window: any;

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const [account, setAccount] = React.useState<string>('');
  // TODO: Fix types here
  const [web3, setWeb3] = React.useState<any>(undefined);
  const [contracts, setContracts] = React.useState<Contracts>({});

  // getLayout allows us to share Navbar state between pages
  const getLayout = Component.getLayout ?? ((page) => page);

  const getAccount = async () => {
    try {
      const signer = web3.getSigner();
      const res = await signer.getAddress();
      setAccount(res);
    } catch (err) {
      console.log('ERR:', err);
    }
  };

  // Connect to blockchain via the provider
  React.useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setWeb3(provider);
      window.ethereum.on('accountsChanged', function (accounts: string[]) {
        setAccount(accounts[0]);
      });
    } else {
      console.log('No web3? You should consider trying MetaMask!');
    }
  }, []);

  React.useEffect(() => {
    if (!web3) return;
    getAccount();
  }, [web3]);

  return (
    <ApolloProvider client={client}>
      <web3Context.Provider value={web3}>
        <contractsContext.Provider value={{ contracts, setContracts }}>
          <accountContext.Provider value={account}>
            {globalStyles}
            <ThemeProvider theme={theme}>
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </accountContext.Provider>
        </contractsContext.Provider>
      </web3Context.Provider>
      <ToastContainer autoClose={4000} />
    </ApolloProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;
