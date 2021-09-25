import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import Web3 from 'web3';
import { ThemeProvider } from '@emotion/react';
import { ApolloProvider } from '@apollo/client';
import { useInterval } from 'react-use';

import client from '../shared/apollo-client';
import { globalStyles } from '../shared/styles';
import { theme } from '../shared/style/theme';
import { accountContext, contractContext } from '../shared/contexts';
import contractJson from '../public/contractABI';

declare const window: any;

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const [account, setAccount] = React.useState<string>('');
  const [contract, setContract] = React.useState<any>(undefined);
  const [web3, setWeb3] = React.useState<any>(undefined);

  const getLayout = Component.getLayout ?? ((page) => page);

  React.useEffect(() => {
    const contractAddress = process.env.NEXT_PUBLIC_MEM_CONTRACT_ADDRESS;

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        // eslint-disable-next-line
        // @ts-ignore
        contractJson.abi,
        contractAddress,
      );
      setWeb3(web3);
      setContract(contract);
    } else {
      console.log('No web3? You should consider trying MetaMask!');
    }
  }, []);

  useInterval(async () => {
    if (!web3) return;
    const accounts = await web3.eth.getAccounts();
    const selectedAccount = accounts[0];
    if (selectedAccount == account) return;
    setAccount(selectedAccount);
    // }
  }, 500);

  return (
    <ApolloProvider client={client}>
      <accountContext.Provider value={account}>
        <contractContext.Provider value={contract}>
          {globalStyles}
          <ThemeProvider theme={theme}>
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </contractContext.Provider>
      </accountContext.Provider>
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
