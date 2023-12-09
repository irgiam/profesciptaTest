/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import NavigationProvider from './src/navigations/NavigationProvider';
import Login from './src/screens/Login';
import { Provider } from "react-redux";
import store from './src/redux/store';
// import { ToastProvider } from 'react-native-toast-notifications';


function App(): JSX.Element {
  return (
    <Provider store={store}>
      <NavigationProvider />
    </Provider>
    // <Login />
  )
}


export default App;
