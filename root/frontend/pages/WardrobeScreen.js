import { useEffect, useState } from "react";
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
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";

const { width} = Dimensions.get("window");
const CARD_WIDTH = width-50;


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
  const onChangeSearch = (query) => {
    props.setSearchQuery(query);
    props.setItemList([
      {
        name: "shoe 1",
        category: "sneakers",
        material: "leather",
        colors: {
          primary: "white",
          secondary: "green",
          tertiary: "gold",
        },
        brand: "adidas",
      },
      {
        name: "shirt 1",
        category: "shirt",
        material: "cotton",
        colors: {
          primary: "blue",
          secondary: "white",
          tertiary: "gold",
        },
        brand: "free people",
      },
    ]);
    if (query) {
      const newItems = props.itemList.filter((item) => {
        const item_data = item.name.toUpperCase();
        const input_data = query.toUpperCase();
        return item_data.indexOf(input_data) > -1;
      });
      props.setItemList(newItems);
    } else {
      console.log("string doesn't exist, look into it");
    }
  };
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
          onChangeText={(query) => onChangeSearch(query)}
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

  return(
    <View>
      <VStack alignItems='center'>
        <View style={styles.card}>
          <Image
            source={{uri: props.item.image}}
            style={styles.cardImage}
            resizeMode="cover">
          </Image>
        </View>
        <View style={styles.cardDescription}>
          <VStack space={2} alignItems="center">
            <Text numberOfLines={1} style={styles.cardtitle}>{props.item.colors.primary} {props.item.material} {props.item.type}</Text>
            <HStack space={2}>
              <TouchableOpacity 
                onPress={() => {}}
                style={[styles.button1, {}]}>
                <Text textAlign="center" lineHeight={30}>Item Details</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {}}
                style={[styles.button2, {}]}>
                <Text textAlign='center'lineHeight={30} fontSize={12}>Delete Item</Text>
              </TouchableOpacity>
           </HStack>
          </VStack>
        </View>
      </VStack>
    </View>
  )
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
            <ItemCard key={item.name} item={item} />
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

function WardrobeScreen({ navigation }) {
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const [itemList, setItemList] = useState(user.wardrobe.items);

  useEffect(() => {
    setItemList(user.wardrobe.items);
  });

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
            itemList={itemList}
            setItemList={setItemList}
          />
          <Divider />
          <Text>{searchQuery}</Text>
          <SortBar open={() => setShowSortModal(true)} />
          <ClothingList value={itemList} />
        </VStack>
      </ScrollView>
      <Fab
        renderInPortal={false}
        shadow={2}
        size="lg"
        onPress={() => {
          console.log(itemList);
          navigation.navigate("NewItem")
        }}
        icon={<AddIcon color="white" size="xl" />}
      />
    </View>
  );
}
export default WardrobeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: '#102f42',
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
  cardDescription: {
    height: 80,
    alignItems: 'center',
    fontSize: 20,
    color: "#478bb5",
    width: CARD_WIDTH,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#aed0e6',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#102f42',
    marginLeft: 20,
    marginRight: 20,
  },

  button1: {
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    width: 250,
    height: 33,
    borderColor: '#102f42',
    backgroundColor: '#478bb5',
    borderRadius: 40,
  },

  button2: {
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    width: 75,
    height: 33,
    borderColor: '#102f42',
    backgroundColor: '#478bb5',
    borderRadius: 40,
  }
})