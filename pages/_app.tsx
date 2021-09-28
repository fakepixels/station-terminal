import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { ethers } from 'ethers';
import { ThemeProvider } from '@emotion/react';
import { ApolloProvider } from '@apollo/client';
// import { useInterval } from 'react-use';

import client from '../shared/apollo-client';
import { globalStyles } from '../shared/styles';
import { theme } from '../shared/style/theme';
import {
  accountContext,
  contractsContext,
  web3Context,
} from '../shared/contexts';

declare const window: any;

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const [account, setAccount] = React.useState<string>('');
  console.log(setAccount); //TODO remove
  // TODO: Fix types here
  const [web3, setWeb3] = React.useState<any>(undefined);
  const [contracts, setContracts] = React.useState<any>(undefined);

  const getLayout = Component.getLayout ?? ((page) => page);

  React.useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setWeb3(provider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');
    }
  }, []);

  // useInterval(async () => {
  //   if (!web3) return;
  //   const selectedAccount = await web3.getSigner();
  //   // TODO: this is incorrect
  //   if (selectedAccount == account) return;
  //   setAccount(selectedAccount);
  // }, 500);

  return (
    <ApolloProvider client={client}>
      <web3Context.Provider value={web3}>
        <contractsContext.Provider value={[contracts, setContracts]}>
          <accountContext.Provider value={account}>
            {globalStyles}
            <ThemeProvider theme={theme}>
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </accountContext.Provider>
        </contractsContext.Provider>
      </web3Context.Provider>
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
