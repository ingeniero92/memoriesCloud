import { AppRegistry } from 'react-native';

import IndexApp from './src/';
import NewMemory from './src/components/NewMemory'

AppRegistry.registerComponent('memoriesCloud', () => IndexApp);
AppRegistry.registerComponent('NewMemory', () => NewMemory);
