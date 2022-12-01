import {
  Actionsheet,
  AddIcon,
  Box,
  Button,
  FlatList,
  HamburgerIcon,
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
import FollowButton from "../components/FollowButton";
import ItemCard from "../components/ItemCard";
import OutfitCard from "../components/OutfitCard";
import { Avatar as NativeBaseAvatar } from "native-base";
import Avatar from "../components/Avatar";
import { useAuth } from "../contexts/Auth";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { HeaderBackButton } from "@react-navigation/elements";
import { getUser, followUser } from "../services/userService";
import { useNavigation } from "@react-navigation/native";

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
      <Menu.Item
        onPress={() => navigation.navigate("Post", { type: "clothing" })}
      >
        <FontAwesome5 name="tshirt" size={18} color="muted.800" />
        <Text color="muted.800" fontSize="md" fontWeight="semibold">
          Post Clothing Picture
        </Text>
      </Menu.Item>
    </Menu>
  );
}

export function ProfileHeader(props) {
  return (
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
  const [names, setNames] = useState([]);

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
  const { user, refreshUser } = useAuth();
  const [followLoading, setFollowLoading] = useState(false);
  const navigation = useNavigation();

  function pressAvatar() {}
  function pressPosts() {}
  function pressFollowers() {}
  function pressFollowing() {}
  function editProfile() {
    navigation.navigate("EditProfile");
  }

  async function follow() {
    setFollowLoading(true);
    var res = await followUser(
      props.user,
      props.user.private
        ? !user.sentRequests.includes(props.user._id)
        : !user.following.includes(props.user._id)
    );
    await refreshUser();
    setFollowLoading(false);
  }

  return (
    <VStack>
      <HStack mx={2} p={3} alignItems="center">
        <View flex={1} paddingLeft={1}>
          <Pressable onPress={pressAvatar}>
            <Avatar size="2xl" emptyIconSize="64" />
          </Pressable>
        </View>
        <HStack space={3} flex={2} justifyContent="space-around">
          <Pressable onPress={pressPosts}>
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

const { width } = Dimensions.get("window");

function Posts(props) {
  return (
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
            <Button flex={1} borderRadius={0} />
          </View>
        );
      }}
    />
  );
}

function Clothing(props) {
  return (
    <FlatList
      style={{ width: width }}
      data={props.clothing}
      numColumns={1}
      renderItem={({ item, index }) => {
        return (
          <View paddingBottom={3}>
            <ItemCard item={item} />
          </View>
        );
      }}
    />
  );
}

function Outfits(props) {
  return (
    <FlatList
      style={{ width: width }}
      data={props.outfits}
      numColumns={1}
      renderItem={({ item, index }) => {
        return (
          <View>
            <OutfitCard outfit={item} />
          </View>
        );
      }}
    />
  );
}

function ProfileContent(props) {
  if (!props.user) return <></>;
  const [focused, setFocused] = useState("grid");
  return (
    <VStack>
      <HStack paddingBottom={0.5} justifyContent={"space-evenly"} width={width}>
        <View
          borderBottomWidth={focused == "grid" ? 1 : 0}
          borderColor="black"
          width={width / 3}
        >
          <IconButton
            onPress={() => setFocused("grid")}
            borderRadius={"full"}
            icon={
              <Icon
                size="xl"
                color={focused == "grid" ? "indigo.900" : "black"}
                as={<MaterialCommunityIcons name="grid" />}
              />
            }
          />
        </View>
        <View
          borderBottomWidth={focused == "wardrobe" ? 1 : 0}
          borderColor="black"
          width={width / 3}
        >
          <IconButton
            onPress={() => setFocused("wardrobe")}
            borderRadius={"full"}
            icon={
              <Icon
                size="xl"
                color={focused == "wardrobe" ? "indigo.900" : "black"}
                as={<MaterialCommunityIcons name="hanger" />}
              />
            }
          />
        </View>
        <View
          borderBottomWidth={focused == "outfits" ? 1 : 0}
          borderColor="black"
          width={width / 3}
        >
          <IconButton
            onPress={() => setFocused("outfits")}
            borderRadius={"full"}
            icon={
              <Icon
                size="xl"
                color={focused == "outfits" ? "indigo.900" : "black"}
                as={<FontAwesome5 name="person-booth" />}
              />
            }
          />
        </View>
      </HStack>
      <ScrollView
        horizontal={true}
        snapToInterval={width}
        disableIntervalMomentum={true}
      >
        <HStack>
          <Posts posts={props.posts} postIds={props.postIds} />
          <Clothing clothing={props.clothing} />
          <Outfits outfits={props.outfits} />
        </HStack>
      </ScrollView>
    </VStack>
  );
}

export function ProfileScreen({ navigation, route }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclose();
  const self = route?.params?.id ? false : true;
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState({});

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

  useEffect(() => {
    async function loadPosts() {
      await Promise.all(
        profile.posts.map(async (post) => {
          if (!post) return;
          const postData = await getPost(post);
          setPosts({ ...posts, post: postData });
        })
      );
    }
    if (!profile.posts?.length || profile.posts?.length == 0) return;
    loadPosts();
  }, [profile.posts]);

  navigation.setOptions({
    header: () => (
      <ProfileHeader
        goBack={navigation.goBack}
        self={self}
        username={self ? user.username : route.params.username}
        openSettings={onOpen}
      />
    ),
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

  return (
    <View flex={1}>
      {profile.username ? (
        <VStack flex={1}>
          <SettingsActionsheet self={self} open={isOpen} close={onClose} />
          <ProfileInfo self={self} user={profile} peopleScreen={peopleScreen} />
          <ProfileContent
            postIds={profile.posts}
            posts={posts}
            clothing={profile.wardrobe.items}
            outfits={profile.wardrobe.outfits}
            self={self}
            user={profile}
          />
        </VStack>
      ) : (
        <VStack flex={1} alignItems="center" justifyContent="space-around">
          <Spinner />
        </VStack>
      )}
    </View>
  );
}
