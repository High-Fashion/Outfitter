import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Text, HamburgerIcon, Pressable, Center } from "native-base";

import SignUpScreen from "./pages/SignUpScreen.js";
import SignInScreen from "./pages/SignInScreen.js";
import HomeScreen from "./pages/HomeScreen.js";
import * as SplashScreen from "expo-splash-screen";

import {
  BodyShape,
  SetupScreen,
  WardrobeSettings,
  PrivacySettings,
  StyleQuiz,
} from "./pages/SetupScreen.js";

import { useAuth } from "./contexts/Auth";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "./utils/axiosInstance";
import config from "./config";

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
    <Stack.Navigator>
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
        name="Body Shape"
        component={BodyShape}
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
    </Stack.Navigator>
  );
}

function AppStack(props) {
  const Stack = createNativeStackNavigator();

  const { user, signOut } = useAuth();
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
          },
          headerLeft: () => <></>,
          headerRight: () => (
            <Pressable>
              <HamburgerIcon
                size="md"
                color="white"
                onPress={() => signOut()}
              />
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
  const { signedIn, refreshUser, getTokens } = useAuth();

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        const keys = await getTokens();
        await new Promise(async (resolve) => {
          if (!keys) {
            resolve();
            return;
          }
          var bool = await refreshUser();
          resolve();
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      {signedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
