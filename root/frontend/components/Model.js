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
} from "native-base";
import { HeaderBackButton } from "@react-navigation/elements";
import capitalize from "../utils/capitalize";

function ModelImage(props) {
  const { focus, armFocus } = props;
  return (
    <View>
      {focus == "whole" && (
        <Image
          source={require("../assets/bodytypes/men_inverted_triangle.png")}
        />
      )}
      {focus == "head" && (
        <Image
          resizeMode="cover"
          maxHeight="400"
          source={require("../assets/men_head.png")}
        />
      )}
      {focus == "torso" && (
        <View
          borderColor="black"
          borderWidth="2"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: 400,
            overflow: "hidden",
          }}
        >
          <Image
            style={{
              height: armFocus ? 1200 : 800,
              width: armFocus ? 600 : 400,
              top: armFocus ? 40 : 100,
              right:
                armFocus && (armFocus == "left" || armFocus == "right")
                  ? 120 * (armFocus == "right" ? 1 : -1)
                  : 0,
            }}
            source={require("../assets/bodytypes/men_inverted_triangle.png")}
          />
        </View>
      )}
      {focus == "legs" && (
        <View
          borderColor="black"
          borderWidth="2"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: 400,
            overflow: "hidden",
          }}
        >
          <Image
            style={{
              resizeMode: "stretch",
              height: 800,
              width: 400,
              bottom: 150,
            }}
            source={require("../assets/bodytypes/men_inverted_triangle.png")}
          />
        </View>
      )}
    </View>
  );
}

function ModelButtons(props) {
  const { focus, setFocus, armFocus, setArmFocus, setSlot } = props;

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
        variant="outline"
      ></Button>
      <HStack flex={3} justifyContent="space-between">
        <Button
          variant="outline"
          flex={1}
          onPress={() => {
            setFocus("torso");
            setArmFocus("left");
          }}
        ></Button>
        <Button
          variant="outline"
          flex={5}
          onPress={() => setFocus("torso")}
        ></Button>
        <Button
          variant="outline"
          flex={1}
          onPress={() => {
            setFocus("torso");
            setArmFocus("right");
          }}
        ></Button>
      </HStack>
      <Button
        width="50%"
        flex={4}
        onPress={() => setFocus("legs")}
        variant="outline"
      ></Button>
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
        variant="outline"
        width="60%"
        flex={8}
        onPress={() => setSlot("hat")}
      >
        <Text>Hat</Text>
      </Button>

      <HStack justifyContent="space-between" width="70%" flex={6}>
        <Button flex={1} variant="outline" onPress={() => setSlot("eyes")}>
          <Text>Eyes</Text>
        </Button>
      </HStack>
      <HStack justifyContent="space-between" width="65%" flex={8}>
        <Button flex={1} variant="outline" onPress={() => setSlot("left ear")}>
          <Text>LE</Text>
        </Button>
        <Button flex={1} variant="ghost"></Button>
        <Button flex={5} variant="outline" onPress={() => setSlot("nose")}>
          <Text>Nose</Text>
        </Button>
        <Button flex={1} variant="ghost"></Button>
        <Button flex={1} variant="outline" onPress={() => setSlot("right ear")}>
          <Text>RE</Text>
        </Button>
      </HStack>
      <Button
        width="55%"
        variant="outline"
        flex={4}
        onPress={() => setSlot("mouth")}
      >
        <Text>Mouth</Text>
      </Button>
      <Button
        width="50%"
        variant="outline"
        flex={8}
        onPress={() => setSlot("neck")}
      >
        <Text>Neck</Text>
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
        <Button flex={1} variant="outline" onPress={() => setFocus("head")}>
          <Text>Head</Text>
        </Button>
      </HStack>
      <HStack flex={4} justifyContent="space-between">
        <Button
          flex={1}
          variant="outline"
          onPress={() => {
            setFocus("torso");
            setArmFocus("left");
          }}
        >
          <Text>Left Arm</Text>
        </Button>
        <VStack flex={3}>
          <Button flex={3} variant="outline" onPress={() => setSlot("torso")}>
            <Text>Top</Text>
          </Button>
          <Button
            flex={1}
            variant="outline"
            onPress={() => {
              setFocus("legs");
            }}
          >
            <Text>Legs</Text>
          </Button>
        </VStack>
        <Button
          flex={1}
          variant="outline"
          onPress={() => {
            setFocus("torso");
            setArmFocus("right");
          }}
        >
          <Text>Right Arm</Text>
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
          variant="outline"
          onPress={() => setSlot(armFocus + " upper arm")}
        >
          <Text>Upper</Text>
        </Button>
        <Button
          flex={4}
          variant="outline"
          onPress={() => setSlot(armFocus + " forearm")}
        >
          <Text>Forearm</Text>
        </Button>
        <Button
          flex={1}
          variant="outline"
          onPress={() => {
            setSlot(armFocus + " wrist");
          }}
        >
          <Text>Wrist</Text>
        </Button>
        <Button
          flex={3}
          variant="outline"
          onPress={() => {
            setSlot(armFocus + " hand");
          }}
        >
          <Text>Hand</Text>
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
        variant="outline"
        width="60%"
        flex={1}
        onPress={() => setSlot("waist")}
      >
        <Text>Waist</Text>
      </Button>
      <Button
        width="55%"
        variant="outline"
        flex={1}
        onPress={() => setSlot("hips")}
      >
        <Text>Hips</Text>
      </Button>
      <Button
        width="50%"
        variant="outline"
        flex={8}
        onPress={() => setSlot("pants")}
      >
        <Text>Pants</Text>
      </Button>
      <HStack justifyContent="space-between" width="50%" flex={1}>
        <Button
          flex={1}
          variant="outline"
          onPress={() => setSlot("left ankle")}
        >
          <Text>Left Ankle</Text>
        </Button>
        <Button
          flex={1}
          variant="outline"
          onPress={() => setSlot("right ankle")}
        >
          <Text>Right Ankle</Text>
        </Button>
      </HStack>
      <HStack flex={2}>
        <Button variant="outline" onPress={() => setSlot("left foot")}>
          <Text>Left Foot</Text>
        </Button>
        <Button variant="outline" onPress={() => setSlot("right foot")}>
          <Text>Right Foot</Text>
        </Button>
      </HStack>
    </VStack>
  );

  if (focus == "whole") return <WholeButtons />;
  if (focus == "head") return <HeadButtons />;
  if (focus == "torso") return armFocus ? <ArmButtons /> : <TorsoButtons />;
  if (focus == "legs") return <LegButtons />;
}

export default function Model(props) {
  const [focus, setFocus] = useState("whole");
  const [armFocus, setArmFocus] = useState();

  useEffect(() => {
    if (focus != "torso") setArmFocus(undefined);
    if (focus != "whole") {
      props.navigation.setOptions({
        headerLeft: () => (
          <HeaderBackButton onPress={() => setFocus("whole")} />
        ),
        headerTitle: armFocus
          ? capitalize(focus) + " > " + capitalize(armFocus) + " Arm"
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
  }, [focus]);

  return (
    <Center>
      <VStack alignItems="center">
        <ModelImage focus={focus} armFocus={armFocus} />
        <ModelButtons
          focus={focus}
          setFocus={setFocus}
          armFocus={armFocus}
          setArmFocus={setArmFocus}
          setSlot={props.setSlot}
        />
      </VStack>
    </Center>
  );
}
