import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import {
  Actionsheet,
  Avatar as NativeBaseAvatar,
  FlatList,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  useDisclose,
  View,
  VStack,
} from "native-base";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import Avatar from "../components/Avatar";
import FollowButton from "../components/FollowButton";
import ItemCard from "../components/ItemCard";
import OutfitCard from "../components/OutfitCard";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/Auth";
import { getUser } from "../services/userService";

function SettingsActionsheet(props) {
  const { signOut } = useAuth();
  return (
    <Actionsheet isOpen={props.open} onClose={props.close}>
      <Actionsheet.Content _text={{ alignSelf: "flex-start" }}>
        {props.self ? (
          <>
            <Actionsheet.Item>Wardrobe Settings</Actionsheet.Item>
            <Actionsheet.Item>Privacy Settings</Actionsheet.Item>
            <Actionsheet.Item>Body Shape</Actionsheet.Item>
            <Actionsheet.Item>Styles</Actionsheet.Item>
            <Actionsheet.Item>Dark Mode</Actionsheet.Item>
            <Actionsheet.Item onPress={signOut}>Log Out</Actionsheet.Item>
          </>
        ) : (
          <>
            <Actionsheet.Item>Report</Actionsheet.Item>
            <Actionsheet.Item>Block</Actionsheet.Item>
            <Actionsheet.Item>Hide</Actionsheet.Item>
            <Actionsheet.Item>Share Profile</Actionsheet.Item>
          </>
        )}
      </Actionsheet.Content>
    </Actionsheet>
  );
}

function PostMenu(props) {
  const navigation = useNavigation();

  return (
    <Menu
      placement="bottom left"
      trigger={(triggerProps) => {
        return (
          <IconButton
            {...triggerProps}
            p={1}
            icon={<MaterialIcons name="add-box" size={30} />}
          />
        );
      }}
    >
      <Menu.Item
        onPress={() => navigation.navigate("Post", { type: "outfit" })}
      >
        <FontAwesome5 name="person-booth" size={18} color="muted.800" />
        <Text color="muted.800" fontSize="md" fontWeight="semibold">
          Post Outfit Picture
        </Text>
      </Menu.Item>
      <Menu.Item onPress={() => navigation.navigate("Post", { type: "item" })}>
        <FontAwesome5 name="tshirt" size={18} color="muted.800" />
        <Text color="muted.800" fontSize="md" fontWeight="semibold">
          Post Clothing Picture
        </Text>
      </Menu.Item>
    </Menu>
  );
}

