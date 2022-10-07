import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { NativeBaseProvider } from "native-base"

import NewItemScreen from './pages/NewItemScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    {/* <View style={{ flex: 1}}> */}
      <Text>Home Screen</Text>
      <Button
         title="Add New Item" 
         onPress={() => navigation.navigate('NewItem')} 
      /> 
    </View>
  );
}

function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'> 
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Welcome'}}
            />
          <Stack.Screen
            name="NewItem"
            component={NewItemScreen}
            options={{ title: "New Item"}}
            />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;