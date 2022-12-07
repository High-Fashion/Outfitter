import { useIsFocused } from "@react-navigation/native";
import {
  AddIcon,
  Box,
  Button,
  Checkbox,
  CloseIcon,
  Divider,
  FormControl,
  Heading,
  HStack,
  Image,
  Modal,
  ScrollView,
  SmallCloseIcon,
  Text,
  View,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../contexts/Auth";

import { SafeAreaView } from "react-native-safe-area-context";
import ClothingList from "../components/ClothingList";

function TypeSelector(props) {
  return (
    <HStack space={3} justifyContent="center">
      <Button
        onPress={() => props.setSelected("clothing")}
        variant="ghost"
        borderRadius="full"
      >
        <Heading
          color={props.selected == "clothing" ? "indigo.800" : "black"}
          size="md"
        >
          Clothing
        </Heading>
      </Button>
      <Button
        onPress={() => props.setSelected("accessory")}
        variant="ghost"
        borderRadius="full"
      >
        <Heading
          color={props.selected == "accessory" ? "indigo.800" : "black"}
          size="md"
        >
          Accessories
        </Heading>
      </Button>
      <Button
        onPress={() => props.setSelected("shoes")}
        variant="ghost"
        borderRadius="full"
      >
        <Heading
          color={props.selected == "shoes" ? "indigo.800" : "black"}
          size="md"
        >
          Shoes
        </Heading>
      </Button>
    </HStack>
  );
}

function FilterOptionsModal(props) {
  function updateFilterOptions() {
    props.close();
  }

  return (
    <Modal size="full" isOpen={props.show} onClose={() => props.close()}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Filters</Modal.Header>
        <Modal.Body>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Brand</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Color</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Pattern</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Material</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Fit</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button onPress={() => updateFilterOptions()}>Apply</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function getItemString(item) {
  let result = "";
  Object.keys(item).map((key) => {
    if (
      !["category", "material", "pattern", "brand", "fit", "name"].includes(key)
    )
      return;
    if (item[key]) {
      result += item[key];
    }
  });
  if (item.colors) {
    Object.keys(item.colors).map((color) => {
      if (item.colors[color]) {
        result += item.colors[color];
      }
    });
  }
  return result.toUpperCase();
}

function SortOptionsModal(props) {
  function updateSortOptions() {
    props.close();
  }

  return (
    <Modal size="full" isOpen={props.show} onClose={() => props.close()}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Sort By</Modal.Header>
        <Modal.Body>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Brand</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Color</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Pattern</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Material</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
          <FormControl>
            <HStack justifyContent="space-between" alignItems="center">
              <FormControl.Label>Fit</FormControl.Label>
              <Checkbox />
            </HStack>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button onPress={() => updateSortOptions()}>Apply</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function SortBar(props) {
  const [filters, setFilters] = useState(["Filter", "Tag", "List"]);

  function removeFilter(name) {
    const newFilters = filters.filter((filter) => filter != name);
    setFilters(newFilters);
  }

  return (
    <HStack padding={1} space={3} justifyContent="space-between">
      <HStack alignItems="center">
        {filters.map((filter) => {
          const remove = () => {
            removeFilter(filter);
          };
          return (
            <Box key={filter} mx="1" px="1" bg="blueGray.300" borderRadius="lg">
              <HStack space={1} alignItems="center">
                <Text paddingBottom={1}>{filter}</Text>
                <Button
                  onPress={() => remove()}
                  variant="ghost"
                  borderRadius="full"
                  padding={0}
                >
                  <CloseIcon size="sm" />
                </Button>
              </HStack>
            </Box>
          );
        })}
      </HStack>
      <Button borderRadius="lg" onPress={() => props.open()}>
        Sort
      </Button>
    </HStack>
  );
}

function AddItemFab(props) {
  const { navigation } = props;
  const { user } = useAuth();
  let gender = user.wardrobe.gender;
  if (gender.includes("mens") && !gender.includes("womens")) {
    gender = "mens";
  } else if (gender.includes("womens") && !gender.includes("mens")) {
    gender = "womens";
  } else {
    gender = "non-binary";
  }

  const topImage = () => {
    if (gender == "mens") {
      return require("../assets/icons/mens_top.png");
    }
    if (gender == "womens") {
      return require("../assets/icons/womens_top.png");
    }
    return [
      require("../assets/icons/mens_top.png"),
      require("../assets/icons/womens_top.png"),
    ][Math.random()];
  };

  const bottomImage = () => {
    if (gender == "mens") {
      return require("../assets/icons/mens_bottoms.png");
    }
    if (gender == "womens") {
      return require("../assets/icons/womens_bottoms.png");
    }
    return [
      require("../assets/icons/mens_bottoms.png"),
      require("../assets/icons/womens_bottoms.png"),
    ][Math.random()];
  };

  const onePieceImage = () => {
    if (gender == "mens") {
      return require("../assets/icons/mens_one_piece.png");
    }
    if (gender == "womens") {
      return require("../assets/icons/womens_one_piece.png");
    }
    return [
      require("../assets/icons/mens_one_piece.png"),
      require("../assets/icons/womens_one_piece.png"),
    ][Math.random()];
  };

  const accessoryImage = () => {
    if (gender == "mens") {
      return require("../assets/icons/mens_accessory.png");
    }
    if (gender == "womens") {
      return require("../assets/icons/womens_accessory.png");
    }
    return [
      require("../assets/icons/mens_accessory.png"),
      require("../assets/icons/womens_accessory.png"),
    ][Math.random()];
  };

  const shoesImage = () => {
    if (gender == "mens") {
      return require("../assets/icons/mens_shoes.png");
    }
    if (gender == "womens") {
      return require("../assets/icons/womens_shoes.png");
    }
    return [
      require("../assets/icons/mens_shoes.png"),
      require("../assets/icons/womens_shoes.png"),
    ][Math.random()];
  };

  const types = [
    {
      name: "Top",
      image: topImage,
      onPress: () => {
        navigation.navigate("Item", { type: "top" });
      },
    },
    {
      name: "Bottoms",
      image: bottomImage,
      onPress: () => {
        navigation.navigate("Item", { type: "bottoms" });
      },
    },
    {
      name: "One Piece",
      image: onePieceImage,
      onPress: () => {
        navigation.navigate("Item", { type: "one_piece" });
      },
    },
    {
      name: "Accessory",
      image: accessoryImage,
      onPress: () => {
        navigation.navigate("Item", { type: "accessory" });
      },
    },
    {
      name: "Shoes",
      image: shoesImage,
      onPress: () => {
        navigation.navigate("Item", { type: "shoes" });
      },
    },
  ];

  return (
    <VStack
      style={{ zIndex: 2, position: "absolute", right: 25, bottom: 20 }}
      alignItems={"flex-end"}
      space={2}
    >
      <VStack space={2} style={{ zIndex: 2, position: "relative", right: -5 }}>
        {props.open &&
          types.map((type) => {
            return (
              <Button
                borderRadius="full"
                key={type.name}
                p={3}
                shadow={5}
                onPress={type.onPress}
              >
                <Image
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                  source={type.image}
                  alt={"Add new " + type.name}
                ></Image>
                <Box
                  borderRadius={"full"}
                  backgroundColor={"white"}
                  borderWidth={1}
                  borderColor={"black"}
                  style={{
                    zIndex: 3,
                    position: "absolute",
                    bottom: -10,
                    right: -10,
                  }}
                  p={1}
                >
                  <AddIcon color={"black"} />
                </Box>
              </Button>
            );
          })}
      </VStack>
      <Button
        borderRadius={"full"}
        shadow={5}
        size="lg"
        onPress={() => {
          props.setOpen(!props.open);
        }}
      >
        {props.open ? (
          <SmallCloseIcon color="white" size="xl" />
        ) : (
          <AddIcon color="white" size="xl" />
        )}
      </Button>
    </VStack>
  );
}

function WardrobeScreen({ navigation }) {
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFAB, setShowFAB] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, refreshUser } = useAuth();
  const isFocused = useIsFocused();

  const [itemList, setItemList] = useState(user.wardrobe.items);
  const [selectedType, setSelectedType] = useState("clothing");
  const [filteredItemList, setFilteredItemList] = useState(itemList);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      refreshUser();
    }
  }, [isFocused]);

  useEffect(() => {
    setItemList(user.wardrobe.items);
  }, [user]);

  function compareType(item_type) {
    switch (item_type) {
      case "shoes":
        return selectedType == "shoes";
      case "accessory":
        return selectedType == "accessory";
      case "top":
      case "bottoms":
      case "one_piece":
        return selectedType == "clothing";
    }
  }

  useEffect(() => {
    const newItems = itemList.filter((item) => {
      if (!searchQuery || searchQuery == "") {
        return compareType(item.type);
      } else {
        const item_data = getItemString(item);
        console.log("Item", item);
        console.log("String", item_data);
        const input_data = searchQuery.toUpperCase();
        if (item_data.includes(input_data)) {
          return compareType(item.type);
        } else {
          return false;
        }
      }
    });
    setFilteredItemList(newItems);
  }, [itemList, searchQuery, selectedType]);

  function removeItem(item) {
    newlist = filteredItemList;
    newlist.filter((i) => i._id != item._id);
    setFilteredItemList(newlist);
  }

  return (
    <SafeAreaView flex={1}>
      <SortOptionsModal
        show={showSortModal}
        close={() => setShowSortModal(false)}
      />
      <FilterOptionsModal
        show={showFilterModal}
        close={() => setShowFilterModal(false)}
      />
      <ScrollView onTouchStart={() => setShowFAB(false)}>
        <VStack space={1} paddingTop={1} paddingBottom={10} w="100%">
          <TypeSelector selected={selectedType} setSelected={setSelectedType} />
          <Divider />
          <View mx={2} pt={1}>
            <SearchBar
              hideFilter
              open={() => setShowFilterModal(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              itemList={filteredItemList}
              setFilteredItemList={setFilteredItemList}
            />
          </View>
          {false && <SortBar open={() => setShowSortModal(true)} />}
          <View mx="2">
            <ClothingList removeItem={removeItem} value={filteredItemList} />
          </View>
        </VStack>
      </ScrollView>
      <AddItemFab
        flex="1"
        open={showFAB}
        setOpen={setShowFAB}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}
export default WardrobeScreen;
