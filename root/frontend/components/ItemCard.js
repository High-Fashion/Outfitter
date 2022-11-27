import {
  HStack,
  Image,
  Text,
  View,
  VStack,
  Button,
  Box,
  Divider,
  Heading,
  IconButton,
  Icon,
  Menu,
  Modal,
  AlertDialog,
  useToast,
  Skeleton,
  Spinner,
  CloseIcon,
  Alert,
  Center,
  Input,
  useContrastText,
} from "native-base";

import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Feather,
} from "@expo/vector-icons";

import capitalize from "../utils/capitalize";
import { deleteItem } from "../services/wardrobeService";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/Auth";
import ToastAlert from "./ToastAlert";
import colors from "../assets/colors.json";

const colorCodes = colors["codes"];

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 2;
const CARD_WIDTH = width - 50;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
import { editItem } from "../services/wardrobeService";

const getIcon = (category, subcategories) => {
  switch (category) {
    case "skirts":
      return require("../assets/clothing_icons/pleated_skirt_outline.png");
    case "heels":
      return require("../assets/clothing_icons/heels_outline.png");
    case "pants":
    case "jeans":
      return require("../assets/clothing_icons/jeans_outline.png");
    case "shirts":
      return require("../assets/clothing_icons/polo_outline.png");
    case "hoodies":
      return require("../assets/clothing_icons/hoodie_outline.png");
    case "sweaters":
      return require("../assets/clothing_icons/sweater_outline.png");
    case "shorts":
      return require("../assets/clothing_icons/shorts_outline.png");
    case "coats & jackets":
      switch (subcategories) {
        case subcategories.contains("peacoat"):
          return require("../assets/clothing_icons/coat_outline.png");
        case subcategories.contains("puffer"):
          return require("../assets/clothing_icons/puffy_jacket_outline.png");
        default:
          return require("../assets/clothing_icons/pocket_jacket_outline.png");
      }
    case "suits":
    case "blazers & sport coats":
      return require("../assets/clothing_icons/suit_jacket_outline.png");
    case "dresses":
      return require("../assets/clothing_icons/dress_outline.png");
    case "tops":
      return require("../assets/clothing_icons/bralette_outline.png");
    case "hats":
      return require("../assets/clothing_icons/hat_outline.png");
    case "glasses":
      return require("../assets/clothing_icons/glasses_outline.png");
    case "boots":
    case "flats":
    case "sandals":
    case "sneakers":
      return require("../assets/clothing_icons/sneaker_outline.png");
    case "jewelry":
      switch (subcategories) {
        default:
        case subcategories.contains("watch"):
          return require("../assets/clothing_icons/watch_outline.png");
      }
    case "swimwear":
    case "belts":
    case "formal":
    case "bags":
    case "other":
    case "hair":
    default:
      return "";
  }
};

function ItemIcon(props) {
  return (
    <VStack overflow={"hidden"} alignItems={"center"} height={"3xs"}>
      <Image
        resizeMode="contain"
        tintColor={colorCodes[props.item.colors.primary]}
        alt="image missing"
        source={getIcon(props.item.category, props.item.subcategories)}
      />
    </VStack>
  );
}

function ItemImage(props) {
  return (
    <View>
      {props.item.image ? (
        <Image alt="image missing" />
      ) : (
        <ItemIcon item={props.item} />
      )}
    </View>
  );
}

