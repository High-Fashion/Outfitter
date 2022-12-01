import React, { useState, useEffect } from "react";
import {
  Button,
  VStack,
  Text,
  Image,
  Center,
  View,
  Box,
  HStack,
  Icon,
} from "native-base";
import { HeaderBackButton } from "@react-navigation/elements";
import capitalize from "../utils/capitalize";
import { Dimensions, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const IMAGE_HEIGHT = 400;

const styles = StyleSheet.create({
  image: {
    whole: {},
    head: {
      resizeMode: "cover",
      maxHeight: IMAGE_HEIGHT,
    },
    torso: (armFocus) => ({
      height: armFocus ? 1200 : 800,
      width: armFocus ? 600 : 400,
      top: armFocus ? 40 : 100,
      right:
        armFocus && (armFocus == "left" || armFocus == "right")
          ? 120 * (armFocus == "right" ? 1 : -1)
          : 0,
    }),
    legs: {
      resizeMode: "stretch",
      height: 800,
      width: 400,
      bottom: 150,
    },
    hand: (armFocus) => ({
      resizeMode: "contain",
      transform: [
        { scaleX: (armFocus == "right" ? -1 : 1) * 0.8 },
        { scaleY: 0.8 },
      ],
    }),
  },
  container: {
    whole: {},
    head: {},
    torso: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      height: 400,
      overflow: "hidden",
    },
    legs: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      height: 400,
      overflow: "hidden",
    },
  },
  button_container: {
    thumb: {
      position: "absolute",
      left: (width * 3.75) / 5,
      top: 0.45 * IMAGE_HEIGHT,
      transform: [{ rotateZ: "-58deg" }, { scaleX: 5 }, { scaleY: 2.2 }],
    },
    index: {
      alignItems: "center",
      position: "absolute",
      left: (width * 2.55) / 5,
      top: IMAGE_HEIGHT * 0.225,
      transform: [{ rotateZ: "90deg" }, { scaleX: 6 }, { scaleY: 1.9 }],
    },
    middle: {
      position: "absolute",
      left: (width * 1.875) / 5,
      top: IMAGE_HEIGHT * 0.225,
      transform: [{ rotateZ: "78deg" }, { scaleX: 6 }, { scaleY: 1.9 }],
    },
    ring: {
      position: "absolute",
      left: (width * 1.3) / 5,
      top: IMAGE_HEIGHT * 0.275,
      transform: [{ rotateZ: "65deg" }, { scaleX: 5.5 }, { scaleY: 1.9 }],
    },
    pinky: {
      position: "absolute",
      left: (width * 0.9) / 5,
      top: IMAGE_HEIGHT * 0.465,
      transform: [{ rotateZ: "45deg" }, { scaleX: 5 }, { scaleY: 1.9 }],
    },
  },
});

const imageCache = {
  head: require("../assets/men_head.png"),
  whole: require("../assets/bodytypes/men_inverted_triangle.png"),
  hand: require("../assets/hand.png"),
};

function ModelImage(props) {
  const { focus, armFocus, handFocus } = props;
  return (
    <View>
      <View style={styles.container[focus]}>
        {focus == "whole" && (
          <Image
            alt="image missing"
            style={styles.image.whole}
            source={imageCache.whole}
          />
        )}
        {focus == "head" && (
          <Image
            alt="image missing"
            style={styles.image.head}
            source={imageCache.head}
          />
        )}
        {focus == "torso" && !handFocus && (
          <Image
            alt="image missing"
            style={styles.image.torso(armFocus)}
            source={imageCache.whole}
          />
        )}
        {focus == "torso" && handFocus && (
          <Image
            alt="image missing"
            style={styles.image.hand(armFocus)}
            source={imageCache.hand}
          />
        )}
        {focus == "legs" && (
          <Image
            alt="image missing"
            style={styles.image[focus]}
            source={imageCache.whole}
          />
        )}
      </View>
    </View>
  );
}

