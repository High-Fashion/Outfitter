import React, { Component, useState, useEffect } from "react";
import {
  Button,
  Image,
  Box,
  HStack,
  VStack,
  Text,
  FormControl,
  Input,
  Checkbox,
  ScrollView,
  Select,
  Divider,
  AddIcon,
  Modal,
  Icon,
  DeleteIcon,
  CheckCircleIcon,
  View,
  ChevronDownIcon,
  ArrowBackIcon,
  Heading,
  Spinner,
  useToast,
  CheckIcon,
  useContrastText,
  IconButton,
  Center,
} from "native-base";
import colors from "../assets/colors.json";
import SearchBar from "./SearchBar";
import capitalize from "../utils/capitalize";
import { Dimensions, Keyboard } from "react-native";
const colorList = colors.list;
const colorCodes = colors.codes;

function ListHeader(props) {
  return (
    <VStack
      pb={3}
      bgColor={"white"}
      borderBottomWidth="1"
      borderColor={"muted.300"}
    >
      <VStack px={3} alignItems={"center"}>
        <Heading>Colors</Heading>
        <SearchBar
          hideFilter
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
        />
      </VStack>
    </VStack>
  );
}

export default function ColorSelect(props) {
  const [open, setOpen] = useState(false);

  const [listOptions, setListOptions] = useState(Object.keys(colorCodes));
  const [filteredListOptions, setFilteredListOptions] = useState(listOptions);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.length < 1) setFilteredListOptions(listOptions);
    const newList = listOptions.filter((option) => {
      if (option.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
    });
    setFilteredListOptions(newList);
  }, [searchQuery]);

  return (
    <Select
      flex={1}
      key={props.rank}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        setSearchQuery("");
      }}
      placeholder={!props.color ? "Select " + props.rank + " color" : ""}
      leftElement={
        props.color && (
          <HStack px={2} space={1}>
            <Button
              py={1}
              px={2}
              borderRadius="full"
              bgColor={colorCodes[props.color]}
              _text={{ color: useContrastText(colorCodes[props.color]) }}
              onPress={() => setOpen(true)}
            >
              {props.color}
            </Button>
          </HStack>
        )
      }
      _item={{
        _stack: {
          alignItems: "center",
          justifyContent: "space-around",
        },
        padding: 2,
      }}
      _actionSheet={{ isOpen: open }}
      _actionSheetContent={{
        padding: 0,
      }}
      _actionSheetBody={{
        ListHeaderComponent: (
          <ListHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={props.category}
            subcategories={props.subcategories}
          />
        ),
        stickyHeaderIndices: [0],
      }}
    >
      {filteredListOptions.map((color) => {
        return (
          <Select.Item
            key={color}
            label={color}
            value={color}
            _text={{
              color: useContrastText(colorCodes[color]),
            }}
            onPress={() => {
              props.setColor(color);
              setOpen(false);
            }}
            bgColor={colorCodes[color]}
          />
        );
      })}
    </Select>
  );
}
