import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';

const theme = createTheme(); // تأكد من تكوين الثيم بشكل صحيح

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
