import { useState } from "react";
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
} from "native-base";

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

function SearchBarArea(props) {
  return (
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
      />
      <View flex={1}>
        <Button onPress={() => props.open()} borderRadius="md">
          <Text>Filter</Text>
        </Button>
      </View>
    </HStack>
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
    <HStack space={3}>
      <Box
        maxW="80"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="4"
      >
        Item Picture
      </Box>
      <VStack space={3} flex={1}>
        <Text>{props.item.name}</Text>
        <HStack space={1} paddingX={1} justifyContent="space-between" flex={1}>
          <Button flex={2}>
            <Text>Edit</Text>
          </Button>
          <Button flex={1}>
            <Text>Delete</Text>
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
}

function ClothingList(props) {
  const [itemList, setItemList] = useState([]);

  if (itemList.length == 0)
    return (
      <VStack alignItems="center">
        <Box p={20}>
          <Text bold>No items to display</Text>
        </Box>
      </VStack>
    );

  return (
    <VStack space={3}>
      {itemList.map((item) => {
        return (
          <>
            <ItemCard key={item.name} item={item} />
            <Divider />
          </>
        );
      })}
    </VStack>
  );
}

function WardrobeScreen({ navigation }) {
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

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
          <SearchBarArea open={() => setShowFilterModal(true)} />
          <Divider />
          <SortBar open={() => setShowSortModal(true)} />
          <ClothingList />
        </VStack>
      </ScrollView>
      <Fab
        renderInPortal={false}
        shadow={2}
        size="lg"
        onPress={() => navigation.navigate("NewItem")}
        icon={<AddIcon color="white" size="xl" />}
      />
    </View>
  );
}
export default WardrobeScreen;
