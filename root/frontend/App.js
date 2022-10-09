import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { NativeBaseProvider } from "native-base"

import WardrobeScreen from "./pages/WardrobeScreen.js";
import HomeScreen from "./pages/HomeScreen.js";
import SignUpScreen from "./pages/SignUpScreen.js";
import SignInScreen from "./pages/SignInScreen.js";
import NewItemScreen from './pages/NewItemScreen.js';
import CategoryListScreen from './pages/CategoryListScreen.jsx';
import ItemListScreen from './pages/ItemListScreen.jsx';

const Stack = createNativeStackNavigator();

const signedIn = true;

export default function App() {
  const initialRoute = signedIn ? "Home" : "SignUp";
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'> 
          <Stack.Group>
          <Stack.Screen name="Sign Up" component={SignUpScreen} />
          <Stack.Screen name="Sign In" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome'}} />
          <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
          <Stack.Screen name="NewItem" component={NewItemScreen} options={{ title: "New Item"}} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="CategoryList" component={CategoryListScreen} options={{ title:"Clothing Types"}} />
            <Stack.Screen name="ItemList" component={ItemListScreen} options={({ route }) => ({ title: route.params.name })} />
          </Stack.Group>


        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
