import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App.jsx';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#424242',
      },
    },
  },
  fonts: {
    heading: '"Segoe UI", sans-serif',
    body: '"Segoe UI", sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
