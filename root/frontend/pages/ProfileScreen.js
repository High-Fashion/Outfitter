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
  Pressable,
  ScrollView,
  Text,
  useDisclose,
  View,
  VStack,
} from "native-base";
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

export function ProfileHeader(props) {
  return (
    <VStack pb={0.5} safeAreaTop>
      {props.self ? (
        <HStack mx={2} alignItems="center" justifyContent="space-between">
          <View>
            <Heading>{props.user.username}</Heading>
          </View>
          <HStack>
            <IconButton
              p={1}
              icon={<MaterialIcons name="add-box" size={30} />}
            />
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
              <Heading>{props.user.username}</Heading>
            </View>
            <IconButton
              p={1}
              onPress={props.openSettings}
              icon={<MaterialCommunityIcons name="dots-vertical" size={30} />}
            />
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
  const mutualFollows = user_followers.filter(
    (f) => !self_following.includes(f)
  );
  console.log("follow len", self_following);
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

  const [loading, setLoading] = useState(false);

  function pressAvatar() {}
  function pressPosts() {}
  function pressFollowers() {}
  function pressFollowing() {}
  function editProfile() {}

  async function follow() {
    setLoading(true);
    followUser(
      props.user,
      props.user.private ? !props.sentReq : !props.isFollowing
    ).then((success) => {
      if (success) {
        if (props.user.private) {
          props.setSentReq(!props.isFollowing);
        } else {
          props.setIsFollowing(!props.isFollowing);
        }
      } else {
        if (props.user.private) {
          props.setSentReq(!props.isFollowing);
        } else {
          props.setIsFollowing(!props.isFollowing);
        }
      }
      refreshUser();
      setLoading(false);
    });
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
              value={props?.user?.posts ? props.user.posts.length : 0}
            />
          </Pressable>
          <Pressable onPress={pressFollowers}>
            <Count
              label={"Followers"}
              value={props?.user?.followers ? props.user.followers.length : 0}
            />
          </Pressable>
          <Pressable onPress={pressFollowing}>
            <Count
              label={"Following"}
              value={props?.user?.following ? props.user.following.length : 0}
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
        <Button
          isLoading={loading}
          onPress={props.self ? editProfile : follow}
          p={1}
        >
          {props.self
            ? "Edit Profile"
            : props.user.private
            ? !props.sentReq
              ? "Send follow request"
              : "Cancel follow request"
            : props.isFollowing
            ? "Unfollow"
            : "Follow"}
        </Button>
      </VStack>
    </VStack>
  );
}

const { width } = Dimensions.get("window");

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

      <FlatList
        style={{ width: width }}
        data={[1, 2, 3, 4, 5, 6, 7]}
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
    </VStack>
  );
}

export function ProfileScreen({ navigation, route }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclose();
  const self = route?.params?.user ? false : true;

  const [profile, setProfile] = useState(
    route?.params?.user ? route?.params?.user : user
  );
  const [isFollowing, setIsFollowing] = useState(false);
  const [sentReq, setSentReq] = useState(false);

  useEffect(() => {
    if (self) return;
    console.log(user.following);
    setIsFollowing(user.following.includes(profile.id));
  }, [user]);

  useEffect(() => {
    async function get() {
      const userData = await getUser(route.params.user.id);
      setProfile(userData);
    }
    if (self) {
      setProfile(user);
      return;
    }
    get();
  }, []);

  navigation.setOptions({
    header: () => (
      <ProfileHeader
        goBack={navigation.goBack}
        self={self}
        user={profile}
        openSettings={onOpen}
      />
    ),
  });

  return (
    <View flex={1}>
      <VStack flex={1}>
        <SettingsActionsheet self={self} open={isOpen} close={onClose} />
        <ProfileInfo
          isFollowing={isFollowing}
          sentReq={sentReq}
          setIsFollowing={setIsFollowing}
          setSentReq={setSentReq}
          self={self}
          user={profile}
        />
        <ProfileContent self={self} user={profile} />
      </VStack>
    </View>
  );
}
