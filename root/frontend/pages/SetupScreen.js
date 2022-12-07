//https://theconceptwardrobe.com/build-a-wardrobe/pear-body-shape for outfit sugesstions based off body type
import {
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  Divider,
  HamburgerIcon,
  Heading,
  HStack,
  Image,
  Input,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";
import { useAuth } from "../contexts/Auth";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export function WardrobeSettings({ route }) {
  const { gender } = route.params;
  const [mens, setMens] = useState(gender.includes("mens"));
  const [womens, setWomens] = useState(gender.includes("womens"));

  const getList = () => {
    let list = [];
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
                alt="Men's"
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
                alt="Women's"
              />
            </VStack>
          </Button>
        </HStack>
        <Button
          isDisabled={!(mens || womens)}
          onPress={() => route.params.complete(getList())}
        >
          Submit
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
      <Button onPress={() => complete(styles)}>Submit</Button>
    </VStack>
  );
}

//TODO make suggestions better and add suggestions for men and differentiate them
export function BodyShape({ navigation }) {
  const [shape, setShape] = useState();
  const shapes = [
    {
      name: "Inverted Triangle",
      aliases: ["Apple"],
      male_image: require("../assets/bodytypes/men_inverted_triangle.png"),
      female_image: require("../assets/bodytypes/women_inverted_triangle.png"),
      description:
        "People with an inverted triangle body shape have shoulders and a bust that are wider than their hips.",
      suggestions:
        "Fitted but not waist defined dresses. A-line dresses and skirts. Straight and cigarette-style pants. U or V necklines.",
      female_suggestions:
        "Fitted but not waist defined dresses. A-line dresses and skirts. Straight and cigarette-style pants. U or V necklines.",
      male_suggestions:
        "Looser t-shirts, wide cargo shorts or pants, loose fitting jeans",
    },
    {
      name: "Rectangle",
      aliases: ["Straight,", "Banana"],
      male_image: require("../assets/bodytypes/men_rectangle.png"),
      female_image: require("../assets/bodytypes/women_rectangle.png"),
      description:
        "People with a rectangle body shape have a waist measurement that is roughly the same as their hips or shoulders.",
      suggestions:
        "Wide V, slash, or scoop neckline. Turtlenecks, crew, funnel, flared longsleeve, button-down, ruffleand halter tops. Off-the-shoulder tops, tube dresses, and belted waists. Double breasted, belted, and straight jackets. Trench coats and peacoats. Wide and cargo pants.",
      subtypes: [
        {
          name: "Athletic",
          description:
            "The athletic body type is similar to the rectangle body type in that the shoulder and hip measurements are roughly the same, however athletic body types are generally more muscular and tend to have a waist that is narrower than the hips and shoulders.",
          suggestions:
            "halter, strapless, and racerback styles. Wear wrap and flared dresses to add volume. Plunging necklines, U or V neck, or tube dresses are great options as well.",
        },
      ],
    },
    {
      name: "Pear",
      aliases: ["Triangle"],
      male_image: require("../assets/bodytypes/men_pear.png"),
      female_image: require("../assets/bodytypes/women_pear.png"),
      description:
        "People with a pear body shape have hips that are wider than both their shoulders and waist.",
      suggestions:
        "You’ve got a heavier bottom half of your bod if this is you. If you aren’t in love with this, define your waist with tucked shirts or dresses with a defined waist seam. If you prefer not to define your waist, statement necklaces or hairdos are a great way to draw the eye up and make your body look longer! Wear stripes, ruffle, or crop tops. Wear a cropped denim or long blazer jacket. A-Line and Trench coats are great options for colder temperatures.",
      subtypes: [
        {
          name: "Diamond",
          description:
            "Similar to the pear body shape, the diamond body shape has broader hips than shoulders. However, the diamond body shape has a narrow bust and a fuller midsection.",
          suggestions: "Flowy off-the-shoulder or boat-neck tops",
        },
        {
          name: "Spoon",
          description:
            "Similar to the pear body shape, however the hips are larger than the bust.",
          suggestions:
            "classic “baby doll” cuts or other items with an empire waist",
        },
      ],
    },
    {
      name: "Hourglass",
      male_image: require("../assets/bodytypes/men_hourglass.png"),
      female_image: require("../assets/bodytypes/women_hourglass.png"),
      description:
        "People with an hourglass body shape have a waist measurement that is smaller than their hips and shoulders. Their hips and shoulders are usually roughly the same width.",
      subtypes: [
        {
          name: "Top Hourglass",
          description:
            "Top hourglass body shapes are similar to general hourglass shapes, but have slightly larger bust measurements than their hips.",
          suggestions:
            "Boot cut or slightly flared pants probably fit you well, as do full or A-line skirts and tailored jackets.",
        },
        {
          name: "Bottom Hourglass",
          description:
            "Top hourglass body shapes are similar to general hourglass shapes, but have slightly larger hip measurements than their bust.",
          suggestions: "form-fitting knits and dresses",
        },
      ],
      suggestions:
        "Form-fitting or tailored clothing. Your waist is already there, but it’s up to you if you want to define it or not! If you want to define it, follow the advice for rectangles and pears. Thinner hourglasses might want to add volume to their bottom half with full skirts or dresses while a more curvy hourglass may want to go with a form fitting bottom option. Wear peplum, belted, or fitted shirts. Short, fitted leather, belted cardigan, or fitted blazers are great jacket options. Trench, coachman, wrap, or A-Line coats are great for colder temperatures. Wear slim, wide, straight, flared, or bootcut pants.",
    },
    {
      name: "Round",
      aliases: ["Oval"],
      male_image: require("../assets/bodytypes/men_apple.png"),
      female_image: require("../assets/bodytypes/women_apple.png"),
      description:
        "Round body types have a large bust, narrow hips, and a fuller midsection.",
      suggestions: "tops that flare at the top or that have vertical details.",
    },
  ];

  return (
    <ScrollView>
      <VStack space={3} paddingTop={4} paddingBottom={4} mx={4}>
        <View>
          <Heading>What is Body Shape?</Heading>
          <Text>
            Bodies come in different all shapes and sizes, yet most people fit
            into a few broad categories. The way we dress can help flatter our
            body shape, so many people find it important to determine theirs so
            that they can dress accordingly.
          </Text>
        </View>
        <Heading>Determining Your Body Shape</Heading>
        <Text>
          Body shapes can be catergorized by the width of your shoulders, bust,
          waist, and hips.
        </Text>

        <View>
          <VStack space={4}>
            {shapes.map((content) => {
              return (
                <Box backgroundColor="blue.100" borderRadius="lg" shadow={4}>
                  <VStack space="1" padding="2" mx="2">
                    <Heading size="md">{content.name}</Heading>
                    {content.aliases && (
                      <Text italic={true}>
                        Also known as{content.aliases.map((a) => " " + a)}
                      </Text>
                    )}
                    <VStack space="4">
                      <HStack
                        backgroundColor="white"
                        justifyContent="space-evenly"
                        borderRadius="lg"
                      >
                        <Image source={content.female_image} />
                        <Image source={content.male_image} />
                      </HStack>
                      <Text>{content.description}</Text>
                      {content.subtypes &&
                        content.subtypes.map((subtype) => {
                          return (
                            <Box
                              backgroundColor="blue.200"
                              shadow={2}
                              borderRadius="lg"
                            >
                              <VStack padding={4} paddingBottom={0}>
                                <Heading size="sm">{subtype.name}</Heading>
                                <Text>{subtype.description}</Text>
                              </VStack>
                            </Box>
                          );
                        })}
                      <Center paddingTop="2" paddingBottom="2">
                        <Button>Select</Button>
                      </Center>
                    </VStack>
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        </View>
      </VStack>
    </ScrollView>
  );
}

export function PrivacySettings({ navigation }) {
  return (
    <VStack>
      <Text>PrivacySettings</Text>
      <Button>Complete</Button>
    </VStack>
  );
}

export function SetupScreen({ navigation: { navigate }, route }) {
  const { user, refreshUser } = useAuth();

  const [styles, setStyles] = useState([]);
  const [gender, setGender] = useState([]);
  const [bodyShape, setBodyShape] = useState([]);

  const [completed, setCompleted] = useState({
    wardrobeSettings: false,
    styleQuiz: false,
    bodyShape: true,
  });

  function complete(name) {
    const temp = completed;
    temp[name] = true;
    setCompleted(temp);
  }

  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    console.log("key");
    let complete = true;
    Object.keys(completed).forEach((key) => {
      console.log(key + " " + completed[key]);
      if (!completed[key]) complete = false;
    });
    setSetupComplete(complete);
  });

  async function finishSetup() {
    if (!setupComplete) return;
    let finished = await route.params.finish({
      styles: styles,
      gender: gender,
    });
    if (finished) {
      refreshUser();
    }
  }

  return (
    <VStack paddingTop={4} space={2} alignItems="center" flex={1} my={4}>
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
          onPress={() => {
            navigate("Body Shape", {
              completed: completed["bodyshape"],
              complete: () => complete("bodyshape"),
            });
          }}
          p={7}
        >
          <HStack space={3} alignItems="center">
            <HamburgerIcon color="white" />
            <Text bold color="white">
              Body Shape
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
        Finish
      </Button>
    </VStack>
  );
}
