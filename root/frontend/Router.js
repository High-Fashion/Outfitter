import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Text, HamburgerIcon, Pressable, Center } from "native-base";

import SignUpScreen from "./pages/SignUpScreen.js";
import SignInScreen from "./pages/SignInScreen.js";
import HomeScreen from "./pages/HomeScreen.js";

import {
  Measurements,
  SetupScreen,
  WardrobeSettings,
  PrivacySettings,
  StyleQuiz,
} from "./pages/SetupScreen.js";

import { useAuth } from "./contexts/Auth";
import { useEffect, useState } from "react";

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

function SetupStack(props) {
  const Stack = createNativeStackNavigator();

  const finishSetup = async (data) => {
    const response = await axiosInstance.post(
      config.API_URL + "/wardrobe/create",
      data
    );
    if (response.status == 200) {
      return true;
    }
  };

  return (
    <Stack.Group>
      <Stack.Screen
        name="Setup"
        component={SetupScreen}
        initialParams={{ finish: (data) => finishSetup(data) }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Wardrobe Settings"
        component={WardrobeSettings}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Measurements"
        component={Measurements}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Style Quiz"
        component={StyleQuiz}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Privacy Settings"
        component={PrivacySettings}
        options={{ headerShown: true }}
      />
    </Stack.Group>
  );
}

function AppStack(props) {
  const Stack = createNativeStackNavigator();

  const { user } = useAuth();
  const [isSetup, setIsSetup] = useState(user.wardrobe != null);

  useEffect(() => {
    if (user.wardrobe != null) {
      setIsSetup(true);
    }
  }, [user]);

  return isSetup ? (
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
    </Stack.Navigator>
  ) : (
    <SetupStack />
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