function CardMenu(props) {
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
    const response = await deleteItem(props.item._id);
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
            Are you sure you want to delete this item?
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
            Edit Item
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
            Delete Item
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
            Add to New Outfit
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

export default function ItemCard(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  const { user } = useAuth();

  const getText = () => {
    var text = "";
    if (props.item.colors) {
      if (props.item.colors.primary) text += props.item.colors.primary;
      if (props.item.colors.tertiary) {
        text +=
          ", " +
          props.item.colors.secondary +
          ", and " +
          props.item.colors.tertiary;
      } else if (props.item.colors.secondary) {
        text += " and " + props.item.colors.secondary;
      }
    }
    if (props.item.category)
      text +=
        " " +
        props.item.category.charAt(0).toUpperCase() +
        props.item.category.slice(1);
    return text;
  };

  const [name, setName] = useState(
    props.item?.name ? props.item.name : getText()
  );

  const toast = useToast();

  const updateName = async () => {
    setUpdatingName(true);
    var res = await editItem({ name: name }, props.item._id);
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
    <View shadow="5" mx={2} borderTopRadius="xl" borderBottomRadius={"2xl"}>
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
          <View position={"absolute"} zIndex={2} top="2" right="1">
            <CardMenu
              setDeleted={props.setDeleted}
              flex={1}
              setIsLoaded={setIsLoaded}
              item={props.item}
            />
          </View>
          <ItemImage item={props.item} />
          <View
            borderWidth={1}
            borderBottomWidth={0}
            borderColor="gray.300"
            borderRadius={"2xl"}
          >
            <VStack space={2} mx={2} mb={2} my={1}>
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
              <HStack flexWrap={"wrap"} space={1}>
                <View py="0.5">
                  <Button
                    borderRadius="2xl"
                    variant="solid"
                    py={0.5}
                    px={1.5}
                    leftIcon={
                      <Icon as={MaterialIcons} name="category" size="sm" />
                    }
                  >
                    {capitalize(props.item.category, true)}
                  </Button>
                </View>
                <HStack
                  space={0}
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  {Object.keys(props.item.colors).map((rank, index) => {
                    return (
                      <View py="0.5" key={rank}>
                        <Button
                          borderWidth={1}
                          borderColor="muted.800"
                          borderRadius="none"
                          bgColor={colorCodes[props.item.colors[rank]]}
                          _text={{
                            color: useContrastText(
                              colorCodes[props.item.colors[rank]]
                            ),
                          }}
                          borderLeftRadius={index == 0 ? "2xl" : "none"}
                          borderLeftWidth={index == 0 ? 1 : 0}
                          variant="outline"
                          borderRightRadius={
                            index == Object.keys(props.item.colors).length - 1
                              ? "2xl"
                              : "none"
                          }
                          borderRightWidth={
                            index == Object.keys(props.item.colors).length - 1
                              ? 1
                              : 0
                          }
                          py={0.5}
                          px={1.5}
                          leftIcon={
                            index == 0 && (
                              <Icon
                                as={Ionicons}
                                name="color-palette-sharp"
                                color={useContrastText(
                                  colorCodes[props.item.colors[rank]]
                                )}
                                size="sm"
                              />
                            )
                          }
                        >
                          {props.item.colors[rank]}
                        </Button>
                      </View>
                    );
                  })}
                </HStack>
                {Object.entries({
                  brand: <Icon as={Entypo} name="price-tag" size="sm" />,
                  material: <Icon as={Ionicons} name="md-cut" size="sm" />,
                  pattern: (
                    <Icon
                      as={MaterialCommunityIcons}
                      name="checkerboard"
                      size="sm"
                    />
                  ),
                  fit: (
                    <Icon
                      as={MaterialCommunityIcons}
                      name="tailwind"
                      size="sm"
                    />
                  ),
                }).map(([meta, icon]) => {
                  return (
                    props.item[meta] && (
                      <View py="0.5" key={meta}>
                        <Button
                          borderRadius="2xl"
                          variant="subtle"
                          py={0.5}
                          px={1.5}
                          leftIcon={icon}
                        >
                          {capitalize(props.item[meta])}
                        </Button>
                      </View>
                    )
                  );
                })}
                {props.item.subcategories.map((subcategory, index) => {
                  return (
                    <View py="0.5" key={subcategory}>
                      <Button
                        borderRadius={"2xl"}
                        variant="outline"
                        py={0.5}
                        px={1.5}
                      >
                        {capitalize(subcategory, true)}
                      </Button>
                    </View>
                  );
                })}
              </HStack>
            </VStack>
          </View>
        </VStack>
      </Box>
    </View>
  );

  // return (
  //   <View>
  //     <VStack alignItems="center">
  //       {props.item.image && <View style={styles.card}>
  //         <Image
  //           source={{ uri: props.item.image }}
  //           style={styles.cardImage}
  //           resizeMode="cover"
  //           alt="No image..."
  //         ></Image>
  //       </View>}
  //       <View style={styles.cardDescription(props)}>
  //         <HStack justifyContent={"flex-start"}>
  //           <Button size="md" variant="ghost" onPress={() =>
  //             {navigation.navigate("EditItem", {type: "clothing", item: props.item})}}>
  //           </Button>
  //         </HStack>
  //         <VStack space={2} alignItems="center">
  //           <Text numberOfLines={1} style={styles.cardtitle}>
  //             {getText(props.item)}
  //           </Text>
  //           {(!props.hideButtons || props.hideButtons == false) && (
  //             <HStack space={2}>
  //               <TouchableOpacity
  //                 onPress={() => {}}
  //                 style={[styles.button1, {}]}
  //               >
  //                 <Text textAlign="center" lineHeight={30}>
  //                   Item Details
  //                 </Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 onPress={() => {}}
  //                 style={[styles.button2, {}]}
  //               >
  //                 <Text textAlign="center" lineHeight={30} fontSize={12}>
  //                   Delete Item
  //                 </Text>
  //               </TouchableOpacity>
  //             </HStack>
  //           )}
  //         </VStack>
  //       </View>
  //     </VStack>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: "#102f42",
    borderWidth: 2,
    height: 220,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    borderTopRightRadius: 13,
    borderTopLeftRadius: 13,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  cardtitle: {
    fontSize: 20,
    marginTop: 10,
    //fontWeight: "bold",
  },
  cardDescription: (props) => ({
    height: 80,
    alignItems: "center",
    fontSize: 20,
    color: "#478bb5",
    width: CARD_WIDTH,
    borderTopLeftRadius: props.item.image ? 0 : 15,
    borderTopRightRadius: props.item.image ? 0 : 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "#aed0e6",
    borderWidth: 2,
    borderColor: "#102f42",
    marginLeft: 20,
    marginRight: 20,
  }),

  button1: {
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    width: 250,
    height: 33,
    borderColor: "#102f42",
    backgroundColor: "#478bb5",
    borderRadius: 40,
  },

  button2: {
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    width: 75,
    height: 33,
    borderColor: "#102f42",
    backgroundColor: "#478bb5",
    borderRadius: 40,
  },
  // editButton: {
  //   top: 0,
  //   right: 0,
  // },
});
