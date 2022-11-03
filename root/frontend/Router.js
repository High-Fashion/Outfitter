import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Text, HamburgerIcon, Pressable, Center } from "native-base";

import SignUpScreen from "./pages/SignUpScreen.js";
import SignInScreen from "./pages/SignInScreen.js";
import HomeScreen from "./pages/HomeScreen.js";

import { useAuth } from "./contexts/Auth";
import { useEffect } from "react";

function Loading() {
  return (
    <Center>
      <Text>Loading</Text>
    </Center>
  );
}

function AuthStack(props) {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
      <Stack.Screen name="Sign In" component={SignInScreen} />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  const Stack = createNativeStackNavigator();
  const { loadUser } = useAuth();
  useEffect(() => {
    loadUser;
  }, []);
  return (
    <Stack.Navigator>
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
          },
          headerLeft: () => <></>,
          headerRight: () => (
            <Pressable>
              <HamburgerIcon size="md" color="white" />
            </Pressable>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default function Router() {
  const { signedIn, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {signedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