export function ProfileHeader(props) {
  return () => (
    <VStack pb={0.5} safeAreaTop>
      {props.self && !props.hideSettings ? (
        <HStack mx={2} alignItems="center" justifyContent="space-between">
          <View>
            <Heading>{props.username}</Heading>
          </View>
          <HStack>
            <PostMenu />
            <IconButton
              onPress={props.openSettings}
              p={1}
              icon={<Ionicons name="settings-sharp" size={30} />}
            />
          </HStack>
        </HStack>
      ) : (
        <HStack alignItems="center" width={width}>
          <HStack flex="1">
            <HeaderBackButton onPress={props.goBack} labelVisible={false} />
          </HStack>
          <HStack
            flex="9"
            mx={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <View>
              <Heading>{props.username}</Heading>
            </View>
            {!props.hideSettings && (
              <IconButton
                p={1}
                onPress={props.openSettings}
                icon={<MaterialCommunityIcons name="dots-vertical" size={30} />}
              />
            )}
          </HStack>
        </HStack>
      )}
    </VStack>
  );
}

function Count(props) {
  return (
    <VStack alignItems="center">
      <Text fontSize="lg" bold>
        {props.value}
      </Text>
      <Text>{props.label}</Text>
    </VStack>
  );
}

function FollowedBy(props) {
  const { user } = useAuth();
  const user_followers = props.user?.followers ? props.user.followers : [];
  const self_following = user.following;
  const mutualFollows = user_followers.filter((f) =>
    self_following.includes(f)
  );

  if (mutualFollows.length == 0) return <></>;

  function RenderList() {
    if (mutualFollows.length == 1) {
      return (
        <Pressable>
          <Text>{mutualFollows[0]}</Text>
        </Pressable>
      );
    }
    if (mutualFollows.length == 2) {
      return (
        <>
          <Pressable>
            <Text>{mutualFollows[0]}</Text>
          </Pressable>
          <Text> and </Text>
          <Pressable>
            <Text>{mutualFollows[1]}</Text>
          </Pressable>
        </>
      );
    }
    if (mutualFollows.length > 2) {
      return (
        <>
          <Pressable>
            <Text>{mutualFollows[0]}</Text>
          </Pressable>
          <Text>, </Text>
          <Pressable>
            <Text>{mutualFollows[1]}</Text>
          </Pressable>
          <Text>, and </Text>
          <Pressable>
            <Text>{mutualFollows.length - 2} others</Text>
          </Pressable>
        </>
      );
    }
  }

  return (
    <HStack>
      <NativeBaseAvatar.Group />
      <HStack>
        <Text>Followed by </Text>
        <RenderList />
      </HStack>
    </HStack>
  );
}

function ProfileInfo(props) {
  return (
    <VStack>
      <HStack mx={2} p={3} alignItems="center">
        <View flex={1} paddingLeft={1}>
          <Pressable>
            <Avatar size="2xl" emptyIconSize="64" />
          </Pressable>
        </View>
        <HStack space={3} flex={2} justifyContent="space-around">
          <Pressable>
            <Count
              label={"Posts"}
              value={
                props?.user?.private
                  ? props?.user?.postsCount
                    ? props.user.postsCount
                    : 0
                  : props?.user?.posts
                  ? props.user.posts.length
                  : 0
              }
            />
          </Pressable>
          <Pressable onPress={() => props.peopleScreen("followers")}>
            <Count
              label={"Followers"}
              value={
                props?.user?.private
                  ? props?.user?.followerCount
                    ? props.user.followerCount
                    : 0
                  : props?.user?.followers
                  ? props.user.followers.length
                  : 0
              }
            />
          </Pressable>
          <Pressable onPress={() => props.peopleScreen("following")}>
            <Count
              label={"Following"}
              value={
                props?.user?.private
                  ? props?.user?.followingCount
                    ? props.user.followingCount
                    : 0
                  : props?.user?.following
                  ? props.user.following.length
                  : 0
              }
            />
          </Pressable>
        </HStack>
      </HStack>
      <VStack mx={2}>
        <VStack paddingBottom={1}>
          <Text>
            {props.user.firstName} {props.user.lastName}
          </Text>
          {props.user?.bio && <Text>{props.user.bio}</Text>}
          <FollowedBy user={props.user} />
        </VStack>
        <FollowButton self={props.self} user={props.user} />
      </VStack>
    </VStack>
  );
}

const { height, width } = Dimensions.get("window");

function Posts(props) {
  return (
    <VStack flex={1}>
      <FlatList
        style={{ width: width }}
        data={props.postIds}
        numColumns={3}
        renderItem={({ item, index }) => {
          return (
            <View
              paddingLeft={(index + 1) % 3 == 0 ? 0.5 : 0}
              paddingRight={(index + 1) % 3 == 1 ? 0.5 : 0}
              paddingBottom={0.5}
              style={{ width: width / 3, height: width / 3 }}
            >
              <Pressable flex={1}>
                <PostCard square postId={item} />
              </Pressable>
            </View>
          );
        }}
      />
    </VStack>
  );
}

function Clothing(props) {
  return (
    <VStack flex={1}>
      <FlatList
        p={4}
        style={{ width: width }}
        data={props.clothing}
        numColumns={1}
        renderItem={({ item, index }) => {
          return (
            <View paddingBottom={4}>
              <ItemCard info item={item} />
            </View>
          );
        }}
      />
    </VStack>
  );
}

function Outfits(props) {
  return (
    <VStack flex={1}>
      <FlatList
        style={{ width: width }}
        p={4}
        data={props.outfits}
        numColumns={1}
        renderItem={({ item, index }) => {
          return (
            <View pb={4}>
              <OutfitCard info outfit={item} />
            </View>
          );
        }}
      />
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
      {props.icon}
    </Pressable>
  );
};

function Tabs({ labels, scrollX, onItemPress }) {
  const [measurements, setMeasurements] = useState({});

  useEffect(() => {
    console.log(measurements);
  }, [measurements]);

  return (
    <View
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
                  as={<MaterialCommunityIcons name="grid" />}
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
              variant="unstyled"
              borderRadius={"full"}
              icon={
                <Icon
                  size="xl"
                  color={"black"}
                  as={<MaterialCommunityIcons name="hanger" />}
                />
              }
            />
          ),
        },
        {
          id: 2,
          icon: (
            <IconButton
              onPress={() => onItemPress(2)}
              variant="unstyled"
              borderRadius={"full"}
              icon={
                <Icon
                  size="xl"
                  color={"black"}
                  as={<FontAwesome5 name="person-booth" />}
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
      {Object.keys(measurements).length === 3 && (
        <Indicator measurements={measurements} scrollX={scrollX} />
      )}
    </View>
  );
}

export function ProfileScreen({ navigation, route }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclose();
  const self = route?.params?.id ? false : true;
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function get() {
      const userData = await getUser(route.params.id);
      setProfile(userData);
      console.log(userData._id);
    }
    if (self) {
      setProfile(user);
      return;
    }
    get();
  }, [user]);

  navigation.setOptions({
    header: ProfileHeader({
      goBack: navigation.goBack,
      self: self,
      username: self ? user.username : route.params.username,
      openSettings: onOpen,
    }),
  });

  function peopleScreen(path) {
    navigation.navigate("PeopleList", {
      username: profile.username,
      mutual: profile.mutuals,
      following: profile.following,
      followers: profile.followers,
      path: path,
    });
  }
  const scrollX = useRef(new Animated.Value(0)).current;

  const ref = createRef();

  const onItemPress = useCallback((itemIndex) => {
    console.log(ref);
    ref?.current?.scrollTo({
      x: itemIndex * width,
    });
  }, []);

  return (
    <View flex={1}>
      {profile.username ? (
        <ScrollView flex={1} stickyHeaderIndices={[2]}>
          <SettingsActionsheet self={self} open={isOpen} close={onClose} />
          <ProfileInfo self={self} user={profile} peopleScreen={peopleScreen} />
          <Tabs scrollX={scrollX} onItemPress={onItemPress} />

          <VStack>
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
              <Posts postIds={profile.posts} />
              <Clothing clothing={profile.wardrobe.items} />
              <Outfits outfits={profile.wardrobe.outfits} />
            </Animated.ScrollView>
          </VStack>
        </ScrollView>
      ) : (
        <VStack flex={1} alignItems="center" justifyContent="space-around">
          <Spinner />
        </VStack>
      )}
    </View>
  );
}
