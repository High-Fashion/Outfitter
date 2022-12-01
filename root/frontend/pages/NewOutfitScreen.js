import React, { useState, useEffect } from "react";
import {
  Spinner,
  Button,
  VStack,
  Text,
  ScrollView,
  Box,
  HStack,
  Modal,
  Heading,
  View,
  Checkbox,
  Divider,
  Icon,
  useToast,
} from "native-base";
import { useAuth } from "../contexts/Auth";
import ClothingList from "../components/ClothingList";
import Model from "../components/Model";
import capitalize from "../utils/capitalize";
import { addOutfit } from "../services/wardrobeService";
import ImageSelecter from "../utils/imageSelecter";
import ItemCard from "../components/ItemCard";
import { Pressable } from "react-native";
const clothingSlots = require("../assets/clothing_slots.json");
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ToastAlert from "../components/ToastAlert";

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

function ItemSearchModal(props) {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (item) => {
    if (!selected.map((i) => i._id).includes(item._id)) {
      setSelected([...selected, item]);
    } else {
      var newSelect = selected.filter((i) => i._id != item._id);
      setSelected(newSelect);
    }
    console.log(selected);
  };

  return (
    <Modal size="full" isOpen={props.open}>
      <Modal.Content>
        <Modal.CloseButton onPress={props.close} />
        <Modal.Header>Clothing</Modal.Header>
        <Modal.Body>
          <ScrollView>
            <VStack space={3}>
              {props.clothing.map((item) => {
                console.log(item.type);
                if (props.slot == "torso" && item.type != "top") return;
                if (props.slot == "feet" && item.type != "shoes") return;
                if (props.slot == "legs" && item.type != "bottoms") return;
                if (
                  !["torso", "feet", "legs"].includes(props.slot) &&
                  item.type != "accessory"
                )
                  return;
                return (
                  <Pressable onPress={() => toggleSelect(item)} key={item._id}>
                    <View
                      borderRadius="lg"
                      borderBottomRadius="2xl"
                      borderWidth={selected.includes(item) ? 2 : 0}
                      borderColor={"indigo.400"}
                    >
                      <ItemCard hideShadow selected info item={item} />
                    </View>
                  </Pressable>
                );
              })}
            </VStack>
          </ScrollView>
        </Modal.Body>
        <Modal.Footer>
          <HStack flex="1" justifyContent="space-between">
            <Button onPress={() => setSelected([])}>Clear</Button>
            <Button
              onPress={() => {
                props.addItem([...selected], props.slot);
                setSelected([]);
                props.close();
              }}
            >
              Add Selected Items
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function SlotModal(props) {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    setOpen(props.slot != null);
  }, [props.slot]);

  const clear = () => {
    props.inSlot.map((i) => {
      props.removeItem(i, props.slot);
    });
  };

  return (
    <View>
      <ItemSearchModal
        close={() => setOpenSearch(false)}
        open={openSearch}
        clothing={props.clothing}
        addItem={props.addItem}
        slot={props.slot}
      />
      <Modal size="full" isOpen={open}>
        <Modal.Content>
          <Modal.CloseButton onPress={() => props.setSlot(null)} />
          <Modal.Header alignItems="center">
            <Heading>{capitalize(props.slot, true)}</Heading>
          </Modal.Header>
          <Modal.Body>
            <Pressable onPress={() => setOpenSearch(true)}>
              <VStack space={3}>
                {props.inSlot && props.inSlot.length > 0 ? (
                  props.inSlot.map((item) => {
                    return <ItemCard hideShadow selected info item={item} />;
                  })
                ) : (
                  <Box
                    borderRadius="lg"
                    borderColor="muted.300"
                    borderWidth="1"
                  >
                    <VStack
                      alignItems="center"
                      justifyContent="space-around"
                      height="xs"
                    >
                      <View alignItems="center">
                        <Icon
                          as={MaterialCommunityIcons}
                          name="selection-search"
                          color="indigo.300"
                          size="5xl"
                        />
                        <Text color="indigo.300">
                          {"Add item to " + props.slot}
                        </Text>
                      </View>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Pressable>
          </Modal.Body>
          <Modal.Footer>
            <HStack flex={1} justifyContent="space-between">
              <Button onPress={clear}>Clear</Button>
              <Button onPress={() => props.setSlot(null)}>Finish</Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
}

function depopulate(outfit) {
  var newOutfit = {};
  Object.keys(outfit).map((slot) => {
    var newSlot = outfit[slot].map((item) => item._id);
    newOutfit[slot] = newSlot;
  });
  return newOutfit;
}

function NewOutfitScreen({ navigation, route }) {
  const { user, refreshUser } = useAuth();
  const editing = route?.params?.outfit != undefined;
  console.log(route.params.outfit);
  const [outfit, setOutfit] = useState(
    editing ? { ...route.params.outfit } : {}
  );
  const [image, setImage] = useState(undefined);
  const [slot, setSlot] = useState();
  const [submitting, setSubmitting] = useState(false);

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
    if (item.category)
      text +=
        " " + item.category.charAt(0).toUpperCase() + item.category.slice(1);
    return text;
  };

  const addItem = (items, slot) => {
    setOutfit({ ...outfit, [slot]: [...items] });
  };

  const removeItem = (item, slot) => {
    setOutfit({ ...outfit, [slot]: outfit[slot].filter((i) => i != item) });
  };
  const toast = useToast();

  const finish = async () => {
    setSubmitting(true);
    var res = editing
      ? await editOutfit(depopulate(outfit), image, route.params.item._id)
      : await addOutfit(depopulate(outfit), image);
    setSubmitting(false);
    toast.show({
      render: () => {
        return (
          <ToastAlert
            status={res === true ? "success" : "error"}
            colorScheme={res === true ? "success" : "error"}
            title={
              res === true
                ? "Outfit successfully " +
                  (editing ? "updated" : "created") +
                  "!"
                : "Failed to " +
                  (editing ? "update" : "create") +
                  " outfit, please try again."
            }
          />
        );
      },
    });
    if (res == true) {
      navigation.navigate("Outfits");
      refreshUser();
    }
  };

  return (
    <ScrollView>
      <ImageSelecter image={image} setImage={(image) => setImage(image)} />
      {slot && (
        <SlotModal
          slot={slot}
          setSlot={setSlot}
          addItem={addItem}
          removeItem={removeItem}
          clothing={user.wardrobe.items}
          inSlot={outfit[slot]}
        />
      )}
      <VStack>
        <Model setSlot={setSlot} navigation={navigation} />
        <Divider />
        <VStack space={2} pt={5}>
          {Object.keys(flattenObj(outfit)).map((slot) => {
            if (slot.includes("image")) return;
            if (
              slot == "user" ||
              slot == "_id" ||
              slot == "id" ||
              !outfit[slot] ||
              outfit[slot]?.length == 0
            )
              return;
            return (
              <HStack mx={3} alignItems="center" justifyContent="space-between">
                <View>
                  <Text>{capitalize(slot)}</Text>
                </View>
                {outfit[slot].map((item) => {
                  console.log(item);
                  return (
                    <Button variant={"subtle"} p={1} style={{ flexShrink: 1 }}>
                      {item.name ? item.name : getText(item)}
                    </Button>
                  );
                })}
              </HStack>
            );
          })}
        </VStack>
        <Button isLoading={submitting} m={7} onPress={() => finish()}>
          Submit
        </Button>
      </VStack>
    </ScrollView>
  );
}

export default NewOutfitScreen;
