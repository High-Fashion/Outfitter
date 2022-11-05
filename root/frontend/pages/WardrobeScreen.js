import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  Fab,
  Input,
  SearchIcon,
  Icon,
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
  Badge,
  CloseIcon,
  AddIcon,
  Modal,
  FormControl,
  Checkbox,
  Image,
} from "native-base";
import { useAuth } from "../contexts/Auth";
import { SetupScreen } from "./SetupScreen";

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

function ItemCard(props) {
  return (
    <VStack alignItems="center">
      {props.item?.image && (
        <HStack marginBottom={-20} width="100%">
          <Image
            source={{
              uri: props.item.image,
            }}
            alt="Alternate Text"
            size="2xl"
          />
        </HStack>
      )}
      <HStack space={3}>
        <VStack space={3} flex={1}>
          <Text>
            {props.item.colors.primary} {props.item.material} {props.item.brand}{" "}
            {props.item.category}
          </Text>
          <HStack
            space={1}
            paddingX={1}
            justifyContent="space-between"
            flex={1}
          >
            <Button flex={2}>
              <Text>Edit</Text>
            </Button>
            <Button flex={1}>
              <Text>Delete</Text>
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
}

function ClothingList(props) {
  if (props.value.length == 0)
    return (
      <VStack alignItems="center">
        <Box p={20}>
          <Text bold>No items to display</Text>
        </Box>
      </VStack>
    );

  return (
    <VStack space={3}>
      {props.value.map((item) => {
        return (
          <Box key={item.name}>
            <ItemCard key={item._id} item={item} />
            <Divider />
          </Box>
        );
      })}
    </VStack>
  );
}

// [
//   {
//     name: "shoe 1",
//     category: "sneakers",
//     material: "leather",
//     colors: {
//       primary: "white",
//       secondary: "green",
//       tertiary: "gold",
//     },
//     brand: "adidas",
//     image:
//       "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9802edf99c4245149145ac5a01571e82_9366/Stan_Smith_Shoes_White_Q47226_01_standard.jpg",
//   },
//   {
//     name: "shirt 1",
//     category: "shirt",
//     material: "cotton",
//     colors: {
//       primary: "blue",
//       secondary: "white",
//       tertiary: "gold",
//     },
//     brand: "free people",
//   },
// ]

function getInitialData() {}

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
        <VStack space={1} paddingTop={1} w="100%">
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
      <Fab
        renderInPortal={false}
        shadow={2}
        size="lg"
        onPress={() => {
          console.log(itemList);
          navigation.navigate("NewItem");
        }}
        icon={<AddIcon color="white" size="xl" />}
      />
    </View>
  );
}
export default WardrobeScreen;
