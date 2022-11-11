import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  Fab,
  Input,
  SearchIcon,
  VStack,
  HStack,
  Heading,
  View,
  Box,
  Text,
  Button,
  Divider,
  ScrollView,
  Center,
  CloseIcon,
  AddIcon,
  Modal,
  FormControl,
  Checkbox,
  SmallCloseIcon,
  Icon,
  Image,
  Badge,
} from "native-base";
import { useAuth } from "../contexts/Auth";

import ClothingList from "../components/ClothingList";

function TypeSelector() {
  const [selected, setSelected] = useState("clothing");
  return (
    <HStack space={3} justifyContent="center">
      <Button
        onPress={() => setSelected("clothing")}
        variant="ghost"
        borderRadius="full"
      >
        <Heading
          color={selected == "clothing" ? "blue.800" : "black"}
          size="md"
        >
          Clothing
        </Heading>
      </Button>
      <Button
        onPress={() => setSelected("accessories")}
        variant="ghost"
        borderRadius="full"
      >
        <Heading
          color={selected == "accessories" ? "blue.800" : "black"}
          size="md"
        >
          Accessories
        </Heading>
      </Button>
      <Button
        onPress={() => setSelected("shoes")}
        variant="ghost"
        borderRadius="full"
      >
        <Heading color={selected == "shoes" ? "blue.800" : "black"} size="md">
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
  var result = "";
  Object.keys(item).map((key) => {
    if (!["category", "material", "pattern", "brand"].includes(key)) return;
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

function SearchBarArea(props) {
  return (
    <>
      <HStack alignItems="center" space={1} padding={1}>
        <Input
          flex={6}
          placeholder="Search"
          size="md"
          borderRadius="10"
          py="1"
          px="2"
          InputLeftElement={
            <Center padding={1}>
              <SearchIcon />
            </Center>
          }
          value={props.searchQuery}
          onChangeText={(query) => props.setSearchQuery(query)}
        />
        <View flex={1}>
          <Button onPress={() => props.open()} borderRadius="md">
            <Text>Filter</Text>
          </Button>
        </View>
      </HStack>
    </>
  );
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
        <Text>Sort</Text>
      </Button>
    </HStack>
  );
}

function AddItemFab(props) {
  const { navigation } = props;
  const [open, setOpen] = useState(false);
  const types = [
    {
      name: "Clothing",
      image: require("../assets/icons/mens_clothing.png"),
      onPress: () => {
        navigation.navigate("NewItem", { type: "clothing" });
      },
    },
    {
      name: "Accessory",
      image: require("../assets/icons/mens_accessory.png"),
      onPress: () => {
        navigation.navigate("NewItem", { type: "accessory" });
      },
    },
    {
      name: "Shoes",
      image: require("../assets/icons/mens_shoes.png"),
      onPress: () => {
        navigation.navigate("NewItem", { type: "shoes" });
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
        {open &&
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
          setOpen(!open);
        }}
      >
        {open ? (
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
  const [searchQuery, setSearchQuery] = useState("");
  const { user, refreshUser } = useAuth();
  const isFocused = useIsFocused();

  const [itemList, setItemList] = useState(user.wardrobe.items);
  const [filteredItemList, setFilteredItemList] = useState(itemList);

  useEffect(() => {
    console.log("called");
    // Call only when screen open or when back on screen
    if (isFocused) {
      refreshUser();
    }
  }, [isFocused]);

  useEffect(() => {
    setItemList(user.wardrobe.items);
  }, [user]);

  useEffect(() => {
    if (!searchQuery || searchQuery == "") {
      setFilteredItemList(itemList);
      return;
    }
    const newItems = itemList.filter((item) => {
      const item_data = getItemString(item);
      console.log("Item", item);
      console.log("String", item_data);
      const input_data = searchQuery.toUpperCase();
      return item_data.includes(input_data);
    });
    setFilteredItemList(newItems);
  }, [itemList, searchQuery]);

  return (
    <View flex={1}>
      <SortOptionsModal
        show={showSortModal}
        close={() => setShowSortModal(false)}
      />
      <FilterOptionsModal
        show={showFilterModal}
        close={() => setShowFilterModal(false)}
      />
      <ScrollView>
        <VStack space={1} paddingTop={1} paddingBottom={10} w="100%">
          <TypeSelector />
          <Divider />
          <SearchBarArea
            open={() => setShowFilterModal(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            itemList={filteredItemList}
            setFilteredItemList={setFilteredItemList}
          />
          <Divider />
          <Text>{searchQuery}</Text>
          <SortBar open={() => setShowSortModal(true)} />
          <ClothingList value={filteredItemList} />
        </VStack>
      </ScrollView>
      <AddItemFab navigation={navigation} />
    </View>
  );
}
export default WardrobeScreen;