function ModelButtons(props) {
  const {
    focus,
    setFocus,
    armFocus,
    handFocus,
    setHandFocus,
    setArmFocus,
    setSlot,
  } = props;

  const WholeButtons = () => (
    <Box
      height="100%"
      width="30%"
      zIndex={1}
      position="absolute"
      paddingTop="6"
      paddingBottom="6"
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        width="40%"
        onPress={() => setFocus("head")}
        flex={1}
        borderRadius="full"
        variant="unstyled"
      >
        <View bgColor={"white"} borderRadius="full">
          <Icon as={AntDesign} name="pluscircle" size="lg" color="indigo.400" />
        </View>
      </Button>
      <HStack flex={3} justifyContent="space-between">
        <Button
          variant="unstyled"
          flex={1}
          onPress={() => {
            setFocus("torso");
            setArmFocus("left");
          }}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
        <Button variant="unstyled" flex={5} onPress={() => setFocus("torso")}>
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
        <Button
          variant="unstyled"
          flex={1}
          onPress={() => {
            setFocus("torso");
            setArmFocus("right");
          }}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
      </HStack>
      <Button
        width="50%"
        flex={4}
        onPress={() => setFocus("legs")}
        variant="unstyled"
      >
        <View bgColor={"white"} borderRadius="full">
          <Icon as={AntDesign} name="pluscircle" size="lg" color="indigo.400" />
        </View>
      </Button>
    </Box>
  );
  const HeadButtons = () => (
    <VStack
      height="80%"
      zIndex={2}
      position="absolute"
      paddingTop="5"
      paddingBottom="3"
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        variant="unstyled"
        width="60%"
        flex={8}
        onPress={() => setSlot("head")}
      >
        <View bgColor={"white"} borderRadius="full">
          <Icon as={AntDesign} name="pluscircle" size="lg" color="indigo.400" />
        </View>
      </Button>

      <HStack justifyContent="space-between" width="70%" flex={6}>
        <Button flex={1} variant="unstyled" onPress={() => setSlot("eyes")}>
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
      </HStack>
      <HStack justifyContent="space-between" width="65%" flex={8}>
        <Button flex={1} variant="unstyled" onPress={() => setSlot("left ear")}>
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
        <Button flex={1} variant="ghost"></Button>
        <Button flex={5} variant="unstyled" onPress={() => setSlot("nose")}>
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
        <Button flex={1} variant="ghost"></Button>
        <Button
          flex={1}
          variant="unstyled"
          onPress={() => setSlot("right ear")}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
      </HStack>
      <Button
        width="55%"
        variant="unstyled"
        flex={4}
        onPress={() => setSlot("mouth")}
      >
        <View bgColor={"white"} borderRadius="full">
          <Icon as={AntDesign} name="pluscircle" size="lg" color="indigo.400" />
        </View>
      </Button>
      <Button
        width="50%"
        variant="unstyled"
        flex={8}
        onPress={() => setSlot("neck")}
      >
        <View bgColor={"white"} borderRadius="full">
          <Icon as={AntDesign} name="pluscircle" size="lg" color="indigo.400" />
        </View>
      </Button>
    </VStack>
  );
  const TorsoButtons = () => (
    <VStack
      height="100%"
      width="50%"
      zIndex={2}
      position="absolute"
      paddingBottom="3"
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack flex={1}>
        <Button flex={1} variant="unstyled" onPress={() => setFocus("head")}>
          <View bgColor={"white"} borderRadius="full">
            <Icon as={AntDesign} name="upcircle" size="md" color="indigo.400" />
          </View>
        </Button>
      </HStack>
      <HStack flex={4} justifyContent="space-between">
        <Button
          flex={1}
          variant="unstyled"
          onPress={() => {
            setFocus("torso");
            setArmFocus("left");
          }}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="leftcircle"
              size="md"
              color="indigo.400"
            />
          </View>
        </Button>
        <VStack flex={3}>
          <Button flex={3} variant="unstyled" onPress={() => setSlot("torso")}>
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="sm"
              color="indigo.400"
            />
          </Button>
          <Button
            flex={1}
            variant="unstyled"
            onPress={() => {
              setFocus("legs");
            }}
          >
            <View bgColor={"white"} borderRadius="full">
              <Icon
                as={AntDesign}
                name="downcircle"
                size="md"
                color="indigo.400"
              />
            </View>
          </Button>
        </VStack>
        <Button
          flex={1}
          variant="unstyled"
          onPress={() => {
            setFocus("torso");
            setArmFocus("right");
          }}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="rightcircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
      </HStack>
    </VStack>
  );
  const ArmButtons = () => (
    <VStack
      height="100%"
      width="50%"
      zIndex={2}
      position="absolute"
      paddingBottom="15%"
      justifyContent="space-between"
      alignItems="center"
    >
      <VStack>
        <Button
          flex={3}
          variant="unstyled"
          onPress={() => setSlot(armFocus + " upper arm")}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
        <Button
          flex={4}
          variant="unstyled"
          onPress={() => setSlot(armFocus + " forearm")}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
        <Button
          flex={1}
          variant="unstyled"
          onPress={() => {
            setSlot(armFocus + " wrist");
          }}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
        <Button
          flex={3}
          variant="unstyled"
          onPress={() => {
            setHandFocus(true);
          }}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
      </VStack>
    </VStack>
  );
  const LegButtons = () => (
    <VStack
      height="100%"
      zIndex={2}
      position="absolute"
      paddingTop="2"
      paddingBottom="3"
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        variant="unstyled"
        width="60%"
        flex={1}
        onPress={() => setSlot("waist")}
      >
        <View bgColor={"white"} borderRadius="full">
          <Icon as={AntDesign} name="pluscircle" size="lg" color="indigo.400" />
        </View>
      </Button>
      <Button
        width="55%"
        variant="unstyled"
        flex={1}
        onPress={() => setSlot("hips")}
      >
        <View bgColor={"white"} borderRadius="full">
          <Icon as={AntDesign} name="pluscircle" size="lg" color="indigo.400" />
        </View>
      </Button>
      <Button
        width="50%"
        variant="unstyled"
        flex={8}
        onPress={() => setSlot("legs")}
      >
        <View bgColor={"white"} borderRadius="full">
          <Icon as={AntDesign} name="pluscircle" size="lg" color="indigo.400" />
        </View>
      </Button>
      <HStack justifyContent="space-between" width="50%" flex={1}>
        <Button
          flex={1}
          variant="unstyled"
          onPress={() => setSlot("left ankle")}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
        <Button
          flex={1}
          variant="unstyled"
          onPress={() => setSlot("right ankle")}
        >
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
      </HStack>
      <HStack flex={2} width="50%" justifyContent="space-between">
        <Button flex={1} variant="unstyled" onPress={() => setSlot("feet")}>
          <View bgColor={"white"} borderRadius="full">
            <Icon
              as={AntDesign}
              name="pluscircle"
              size="lg"
              color="indigo.400"
            />
          </View>
        </Button>
      </HStack>
    </VStack>
  );
  const HandButtons = () => (
    <View
      style={{
        width: "100%",
        position: "absolute",
        zIndex: 2,
        transform: [{ rotateY: armFocus == "right" ? "180deg" : "0deg" }],
      }}
    >
      <View style={styles.button_container.thumb}>
        <Button variant="ghost" onPress={() => setSlot("thumb")}></Button>
      </View>
      <View style={styles.button_container.index}>
        <Button variant="ghost" onPress={() => setSlot("index")}></Button>
      </View>
      <View style={styles.button_container.middle}>
        <Button variant="ghost" onPress={() => setSlot("middle")}></Button>
      </View>

      <View style={styles.button_container.ring}>
        <Button variant="ghost" onPress={() => setSlot("ring")}></Button>
      </View>
      <View style={styles.button_container.pinky}>
        <Button variant="ghost" onPress={() => setSlot("pinky")}></Button>
      </View>
    </View>
  );

  if (focus == "whole") return <WholeButtons />;
  if (focus == "head") return <HeadButtons />;
  if (focus == "torso")
    return armFocus ? (
      handFocus ? (
        <HandButtons />
      ) : (
        <ArmButtons />
      )
    ) : (
      <TorsoButtons />
    );
  if (focus == "legs") return <LegButtons />;
}

