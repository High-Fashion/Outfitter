import { useState, useEffect, useRef } from "react";
import {
  Button,
  FlatList,
  HStack,
  Image,
  Text,
  View,
  VStack,
  Modal,
  IconButton,
  Icon,
  Box,
  useToast,
  AlertDialog,
  Menu,
  ScrollView,
  Input,
  Heading,
} from "native-base";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/Auth";
import {
  deleteOutfit,
  editOutfit,
  getImage,
} from "../services/wardrobeService";
import capitalize from "../utils/capitalize";
import { useNavigation } from "@react-navigation/native";
import IconImage from "./IconImage";
import ToastAlert from "./ToastAlert";
const { width, height } = Dimensions.get("window");

//https://www.geeksforgeeks.org/flatten-javascript-objects-into-a-single-depth-object/
const flattenObj = (ob) => {
  let result = {};
  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        result[i + "." + j] = temp[j];
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
};

const getText = (item) => {
  var text = "";
  if (item.colors) {
    if (item.colors.primary) text += item.colors.primary;
    if (item.colors.tertiary) {
      text += ", " + item.colors.secondary + ", and " + item.colors.tertiary;
    } else if (item.colors.secondary) {
      text += " and " + item.colors.secondary;
    }
  }
  if (item.material) text += " " + item.material;
  if (item.category)
    text +=
      " " + item.category.charAt(0).toUpperCase() + item.category.slice(1);
  return text;
};

function RatingModal(props) {
  return (
    <Modal
      size="full"
      isOpen={props.showRatingModal}
      onClose={() => props.setShowRatingModal(false)}
    >
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Outfit rating</Modal.Header>
        <Modal.Body>
          <HStack p={1} alignItems="center" justifyContent="space-between">
            <View style={{ flex: 1, alignItems: "center" }}>
              <View style={{ flex: 5, flexDirection: "row" }}>
                <IconButton
                  p={1}
                  icon={
                    props.rating >= 1 ? (
                      <AntDesign name="star" size={24} color="black" />
                    ) : (
                      <AntDesign name="staro" size={24} color="black" />
                    )
                  }
                  onPress={() => props.setRating(1)}
                />
                <IconButton
                  p={1}
                  icon={
                    props.rating >= 2 ? (
                      <AntDesign name="star" size={24} color="black" />
                    ) : (
                      <AntDesign name="staro" size={24} color="black" />
                    )
                  }
                  onPress={() => props.setRating(2)}
                />
                <IconButton
                  p={1}
                  icon={
                    props.rating >= 3 ? (
                      <AntDesign name="star" size={24} color="black" />
                    ) : (
                      <AntDesign name="staro" size={24} color="black" />
                    )
                  }
                  onPress={() => props.setRating(3)}
                />
                <IconButton
                  p={1}
                  icon={
                    props.rating >= 4 ? (
                      <AntDesign name="star" size={24} color="black" />
                    ) : (
                      <AntDesign name="staro" size={24} color="black" />
                    )
                  }
                  onPress={() => props.setRating(4)}
                />
                <IconButton
                  p={1}
                  icon={
                    props.rating >= 5 ? (
                      <AntDesign name="star" size={24} color="black" />
                    ) : (
                      <AntDesign name="staro" size={24} color="black" />
                    )
                  }
                  onPress={() => props.setRating(5)}
                />
                <Button
                  bgColor="blueGray.600"
                  borderWidth="2"
                  borderLeftWidth={2}
                  borderColor="blueGray.900"
                  flex={1}
                  borderLeftRadius={0}
                  onPress={() => props.setShowRatingModal(false)}
                >
                  Rate
                </Button>
              </View>
            </View>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

const StarRating = (props) => {
  return (
    <HStack p={1} alignItems="center" justifyContent="space-between">
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ flex: 5, flexDirection: "row" }}>
          <IconButton
            p={1}
            icon={
              props.rating >= 1 ? (
                <AntDesign name="star" size={24} color="black" />
              ) : (
                <AntDesign name="staro" size={24} color="black" />
              )
            }
            disabled={true}
          />
          <IconButton
            p={1}
            icon={
              props.rating >= 2 ? (
                <AntDesign name="star" size={24} color="black" />
              ) : (
                <AntDesign name="staro" size={24} color="black" />
              )
            }
            disabled={true}
          />
          <IconButton
            p={1}
            icon={
              props.rating >= 3 ? (
                <AntDesign name="star" size={24} color="black" />
              ) : (
                <AntDesign name="staro" size={24} color="black" />
              )
            }
            disabled={true}
          />
          <IconButton
            p={1}
            icon={
              props.rating >= 4 ? (
                <AntDesign name="star" size={24} color="black" />
              ) : (
                <AntDesign name="staro" size={24} color="black" />
              )
            }
            disabled={true}
          />
          <IconButton
            p={1}
            icon={
              props.rating >= 5 ? (
                <AntDesign name="star" size={24} color="black" />
              ) : (
                <AntDesign name="staro" size={24} color="black" />
              )
            }
            disabled={true}
          />
          <Button
            bgColor="blueGray.600"
            borderWidth="2"
            borderLeftWidth={2}
            borderColor="blueGray.900"
            flex={1}
            borderLeftRadius={0}
            onPress={() => props.setShowRatingModal(true)}
          >
            Rate
          </Button>
        </View>
      </View>
    </HStack>
  );
};

