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
  ScrollView,
  Text,
  useDisclose,
  View,
  VStack,
} from "native-base";
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
import { useState } from "react";

function SettingsActionsheet(props) {
  const { signOut } = useAuth();

  return (
    <Actionsheet isOpen={props.open} onClose={props.close}>
      <Actionsheet.Content _text={{ alignSelf: "flex-start" }}>
        <Actionsheet.Item>Wardrobe Settings</Actionsheet.Item>
        <Actionsheet.Item>Privacy Settings</Actionsheet.Item>
        <Actionsheet.Item>Body Shape</Actionsheet.Item>
        <Actionsheet.Item>Styles</Actionsheet.Item>
        <Actionsheet.Item>Dark Mode</Actionsheet.Item>
        <Actionsheet.Item onPress={signOut}>Log Out</Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

function ProfileHeader(props) {
  return (
    <HStack mx={2} alignItems="center" justifyContent="space-between">
      <View>
        <Heading>{props.user.username}</Heading>
      </View>
      <HStack>
        <IconButton p={1} icon={<MaterialIcons name="add-box" size={30} />} />
        <IconButton
          onPress={props.openSettings}
          p={1}
          icon={<Ionicons name="settings-sharp" size={30} />}
        />
      </HStack>
    </HStack>
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

function ProfileInfo(props) {
  const posts = props?.user?.posts;
  const followers = props?.user?.followers;
  const following = props?.user?.following;
  return (
    <VStack>
      <HStack mx={2} p={3} alignItems="center">
        <View flex={1} paddingLeft={1}>
          <Avatar size="2xl" emptyIconSize="64" />
        </View>
        <HStack space={3} flex={2} justifyContent="space-around">
          {[
            { label: "Posts", count: posts ? posts.length : 0 },
            { label: "Followers", count: followers ? followers.length : 0 },
            { label: "Following", count: following ? following.length : 0 },
          ].map((info) => {
            return <Count label={info.label} value={info.count} />;
          })}
        </HStack>
      </HStack>
      <VStack mx={2}>
        <VStack paddingBottom={1}>
          <Text>
            {props.user.firstName} {props.user.lastName}
          </Text>
          {props.user?.bio && <Text>{props.user.bio}</Text>}
        </VStack>
        <Button p={1}>Edit Profile</Button>
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
      <ScrollView>
        <HStack
          paddingBottom={0.5}
          justifyContent={"space-evenly"}
          width={width}
        >
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
      </ScrollView>
    </VStack>
  );
}

export default function ProfileScreen({ navigation, route }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclose();
  const profile = route?.params?.user ? route?.params?.user : user;
  return (
    <VStack>
      <SettingsActionsheet open={isOpen} close={onClose} />
      <ProfileHeader user={profile} openSettings={onOpen} />
      <ProfileInfo user={profile} />
      <ProfileContent user={profile} />
    </VStack>
  );
}
