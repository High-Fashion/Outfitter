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

const signedIn = false;

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
                title: "Outfitter",
                headerTitleAlign: "center",
                headerStyle: {
                  backgroundColor: "#1e40af",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontFamily: "sans-serif-medium",
                },
                headerLeft: () => <></>,
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