export default function Model(props) {
  const [focus, setFocus] = useState("whole");
  const [armFocus, setArmFocus] = useState();
  const [handFocus, setHandFocus] = useState(false);

  const goBack = () => {
    if (handFocus) {
      setHandFocus(false);
      return;
    }
    if (armFocus) {
      setArmFocus(undefined);
      return;
    }
    setFocus("whole");
  };

  useEffect(() => {
    if (focus != "torso") setArmFocus(undefined);
    if (focus != "whole") {
      props.navigation.setOptions({
        headerLeft: () => <HeaderBackButton onPress={goBack} />,
        headerTitle: armFocus
          ? capitalize(focus) +
            " > " +
            capitalize(armFocus) +
            " Arm" +
            (handFocus ? " > " + "Hand" : "")
          : focus.charAt(0).toUpperCase() + focus.slice(1),
      });
    } else {
      props.navigation.setOptions({
        headerLeft: () => (
          <HeaderBackButton onPress={() => props.navigation.goBack()} />
        ),
        headerTitle: "New Outfit",
      });
    }
  }, [focus, armFocus, handFocus]);

  return (
    <Center>
      <VStack alignItems="center">
        <ModelImage focus={focus} armFocus={armFocus} handFocus={handFocus} />
        <ModelButtons
          focus={focus}
          setFocus={setFocus}
          armFocus={armFocus}
          handFocus={handFocus}
          setArmFocus={setArmFocus}
          setHandFocus={setHandFocus}
          setSlot={props.setSlot}
        />
      </VStack>
    </Center>
  );
}
