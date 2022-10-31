import { useEffect, useState } from "react";
import {
  Text,
  HStack,
  Button,
  VStack,
  Heading,
  Divider,
  HamburgerIcon,
  Image,
  View,
  ScrollView,
  Badge,
  Input,
  DeleteIcon,
  CloseIcon,
} from "native-base";
import { useAuth } from "../contexts/Auth";

export function WardrobeSettings({ route }) {
  const { gender } = route.params;
  const [mens, setMens] = useState(gender.includes("mens"));
  const [womens, setWomens] = useState(gender.includes("womens"));

  const getList = () => {
    var list = [];
    if (mens) list.push("mens");
    if (womens) list.push("womens");
    return list;
  };

  return (
    <ScrollView>
      <VStack
        mx={2}
        paddingTop={2}
        alignItems="center"
        space={2}
        paddingBottom={2}
      >
        <Text>What clothes do you wear? </Text>
        <HStack space={2}>
          <Button
            flex={1}
            variant={mens ? "solid" : "outline"}
            onPress={() => {
              setMens(!mens);
            }}
          >
            <VStack alignItems="center">
              <Text>Mens</Text>
              <Image
                height="200"
                resizeMode="contain"
                source={require("../assets/mens.png")}
              />
            </VStack>
          </Button>
          <Button
            flex={1}
            variant={womens ? "solid" : "outline"}
            onPress={() => {
              setWomens(!womens);
            }}
          >
            <VStack alignItems="center">
              <Text>Womens</Text>
              <Image
                height="200"
                resizeMode="contain"
                source={require("../assets/womens.png")}
              />
            </VStack>
          </Button>
        </HStack>
        <Button
          isDisabled={!(mens || womens)}
          onPress={() => route.params.complete(getList())}
        >
          <Text>Submit</Text>
        </Button>
      </VStack>
    </ScrollView>
  );
}

function StyleTag(props) {
  return (
    <Badge
      _text={{ fontSize: "lg" }}
      rightIcon={
        <Button
          borderRadius="full"
          onPress={() => props.remove()}
          variant="ghost"
        >
          <CloseIcon color="black" />
        </Button>
      }
      variant="subtle"
      colorScheme="info"
      key={props.style}
    >
      {props.style}
    </Badge>
  );
}

export function StyleQuiz({ route }) {
  const { complete } = route.params;
  const [styles, setStyles] = useState(route.params.styles);
  const [currentInput, setInput] = useState();

  const updateValue = (text) => {
    if (!text.includes("\n")) {
      setInput(text);
      return;
    }
    if (text == "\n") {
      setInput("");
      return;
    }
    setInput("");
    if (!styles.includes(text.replace(/(\r\n|\n|\r)/gm, "")))
      setStyles([...styles, text.replace(/(\r\n|\n|\r)/gm, "")]);
  };

  const removeStyle = (style) => {
    setStyles(
      styles.filter((value) => {
        return value != style;
      })
    );
  };

  return (
    <VStack alignItems="center" space={3}>
      <Text>How would you describe your style?</Text>
      <HStack space={1}>
        {styles.map((style) => (
          <StyleTag style={style} remove={() => removeStyle(style)} />
        ))}
      </HStack>
      <Input
        multiline={true}
        placeholder="Input style tags"
        value={currentInput}
        onChangeText={(text) => updateValue(text)}
      />
      <Button onPress={() => complete(styles)}>
        <Text>Submit</Text>
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
  const { user } = useAuth();

  const [styles, setStyles] = useState([]);
  const [gender, setGender] = useState([]);

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

  async function finishSetup() {
    if (!setupComplete) return;
    var finished = await route.params.finish({
      styles: styles,
      gender: gender,
    });
    if (finished) {
      navigate("Media");
    }
  }

  return (
    <VStack space={2} alignItems="center" flex={1} my={4}>
      <Heading size="xl">
        Welcome, {user.firstName == null ? "User" : user.firstName}
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
              gender: gender,
              complete: (data) => {
                setGender(data);
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
              styles: styles,
              complete: (data) => {
                setStyles(data);
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
