import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WardrobeScreen from './pages/WardrobeScreen.js';
import HomeScreen from './pages/HomeScreen.js';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}