function CardMenu(props) {
  const navigation = useNavigation();
  const toast = useToast();
  const { refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  function edit() {
    navigation.navigate("Outfit", { outfit: props.outfit });
  }

  async function _delete() {
    setIsOpen(false);
    setDeleting(true);
    const response = await deleteOutfit(props.outfit._id);
    setDeleting(false);
    toast.show({
      render: () => {
        return (
          <ToastAlert
            status={response === true ? "success" : "error"}
            colorScheme={response === true ? "success" : "error"}
            title={
              response === true
                ? "Outfit successfully deleted!"
                : "Failed to delete outfit, please try again."
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
  function outfit() {}
  function post() {}
  function share() {}

  return (
    <View>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Item</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure you want to delete this outfit?
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
        placement="bottom right"
        trigger={(triggerProps) => {
          return (
            <View>
              {deleting === true ? (
                <Spinner />
              ) : (
                <IconButton
                  {...triggerProps}
                  borderRadius="full"
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
        <Menu.Item onPress={edit}>
          <Icon color="muted.800" as={Feather} name="edit" size="md" />
          <Text color="muted.800" fontSize="md" fontWeight="semibold">
            Edit Outfit
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
            Delete Outfit
          </Text>
        </Menu.Item>
        <Menu.Item isDisabled onPress={outfit}>
          <Icon
            color="muted.800"
            as={MaterialIcons}
            name="open-in-new"
            size="md"
          />
          <Text color="muted.800" fontSize="md" fontWeight="semibold">
            Generate Similar Outfit
          </Text>
        </Menu.Item>
        <Menu.Item isDisabled onPress={post}>
          <Icon
            color="muted.800"
            as={Ionicons}
            name="share-outline"
            size="md"
          />
          <Text color="muted.800" fontSize="md" fontWeight="semibold">
            Share to Profile
          </Text>
        </Menu.Item>
        <Menu.Item isDisabled onPress={share}>
          <Icon color="muted.800" as={Ionicons} name="share-social" size="md" />
          <Text color="muted.800" fontSize="md" fontWeight="semibold">
            Share to Friend
          </Text>
        </Menu.Item>
      </Menu>
    </View>
  );
}

function ItemImage(props) {
  const [uri, setUri] = useState(null);

  useEffect(() => {
    async function get() {
      const imageData = await getImage(props.item.imageName);
      console.log(imageData);
      setUri(imageData);
    }
    if (!props.item.imageName) return;
    get();
  }, []);

  return (
    <View>
      {uri ? (
        <Image
          style={{ width: props.dims.width, height: props.dims.height }}
          source={{ uri: uri }}
          alt="image missing"
        />
      ) : (
        <IconImage item={props.item} />
      )}
    </View>
  );
}

function OutfitImage(props) {
  const [cardLayout, setCardLayout] = useState({});
  const [count, setCount] = useState(0);
  const [uri, setUri] = useState(null);

  useEffect(() => {
    async function get() {
      const imageData = await getImage(props.outfit.imageName);
      console.log(imageData);
      setUri(imageData);
    }
    if (!props.outfit.imageName) return;
    get();
  }, []);

  useEffect(() => {
    var c = 0;
    Object.keys(props.outfit).forEach((key) => {
      if (
        key == "user" ||
        key == "_id" ||
        key == "id" ||
        key == "imageName" ||
        props.outfit[key].length == 0
      ) {
        return;
      }
      c += props.outfit[key].length;
      console.log(props.outfit[key].length, props.outfit[key]);
    });
    switch (c) {
      case 1:
      case 2:
        setCount(2);
        break;
      case 4:
        setCount(2);
        break;
      case 3:
      case 5:
        setCount(3);
        break;
      default:
        setCount(3);
    }
  }, []);

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <View
      onLayout={(e) =>
        setCardLayout({
          x: e.nativeEvent.layout.x,
          y: e.nativeEvent.layout.y,
          width: e.nativeEvent.layout.width - 1,
          height: e.nativeEvent.layout.height,
        })
      }
    >
      {cardLayout.width && count > 0 && (
        <View alignItems={"center"}>
          {uri ? (
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{ uri: uri }}
              alt="image missing"
            />
          ) : (
            <HStack flexWrap={"wrap"}>
              {Object.keys(props.outfit).map((slot) => {
                if (
                  slot == "user" ||
                  slot == "_id" ||
                  slot == "id" ||
                  slot == "imageName" ||
                  props.outfit[slot].length == 0
                ) {
                  return;
                } else {
                  return (
                    <View>
                      {props.outfit[slot].map((item) => {
                        return (
                          <HStack
                            alignItems={"center"}
                            style={{
                              width: cardLayout.width / count,
                              height: cardLayout.width / count,
                            }}
                          >
                            <ItemImage
                              item={item}
                              dims={{
                                width: cardLayout.width / count,
                                height: cardLayout.width / count,
                              }}
                            />
                          </HStack>
                        );
                      })}
                    </View>
                  );
                }
              })}
            </HStack>
          )}
        </View>
      )}
    </View>
  );
}

export default function OutfitCard(props) {
  const [rating, setRating] = useState(0);
  const outfit = flattenObj(props.outfit);
  const { refreshUser } = useAuth();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  const [name, setName] = useState(
    props.outfit?.name ? props.outfit.name : "Untitled Outfit"
  );
  const remove = async (id) => {
    const response = await deleteOutfit(id);
    if (response) {
      refreshUser();
    }
  };

  const toast = useToast();
  const updateName = async () => {
    setUpdatingName(true);
    var res = await editOutfit({ name: name }, props.outfit._id);
    setUpdatingName(false);
    toast.show({
      render: () => {
        return (
          <ToastAlert
            status={res === true ? "success" : "error"}
            colorScheme={res === true ? "success" : "error"}
            title={
              res === true
                ? "Successfully updated name!"
                : "Failed to updated name, please try again."
            }
          />
        );
      },
    });
  };

  return (
    <View shadow="5" borderTopRadius="xl" borderBottomRadius={"2xl"}>
      <RatingModal
        rating={rating}
        setRating={setRating}
        showRatingModal={showRatingModal}
        setShowRatingModal={setShowRatingModal}
      />
      <Box
        flex={1}
        zIndex={1}
        backgroundColor="white"
        borderTopRadius="lg"
        borderBottomRadius={"2xl"}
        borderWidth={0.5}
        borderColor="gray.300"
        overflow={"hidden"}
      >
        <VStack>
          {!props.info && (
            <View position={"absolute"} zIndex={2} top="2" right="1">
              <CardMenu
                setDeleted={props.setDeleted}
                flex={1}
                item={props.item}
              />
            </View>
          )}
          <OutfitImage outfit={outfit} />

          <View
            borderWidth={1}
            borderBottomWidth={0}
            borderColor="gray.300"
            backgroundColor="white"
            borderRadius={"2xl"}
          >
            <VStack space={2} mx={2} mb={2} my={1}>
              {!props.info ? (
                <View>
                  <Input
                    rightElement={<Icon as={Entypo} name="edit" size="lg" />}
                    fontSize="xl"
                    p={0}
                    defaultValue={name}
                    onChangeText={setName}
                    variant="underlined"
                    fontWeight="bold"
                    onBlur={updateName}
                  />
                </View>
              ) : (
                <Heading>{name}</Heading>
              )}
              {Object.keys(outfit).map((slot) => {
                if (
                  slot == "user" ||
                  slot == "_id" ||
                  slot == "id" ||
                  outfit[slot].length == 0
                )
                  return;
                return (
                  <HStack
                    mx={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <View>
                      <Text>{capitalize(slot)}</Text>
                    </View>
                    {outfit[slot].map((item) => {
                      return (
                        <Button
                          variant={"subtle"}
                          p={1}
                          style={{ flexShrink: 1 }}
                        >
                          {item.name ? item.name : getText(item)}
                        </Button>
                      );
                    })}
                  </HStack>
                );
              })}
            </VStack>
          </View>
        </VStack>
      </Box>
    </View>
  );
}
