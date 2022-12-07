import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  AlertDialog,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Menu,
  Modal,
  Spinner,
  Text,
  useToast,
  View,
  VStack,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { useAuth } from "../contexts/Auth";
import {
  deleteOutfit,
  editOutfit,
  getImage,
} from "../services/wardrobeService";
import capitalize from "../utils/capitalize";
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
  let text = "";
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
    navigation.navigate("NewOutfit", { outfit: props.outfit });
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
      refreshUser();
    }
  }
  function similarScreen() {
    navigation.navigate("Similar Outfits", { outfit: props.outfit });
  }
  function post() {
    navigation.navigate("Post", { type: "outfit", outfit: props.outfit });
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
        <Menu.Item onPress={similarScreen}>
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
        <Menu.Item onPress={post}>
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
        <Menu.Item onPress={() => props.setShowRatingModal(true)}>
          <Icon color="muted.800" as={AntDesign} name="staro" size="md" />
          <Text color="muted.800" fontSize="md" fontWeight="semibold">
            Rate Outfit
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
      setUri(imageData);
    }
    if (!props.item.imageName) return;
    get();
  }, []);

  return (
    <View style={{}}>
      {uri ? (
        <Image
          style={{
            width: props.dims.width,
            height: props.dims.height,
          }}
          source={{ uri: uri }}
          alt="image missing"
        />
      ) : (
        <IconImage item={props.item} />
      )}
    </View>
  );
}

function ItemImageArray(props) {
  const [cardLayout, setCardLayout] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    let c = 0;
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

  return (
    <View
      flex="1"
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
          <HStack flexWrap={"wrap"}>
            {Object.keys(props.outfit).map((slot) => {
              if (
                slot == "user" ||
                slot == "_id" ||
                slot == "id" ||
                slot == "styles" ||
                slot.includes("image") ||
                !props.outfit[slot] ||
                props.outfit[slot].length == 0
              ) {
                return;
              } else {
                return (
                  <>
                    {props.outfit[slot].map((item) => {
                      return (
                        <HStack
                          key={item._id}
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
                  </>
                );
              }
            })}
          </HStack>
        </View>
      )}
    </View>
  );
}

function OutfitImage(props) {
  const [uri, setUri] = useState(null);

  useEffect(() => {
    async function get() {
      const imageData = await getImage(props.outfit.imageName);
      setUri(imageData);
    }
    if (!props.outfit.imageName) return;
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
              resizeMode="cover"
              alt="image missing"
            />
          )}
        </View>
      ) : (
        <View
          flex="1"
          pb={props.spacer - 10}
          style={{ width: props.layout.width }}
        >
          <ItemImageArray outfit={props.outfit} />
        </View>
      )}
    </View>
  );
}

export default function OutfitCard(props) {
  const [rating, setRating] = useState(0);
  const outfit = flattenObj(props.outfit);
  if (!outfit["user"]) {
    console.log(outfit);
  }
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [name, setName] = useState(
    props.outfit?.name ? props.outfit.name : "Untitled Outfit"
  );
  const [layout, setLayout] = useState({});

  const toast = useToast();
  const updateName = async () => {
    setUpdatingName(true);
    let res = await editOutfit({ name: name }, props.outfit._id);
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
    <View
      shadow={!props.hideShadow ? "5" : "0"}
      borderTopRadius={!props.square ? "xl" : "none"}
      borderBottomRadius={!props.square ? "2xl" : "none"}
    >
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
        borderTopRadius={!props.square ? "xl" : "none"}
        borderBottomRadius={!props.square ? "2xl" : "none"}
        borderWidth={0.5}
        borderColor="gray.300"
        overflow={"hidden"}
      >
        <VStack
          position="relative"
          onLayout={(e) => {
            setLayout({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            });
          }}
        >
          {!props.info && (
            <View position={"absolute"} zIndex={5} top="2" right="1">
              <CardMenu
                flex={1}
                outfit={props.outfit}
                showRatingModal={showRatingModal}
                setShowRatingModal={setShowRatingModal}
              />
            </View>
          )}
          <View position={"relative"} zIndex={4} top={0} left={0}>
            <OutfitImage
              layout={layout}
              outfit={outfit}
              spacer={spacerHeight}
            />
          </View>

          <View
            onLayout={(e) => {
              setSpacerHeight(e.nativeEvent.layout.height);
            }}
            borderWidth={1}
            borderBottomWidth={0}
            borderColor="gray.300"
            backgroundColor="white"
            borderRadius={"2xl"}
            borderBottomRadius={props.square ? "none" : "2xl"}
            position={"absolute"}
            zIndex={5}
            bottom={-1}
            left={0}
            width="100%"
          >
            <VStack space={2} mx={2} mb={2} my={1}>
              {!props.info ? (
                <View>
                  <Input
                    rightElement={
                      updatingName ? (
                        <Spinner />
                      ) : (
                        <Icon as={Entypo} name="edit" size="lg" />
                      )
                    }
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
              <VStack space={2}>
                {Object.keys(outfit).map((slot) => {
                  if (
                    slot == "user" ||
                    slot == "_id" ||
                    slot == "id" ||
                    slot == "styles" ||
                    slot.includes("image") ||
                    !outfit[slot] ||
                    outfit[slot].length == 0
                  )
                    return;

                  return (
                    <HStack
                      key={slot}
                      mx={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <View>
                        <Text>{capitalize(slot)}</Text>
                      </View>

                      <HStack
                        space={2}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        {outfit[slot].map((item) => {
                          return (
                            <Button
                              key={item._id}
                              variant={"subtle"}
                              p={1}
                              style={{ flexShrink: 1 }}
                            >
                              {item.name ? item.name : getText(item)}
                            </Button>
                          );
                        })}
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>
            </VStack>
          </View>
        </VStack>
      </Box>
    </View>
  );
}
