import {
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
} from "native-base";

function TypeSelector() {
  return (
    <HStack space={3} justifyContent="center">
      <Button variant="ghost" borderRadius="full">
        <Heading size="md">Clothing</Heading>
      </Button>
      <Button variant="ghost" borderRadius="full">
        <Heading size="md">Accessories</Heading>
      </Button>
      <Button variant="ghost" borderRadius="full">
        <Heading size="md">Shoes</Heading>
      </Button>
    </HStack>
  );
}

function SearchBarArea() {
  return (
    <HStack space={1} padding={1}>
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
      <Button flex={1}>
        <Text>Filter</Text>
      </Button>
    </HStack>
  );
}

function SortBar() {
  const filters = ["Filter", "Tag", "List"];

  return (
    <HStack padding={1} space={3} justifyContent="space-between">
      <HStack space={2}>
        {filters.map((filter) => {
          return (
            <Box bg="blueGray.300" padding={0}>
              <HStack space={1} alignItems="center">
                <Text paddingBottom={1}>{filter}</Text>
                <Button variant="ghost" padding={0}>
                  <CloseIcon />
                </Button>
              </HStack>
            </Box>
          );
        })}
      </HStack>
      <Button>
        <Text>Sort Button</Text>
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

function ClothingList() {
  const itemList = [
    { name: "1sd" },
    { name: "ds2" },
    { name: "3sd" },
    { name: "4sd" },
    { name: "5sd" },
    { name: "6sd" },
    { name: "7sasdf" },
    { name: "1sadsdf" },
    { name: "assdf2" },
    { name: "assddf3" },
    { name: "assdf4" },
    { name: "5sadsdf" },
    { name: "assdf6" },
    { name: "assddf7" },
    { name: "asasdfsdfasd1" },
    { name: "sassddf2" },
    { name: "sasddf3" },
    { name: "sassddf4" },
    { name: "asdsfd5" },
    { name: "6assdadsdfsfsadf" },
    { name: "7asssdf" },
    { name: "1asdf" },
    { name: "asdsfd2" },
    { name: "asddsf3" },
    { name: "asddfs4" },
    { name: "5assddf" },
    { name: "asdsdf6" },
    { name: "asddsf7" },
  ];
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

function WardrobeScreen() {
  return (
    <ScrollView>
      <VStack space={1} paddingTop={1} w="100%">
        <TypeSelector />
        <Divider />
        <SearchBarArea />
        <Divider />
        <SortBar />
        <ClothingList />
      </VStack>
    </ScrollView>
  );
}
export default WardrobeScreen;
