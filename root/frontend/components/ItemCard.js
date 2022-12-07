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
  Spinner,
  Text,
  useContrastText,
  useToast,
  View,
  VStack,
} from "native-base";

import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dimensions, StyleSheet } from "react-native";

import { useEffect, useRef, useState } from "react";
import colors from "../assets/colors.json";
import { useAuth } from "../contexts/Auth";
import { deleteItem, editItem, getImage } from "../services/wardrobeService";
import capitalize from "../utils/capitalize";
import IconImage from "./IconImage";
import ToastAlert from "./ToastAlert";

const colorCodes = colors["codes"];

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 2;
const CARD_WIDTH = width - 50;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

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
  function post() {
    navigation.navigate("Post", { type: "clothing", item: props.item });
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
      </Menu>
    </View>
  );
}

function ColorButton({ color, index, last }) {
  const colorCode = colorCodes[color];
  const textColor = useContrastText(colorCode);
  return (
    <View py="0.5">
      <Button
        borderWidth={1}
        borderColor="muted.800"
        borderRadius="none"
        bgColor={colorCode}
        _text={{
          color: textColor,
        }}
        borderLeftRadius={index == 0 ? "2xl" : "none"}
        borderLeftWidth={index == 0 ? 1 : 0}
        variant="outline"
        borderRightRadius={last ? "2xl" : "none"}
        borderRightWidth={last ? 1 : 0}
        py={0.5}
        px={1.5}
        leftIcon={
          index == 0 && (
            <Icon
              as={Ionicons}
              name="color-palette-sharp"
              color={textColor}
              size="sm"
            />
          )
        }
      >
        {color}
      </Button>
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
    <View flex="1">
      {uri ? (
        <View>
          {props.layout && (
            <Image
              flex="1"
              style={{ width: props.layout.width, height: props.layout.height }}
              source={{ uri: uri }}
              resizeMode="cover"
              alt="image missing"
            />
          )}
        </View>
      ) : (
        <IconImage item={props.item} />
      )}
    </View>
  );
}

export default function ItemCard(props) {
  const [updatingName, setUpdatingName] = useState(false);
  const [layout, setLayout] = useState({});

  const getText = () => {
    let text = "";
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
    let res = await editItem({ name: name }, props.item._id);
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
      shadow={props.hideShadow ? "0" : "5"}
      borderTopRadius="xl"
      borderBottomRadius={"2xl"}
    >
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
        <VStack
          position="relative"
          height="sm"
          onLayout={(e) =>
            setLayout({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            })
          }
        >
          {!props.info && (
            <View position={"absolute"} zIndex={5} top="2" right="1">
              <CardMenu setDeleted={props.setDeleted} item={props.item} />
            </View>
          )}
          <View position={"absolute"} zIndex={4} top={0} left={0}>
            <ItemImage layout={layout} item={props.item} />
          </View>
          <View
            borderWidth={1}
            borderBottomWidth={0}
            borderColor="gray.300"
            backgroundColor="white"
            borderRadius={"2xl"}
            position={"absolute"}
            zIndex={5}
            bottom={-1}
            left={0}
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
                      <ColorButton
                        color={props.item.colors[rank]}
                        index={index}
                        key={rank}
                        last={
                          index == Object.keys(props.item.colors).length - 1
                        }
                      />
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
