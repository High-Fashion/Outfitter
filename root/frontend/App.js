import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Button,
  NativeBaseProvider,
  View,
  Text,
  HamburgerIcon,
  Pressable,
} from "native-base";

import React from "react";
import HomeScreen from "./pages/HomeScreen.js";
import SignUpScreen from "./pages/SignUpScreen.js";
import SignInScreen from "./pages/SignInScreen.js";

const Stack = createNativeStackNavigator();

const signedIn = true;

function HomeHeader(props) {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
}

export default function App() {
  const initialRoute = signedIn ? "Home" : "SignUp";
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Group>
            <Stack.Screen name="Sign Up" component={SignUpScreen} />
            <Stack.Screen name="Sign In" component={SignInScreen} />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Home",
                headerTitleAlign: "center",
                headerStyle: {
                  backgroundColor: "#f4511e",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerRight: () => (
                  <Pressable>
                    <HamburgerIcon size="md" color="white" />
                  </Pressable>
                ),
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
