import React from 'react';
import { StatusBar } from 'react-native';

import App from './src'

export default function Index() {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <App />
    </>
  );
}