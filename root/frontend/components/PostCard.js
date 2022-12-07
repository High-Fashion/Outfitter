import { useNavigation } from "@react-navigation/native";
import {
  HStack,
  Icon,
  ScrollView,
  Spinner,
  Text,
  useToast,
  View,
  Image,
  Button,
  Box,
  Divider,
  Heading,
  IconButton,
  Menu,
  Modal,
  AlertDialog,
  Skeleton,
  CloseIcon,
  Alert,
  Center,
  Input,
  useContrastText,
  Pressable,
  VStack,
} from "native-base";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import Avatar from "./Avatar";
import ItemCard from "./ItemCard";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
const { width } = Dimensions.get("window");
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Feather,
  AntDesign,
  Octicons,
} from "@expo/vector-icons";

import { getImage } from "../services/wardrobeService";
import { getPost, deletePost, editPost } from "../services/postService";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/Auth";
import ToastAlert from "./ToastAlert";
import OutfitCard from "./OutfitCard";

function PostMenu(props) {
  const navigation = useNavigation();
  const toast = useToast();
  const { refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  function edit() {
    navigation.navigate("Item", { item: props.item });
  }

  async function _delete() {
    setIsOpen(false);
    setDeleting(true);
    const response = await deletePost(props.item._id);
    setDeleting(false);
    toast.show({
      render: () => {
        return (
          <ToastAlert
            status={response === true ? "success" : "error"}
            colorScheme={response === true ? "success" : "error"}
            title={
              response === true
                ? "Item successfully deleted!"
                : "Failed to delete item, please try again."
            }
          />
        );
      },
    });
    if (response) {
      props.setDeleted(true);
      refreshUser();
    }
  }

  return (
    <View>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Post</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure you want to delete this post?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={_delete}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <Menu
        placement="bottom left"
        trigger={(triggerProps) => {
          return (
            <View>
              {deleting === true ? (
                <Spinner />
              ) : (
                <IconButton
                  {...triggerProps}
                  borderRadius="full"
                  isDisabled
                  icon={
                    <Entypo
                      name="dots-three-vertical"
                      size={22}
                      color="black"
                    />
                  }
                />
              )}
            </View>
          );
        }}
      >
        <Menu.Item>
          <Icon color="muted.800" as={Feather} name="edit" size="md" />
          <Text color="muted.800" fontSize="md" fontWeight="semibold">
            Edit Post
          </Text>
        </Menu.Item>
        <Menu.Item onPress={() => setIsOpen(true)}>
          <Icon
            color="muted.800"
            as={Ionicons}
            name="trash-outline"
            size="md"
          />
          <Text color="muted.800" fontSize="md" fontWeight="semibold">
            Delete Post
          </Text>
        </Menu.Item>
        <Menu.Item isDisabled>
          <Icon color="muted.800" as={Ionicons} name="share-social" size="md" />
          <Text color="muted.800" fontSize="md" fontWeight="semibold">
            Share to Friend
          </Text>
        </Menu.Item>
      </Menu>
    </View>
  );
}

function PostImage(props) {
  const [uri, setUri] = useState(null);
  console.log(props.layout);
  useEffect(() => {
    async function get() {
      const imageData = await getImage(props.imageName);
      setUri(imageData);
    }
    if (!props.imageName) return;
    get();
  }, []);

  return (
    <View flex="1">
      {uri ? (
        <View>
          {props.layout && (
            <Image
              style={{ width: props.layout.width, height: props.layout.width }}
              source={{ uri: uri }}
              alt="image missing"
            />
          )}
        </View>
      ) : (
        <VStack flex={1}>
          <Skeleton
            style={{ width: "100%", height: "100%" }}
            startColor="indigo.100"
          />
        </VStack>
      )}
    </View>
  );
}

export default function PostCard(props) {
  const [post, setPost] = useState({});
  const [layout, setLayout] = useState({});

  useEffect(() => {
    async function get() {
      const postData = await getPost(props.postId);
      console.log("post!", postData);
      setPost(postData);
    }
    if (!props.postId) return;
    get();
  }, []);

  if (props.card) {
    return (
      <View flex={1}>
        {post.id ? (
          <VStack
            flex={1}
            onLayout={(e) =>
              setLayout({
                width: e.nativeEvent.layout.width,
                height: e.nativeEvent.layout.height,
              })
            }
          >
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <HStack alignItems={"center"}>
                <Avatar navBar />
                <Text p={1} fontWeight="bold">
                  {post?.user?.username}
                </Text>
              </HStack>
              <PostMenu />
            </HStack>
            <ScrollView
              nestedScrollEnabled
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => console.log(e.nativeEvent.contentOffset)}
            >
              <PostImage layout={layout} imageName={post.imageName} />
              {post?.type == "item" && (
                <View width={width}>
                  <ItemCard item={post?.item} />
                </View>
              )}

              {post?.type == "outfit" && (
                <View width={width}>
                  <OutfitCard hideShadow square info outfit={post?.outfit} />
                </View>
              )}
            </ScrollView>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <HStack alignItems={"center"}>
                <IconButton
                  size="lg"
                  variant="unstyled"
                  icon={<Icon as={AntDesign} name="hearto" color="muted.600" />}
                />
                <IconButton
                  size="lg"
                  variant="unstyled"
                  icon={<Icon as={Octicons} name="comment" color="muted.600" />}
                />
              </HStack>
              <IconButton
                variant="unstyled"
                icon={
                  <Icon
                    as={MaterialCommunityIcons}
                    name="bookmark-plus-outline"
                    color="muted.600"
                    size={8}
                  />
                }
              />
            </HStack>
            {post?.text && (
              <HStack space="1">
                <Text fontWeight={"black"}>{post?.user?.username}</Text>
                <Text>{post?.text}</Text>
              </HStack>
            )}
            <Text fontWeight={"black"}>
              {post?.likes?.length ? post?.likes?.length : 0} likes
            </Text>
          </VStack>
        ) : (
          <Center w="100%">
            <VStack
              w="90%"
              maxW="400"
              borderWidth="1"
              space={8}
              overflow="hidden"
              rounded="md"
              _dark={{
                borderColor: "indigo.500",
              }}
              _light={{
                borderColor: "indigo.200",
              }}
            >
              <Skeleton h="40" />
              <Skeleton.Text px="4" />
              <Skeleton px="4" my="4" rounded="md" startColor="indigo.100" />
            </VStack>
          </Center>
        )}
      </View>
    );
  } else if (props.square) {
    return (
      <View
        flex={1}
        onLayout={(e) =>
          setLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }
      >
        {!post?.id ? (
          <VStack flex={1}>
            <Skeleton
              style={{ width: width / 3, height: width / 3 }}
              startColor="indigo.100"
            />
          </VStack>
        ) : (
          <View flex={1}>
            <PostImage layout={layout} imageName={post.imageName} />
          </View>
        )}
      </View>
    );
  } else {
    return <></>;
  }
}
