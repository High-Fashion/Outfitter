import React, { Component, useEffect, useState } from "react";

import {
  Button,
  Center,
  CloseIcon,
  DeleteIcon,
  Heading,
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Spinner,
  Text,
  View,
  VStack,
} from "native-base";
import { useAuth } from "../contexts/Auth";
import SearchBar from "../components/SearchBar";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Dimensions, Keyboard, Pressable } from "react-native";
import Avatar from "../components/Avatar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsers } from "../services/userService";
import { SafeAreaView } from "react-native-safe-area-context";

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

function Media(props) {
  const [view, setView] = useState("follow");

  return (
    <View>
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
    </View>
  );
}

function UserCard(props) {
  const { user, username } = props;
  return (
    <HStack>
      <Avatar />
      <VStack>
        <Text>{user ? user.username : username ? username : ""}</Text>
        {user && (
          <Text>
            {user.firstName} {user.lastName}
          </Text>
        )}
      </VStack>
      {props.recent && (
        <IconButton
          onPress={() =>
            removeRecentSearch(user ? user.username : username ? username : "")
          }
          icon={<CloseIcon />}
        />
      )}
    </HStack>
  );
}

function SearchResults(props) {
  function openUser(user) {
    props.navigate("Home", {
      screen: "UserProfile",
      params: { id: user._id, username: user.username },
    });
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <VStack>
        {props.list.map((user) => (
          <Pressable key={user.username} onPress={() => openUser(user)}>
            <UserCard user={user} />
          </Pressable>
        ))}
      </VStack>
    </ScrollView>
  );
}

function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function get() {
      const users = await getUsers();
      if (users !== null) {
        setUserList(users);
      }
    }
    get();
  }, []);

  useEffect(() => {
    setFilteredUserList(
      userList.filter((u) => {
        if (u.username == user.username) return false;
        if (searchQuery == "") return true;
        return (
          String(u.firstName + " " + u.lastName).includes(searchQuery) ||
          u.username.includes(searchQuery)
        );
      })
    );
  }, [searchQuery]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView flex={1}>
      <VStack flex={1}>
        <SearchBar
          hideFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {isKeyboardVisible ? (
          <SearchResults
            navigate={navigation.navigate}
            list={filteredUserList}
            searchQuery={searchQuery}
          />
        ) : (
          <Media followPosts={[]} publicPosts={[]} />
        )}
      </VStack>
    </SafeAreaView>
  );
}

export default HomeScreen;
