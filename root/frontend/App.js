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
          {/* <SafeAreaView style={styles.container}> */}
            {/* <Text>Open up App.js to start working on your app!</Text> */}
            {/* <StatusBar style="auto" /> */}
          {/* </SafeAreaView> */}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'green',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default App;