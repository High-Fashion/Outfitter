import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Button,
  Center,
  CloseIcon,
  DeleteIcon,
  FlatList,
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
import { Animated, Dimensions, Keyboard, Pressable } from "react-native";
import Avatar from "../components/Avatar";
import { getUsers } from "../services/userService";
import { getPublicPosts, getFollowPosts } from "../services/postService";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../components/PostCard";
const { width } = Dimensions.get("window");

function FollowTab(props) {
  const [postIds, setPostIds] = useState({});

  useEffect(() => {
    async function get() {
      const postData = await getFollowPosts();
      setPostIds(postData);
    }
    get();
  }, []);

  return (
    <VStack flex={1}>
      {postIds?.length ? (
        <FlatList
          style={{ width: width }}
          pt={4}
          data={postIds}
          numColumns={1}
          renderItem={({ item, index }) => {
            return (
              <View key={index} pb={4}>
                <PostCard postId={item} />
              </View>
            );
          }}
        />
      ) : (
        <VStack
          flex={1}
          pt={10}
          style={{ width: width }}
          alignItems="center"
          justifyContent={"space-around"}
        >
          <Spinner />
        </VStack>
      )}
    </VStack>
  );
}

function PublicTab(props) {
  const [postIds, setPostIds] = useState({});

  useEffect(() => {
    async function get() {
      const postData = await getPublicPosts();
      setPostIds(postData);
    }
    get();
  }, []);

  return (
    <VStack flex={1}>
      {postIds?.length ? (
        <FlatList
          style={{ width: width }}
          pt={4}
          data={postIds}
          numColumns={1}
          renderItem={({ item, index }) => {
            return (
              <View flex={1} key={index} pb={4}>
                <PostCard card postId={item} />
              </View>
            );
          }}
        />
      ) : (
        <VStack
          flex={1}
          pt={10}
          style={{ width: width }}
          alignItems="center"
          justifyContent={"space-around"}
        >
          <Spinner />
        </VStack>
      )}
    </VStack>
  );
}

function Indicator(props) {
  const inputRange = Object.keys(props.measurements).map((m) => m * width);
  const indicatorWidth = props.scrollX.interpolate({
    inputRange,
    outputRange: Object.keys(props.measurements).map(
      (measurement) => props.measurements[measurement].width
    ),
  });
  const translateX = props.scrollX.interpolate({
    inputRange,
    outputRange: Object.keys(props.measurements).map(
      (measurement) => props.measurements[measurement].x
    ),
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        backgroundColor: "#818cf8",
        height: 3,
        width: indicatorWidth,
        bottom: 0,
        left: 0,
        transform: [{ translateX }],
      }}
    />
  );
}

const Tab = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      onLayout={(e) => {
        props.setMeasurement(e.nativeEvent.layout);
      }}
    >
      <Text fontSize="md" fontWeight="medium">
        {props.icon}
      </Text>
    </Pressable>
  );
};

function Tabs({ labels, setHeight, scrollX, onItemPress }) {
  const [measurements, setMeasurements] = useState({});

  useEffect(() => {
    console.log(measurements);
  }, [measurements]);

  return (
    <View
      onLayout={(e) => {
        setHeight(e.nativeEvent.layout.height);
      }}
      pb={2}
      borderBottomWidth={1}
      backgroundColor={"muted.100"}
      borderBottomColor="muted.400"
      flexDir={"row"}
      justifyContent="space-evenly"
    >
      {[
        {
          id: 0,
          icon: (
            <IconButton
              onPress={() => onItemPress(0)}
              variant="unstyled"
              borderRadius={"full"}
              icon={
                <Icon
                  size="xl"
                  color={"black"}
                  as={<FontAwesome5 name="user-friends" />}
                />
              }
            />
          ),
        },
        {
          id: 1,
          icon: (
            <IconButton
              onPress={() => onItemPress(1)}
              borderRadius={"full"}
              variant="unstyled"
              icon={
                <Icon
                  size="xl"
                  color={"black"}
                  as={<MaterialIcons name="public" />}
                />
              }
            />
          ),
        },
      ].map((item, index) => {
        return (
          <Tab
            key={index}
            icon={item.icon}
            setMeasurement={(measurement) =>
              setMeasurements({ ...measurements, [item.id]: measurement })
            }
          />
        );
      })}
      {Object.keys(measurements).length === 2 && (
        <Indicator measurements={measurements} scrollX={scrollX} />
      )}
    </View>
  );
}

function Media(props) {
  const [view, setView] = useState("follow");
  const [secondHeaderHeight, setHeight] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const ref = createRef();
  const onItemPress = useCallback((itemIndex) => {
    ref?.current?.scrollTo({
      x: itemIndex * width,
    });
  }, []);
  return (
    <ScrollView flex={1} stickyHeaderIndices={[2]}>
      <VStack>
        <Tabs
          setHeight={setHeight}
          scrollX={scrollX}
          onItemPress={onItemPress}
        />
        <VStack flex={1}>
          <Animated.ScrollView
            ref={ref}
            horizontal={true}
            pagingEnabled
            bounces={false}
            disableIntervalMomentum={true}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          >
            <FollowTab />
            <PublicTab />
          </Animated.ScrollView>
        </VStack>
      </VStack>
    </ScrollView>
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
        <View px={1} pt={1}>
          <SearchBar
            hideFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </View>
        {isKeyboardVisible ? (
          <SearchResults
            navigate={navigation.navigate}
            list={filteredUserList}
            searchQuery={searchQuery}
          />
        ) : (
          <Media isKeyboardVisible={isKeyboardVisible} />
        )}
      </VStack>
    </SafeAreaView>
  );
}

export default HomeScreen;
