/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import App from './src/App'; // Update path to new location
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
