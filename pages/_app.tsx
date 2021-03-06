import React from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { ThemeProvider } from '@emotion/react';
import { ApolloProvider } from '@apollo/client';
import { Web3ReactProvider } from '@web3-react/core';
import { globalStyles } from '../shared/styles';
import { theme } from '../shared/style/theme';
import { Contracts, contractsContext } from '../shared/contexts';
import { getLibrary } from '../shared/wallet/initializeWallet';
import { createStore, compose } from 'redux';
import { client } from '../utils/apollo/client';
import { Provider } from 'react-redux';
import rootReducer from '../state/rootReducer';
import 'react-toastify/dist/ReactToastify.css';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const composeEnhancer =
  (process.env.REACT_APP_PROD !== 'production' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const reduxStore = createStore(rootReducer, composeEnhancer());

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const [contracts, setContracts] = React.useState<Contracts>({});

  const getLayout = Component.getLayout ?? ((page) => page); // getLayout allows us to share Navbar state between pages

  return (
    <Provider store={reduxStore}>
      <ApolloProvider client={client}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <contractsContext.Provider value={{ contracts, setContracts }}>
            {globalStyles}
            <ThemeProvider theme={theme}>
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </contractsContext.Provider>
          <ToastContainer autoClose={4000} />
        </Web3ReactProvider>
      </ApolloProvider>
    </Provider>
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
