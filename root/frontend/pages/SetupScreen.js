import { useEffect, useState } from "react";
import {
  Text,
  HStack,
  Button,
  VStack,
  Heading,
  Divider,
  HamburgerIcon,
} from "native-base";

export function WardrobeSettings({ route }) {
  return (
    <VStack>
      <Text>Wardrobe Settings</Text>
      <Button
        isDisabled={route.params.completed}
        onPress={() => route.params.complete()}
      >
        <Text>Complete</Text>
      </Button>
    </VStack>
  );
}
export function StyleQuiz({ route }) {
  return (
    <VStack>
      <Text>Style Quiz</Text>
      <Button
        isDisabled={route.params.completed}
        onPress={() => route.params.complete()}
      >
        <Text>Complete</Text>
      </Button>
    </VStack>
  );
}
export function Measurements({ navigation }) {
  return (
    <VStack>
      <Text>Measurements</Text>
      <Button>
        <Text>Complete</Text>
      </Button>
    </VStack>
  );
}

export function PrivacySettings({ navigation }) {
  return (
    <VStack>
      <Text>PrivacySettings</Text>
      <Button>
        <Text>Complete</Text>
      </Button>
    </VStack>
  );
}

export function SetupScreen({ navigation: { navigate }, route }) {
  // const firstName = props.user.firstName;

  const [completed, setCompleted] = useState({
    wardrobeSettings: false,
    styleQuiz: false,
  });

  function complete(name) {
    const temp = completed;
    temp[name] = true;
    setCompleted(temp);
  }

  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    console.log("key");
    var complete = true;
    Object.keys(completed).forEach((key) => {
      console.log(key + " " + completed[key]);
      if (!completed[key]) complete = false;
    });
    setSetupComplete(complete);
  });

  function finishSetup() {
    if (!setupComplete) return;
    route.params.finish();
    navigate("Media");
  }

  const firstName = "User";
  return (
    <VStack space={2} alignItems="center" flex={1} my={4}>
      <Heading size="xl">
        Welcome, {firstName == null ? "User" : firstName}
      </Heading>
      <Text>
        Thanks for signing up with Outfitter. Please complete the following
        quizzes to begin tracking your wardrobe.
      </Text>
      <Divider />
      <VStack my={5} justifyContent="space-evenly" flex={1}>
        <Button
          onPress={() => {
            navigate("Wardrobe Settings", {
              completed: completed["wardrobeSettings"],
              complete: () => {
                complete("wardrobeSettings");
                navigate("Setup");
              },
            });
          }}
          p={7}
        >
          <HStack space={3} alignItems="center">
            <HamburgerIcon color="white" />
            <Text bold color="white">
              Wardrobe Settings
            </Text>
          </HStack>
        </Button>
        <Button
          onPress={() => {
            navigate("Style Quiz", {
              completed: completed["styleQuiz"],
              complete: () => {
                complete("styleQuiz");
                navigate("Setup");
              },
            });
          }}
          p={7}
        >
          <HStack space={3} alignItems="center">
            <HamburgerIcon color="white" />
            <Text bold color="white">
              Style Quiz
            </Text>
          </HStack>
        </Button>
        <Button
          isDisabled={true}
          onPress={() => {
            navigate("Measurements", {
              completed: completed["measurements"],
              complete: () => complete("measurements"),
            });
          }}
          p={7}
        >
          <HStack space={3} alignItems="center">
            <HamburgerIcon color="white" />
            <Text bold color="white">
              Sizes / Measurements
            </Text>
          </HStack>
        </Button>
        <Button
          isDisabled={true}
          onPress={() => {
            navigate("Privacy Settings", {
              completed: completed["privacySettings"],
              complete: () => complete("privacySettings"),
            });
          }}
          p={7}
        >
          <HStack space={3} alignItems="center">
            <HamburgerIcon color="white" />
            <Text bold color="white">
              Privacy Settings
            </Text>
          </HStack>
        </Button>
      </VStack>
      <Divider />
      <Button
        isDisabled={!setupComplete}
        onPress={() => {
          finishSetup();
        }}
      >
        <Text>Finish</Text>
      </Button>
    </VStack>
  );
}
