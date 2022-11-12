import React, { Component, useEffect, useState } from "react";

import {
  Center,
  HStack,
  Icon,
  IconButton,
  Text,
  View,
  VStack,
} from "native-base";
import { useAuth } from "../contexts/Auth";
import SearchBar from "../components/SearchBar";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Dimensions } from "react-native";

function FollowTab(props) {
  return (
    <Center mx={10}>
      <Text textAlign={"center"}>
        Looks like you aren{"'"}t following anyone. Try searching above for
        people to follow or check out the public posts by swiping right.
      </Text>
    </Center>
  );
}

function PublicTab(props) {
  return (
    <Center>
      <Text>Nothing here yet.</Text>
    </Center>
  );
}

const { width } = Dimensions.get("window");

function HomeScreen() {
  const { user } = useAuth();
  const [view, setView] = useState("follow");
  return (
    <VStack flex={1}>
      <SearchBar hideFilter />
      <HStack paddingBottom={0.5} justifyContent={"space-evenly"} width={width}>
        <View
          borderBottomWidth={view == "follow" ? 1 : 0}
          borderColor="black"
          width={width / 2}
        >
          <IconButton
            onPress={() => setView("follow")}
            borderRadius={"full"}
            icon={
              <Icon
                size="xl"
                color={view == "grid" ? "indigo.900" : "black"}
                as={<FontAwesome5 name="user-friends" />}
              />
            }
          />
        </View>
        <View
          borderBottomWidth={view == "public" ? 1 : 0}
          borderColor="black"
          width={width / 2}
        >
          <IconButton
            onPress={() => setView("public")}
            borderRadius={"full"}
            icon={
              <Icon
                size="xl"
                color={view == "wardrobe" ? "indigo.900" : "black"}
                as={<MaterialIcons name="public" />}
              />
            }
          />
        </View>
      </HStack>
      <VStack flex={1} justifyContent={"space-around"}>
        {view == "follow" && <FollowTab />}
        {view == "public" && <PublicTab />}
      </VStack>
    </VStack>
  );
}

export default HomeScreen;
