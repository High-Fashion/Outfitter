import React, { Component, useState, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
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
  CloseIcon,
  IconButton,
  Center,
  SmallCloseIcon,
  Pressable,
} from "native-base";

import capitalize from "../utils/capitalize";
import { Dimensions } from "react-native";
import SearchBar from "./SearchBar";

const { width, height } = Dimensions.get("window");

function getCategories(type, gender) {
  if (type == undefined) return {};
  type = ["top", "bottoms", "one_piece"].includes(type) ? "clothing" : type;
  var categories = require("../assets/categories.json");
  var newCategories = {};
  gender.map((gender) => {
    newCategories = { ...newCategories, ...categories[type][gender] };
  });
  return newCategories;
}

function ListHeader(props) {
  return (
    <VStack
      pb={3}
      bgColor={"white"}
      borderBottomWidth="1"
      borderColor={"muted.300"}
    >
      <VStack px={2}>
        <HStack justifyContent={"space-between"} alignItems="center">
          <HStack flex={1} justifyContent="flex-start">
            <IconButton
              borderRadius="full"
              disabled={!props?.category}
              icon={props.category && <ArrowBackIcon size="lg" />}
              onPress={props.back}
            />
          </HStack>
          <Center flex={1}>
            <Heading>
              {capitalize(props?.category ? props.category : props.type, true)}
            </Heading>
          </Center>
          <HStack flex={1} justifyContent="flex-end">
            <IconButton
              borderRadius="full"
              onPress={props.close}
              icon={<CloseIcon size="lg" />}
            />
          </HStack>
        </HStack>
        <SearchBar
          hideFilter
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
        />
        {props?.subcategories && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack pt={2} space={1}>
              {props.subcategories.map((s) => {
                return (
                  <Button key={s} py={1} px={2} borderRadius="full">
                    {capitalize(s, true)}
                  </Button>
                );
              })}
            </HStack>
          </ScrollView>
        )}
      </VStack>
    </VStack>
  );
}

export default function CategoryPicker(props) {
  const { user } = useAuth();
  const categories = getCategories(props.type, user.wardrobe.gender);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [listOptions, setListOptions] = useState(Object.keys(categories));
  const [filteredListOptions, setFilteredListOptions] = useState(listOptions);

  useEffect(() => {
    if (props.category == null) {
      props.setSubcategories(null);
      setListOptions(Object.keys(categories));
    } else {
      setListOptions(Object.keys(categories[props.category]));
    }
    setSearchQuery("");
  }, [props.category]);

  useEffect(() => {
    if (searchQuery.length < 1) setFilteredListOptions(listOptions);
    const newList = listOptions.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredListOptions(newList);
  }, [searchQuery, listOptions]);

  function toggleSubcategory(subcategory) {
    if (!props?.subcategories) {
      props.setSubcategories([subcategory]);
    } else if (props.subcategories.includes(subcategory)) {
      props.setSubcategories(
        props.subcategories.filter((i) => i != subcategory)
      );
    } else {
      props.setSubcategories([...props.subcategories, subcategory]);
    }
  }

  return (
    <Select
      leftElement={
        props.category && (
          <HStack px={2} space={1}>
            <Button
              py={1}
              px={2}
              borderRadius="full"
              onPress={() => setOpen(true)}
            >
              {capitalize(props.category, true)}
            </Button>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {props?.subcategories?.map((s) => {
                return (
                  <Button
                    key={s}
                    variant="subtle"
                    py={1}
                    px={2}
                    borderRadius="full"
                    onPress={() => setOpen(true)}
                  >
                    {capitalize(s, true)}
                  </Button>
                );
              })}
            </ScrollView>
          </HStack>
        )
      }
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      key={props.rank}
      defaultValue={props.category}
      placeholder={!props.category ? "Select " + props.type + " type" : ""}
      _actionSheet={{ isOpen: open }}
      _actionSheetContent={{ px: 0 }}
      _actionSheetBody={{
        ListHeaderComponent: (
          <ListHeader
            type={
              props.type.charAt[props.type.length - 1] == "s"
                ? props.type
                : props.type + "s"
            }
            back={() => {
              props.setCategory(null);
            }}
            close={() => setOpen(false)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={props.category}
            subcategories={props.subcategories}
          />
        ),
        ListFooterComponent: (
          <Center>
            <Button borderRadius="full" onPress={() => setOpen(false)}>
              Finish
            </Button>
          </Center>
        ),
        stickyHeaderIndices: [0],
      }}
    >
      {filteredListOptions.map((option) => {
        return props.category == null ? (
          <Select.Item
            key={option}
            label={capitalize(option, true)}
            value={option}
            onPress={() => {
              props.setCategory(option);
            }}
            _stack={{
              alignItems: "center",
              mx: 4,
              pr: 2,
              justifyContent: "space-between",
            }}
            _text={{
              flex: 2,
              color: "black",
              padding: 1,
              fontSize: "xl",
            }}
            p={0}
          />
        ) : (
          <Select.Item
            rightIcon={props?.subcategories?.includes(option) && <CheckIcon />}
            key={option}
            label={capitalize(option, true)}
            value={option}
            onPress={() => toggleSubcategory(option)}
            _stack={{
              alignItems: "center",
              mx: 4,
              pr: 2,
              justifyContent: "space-between",
            }}
            _text={{
              flex: 2,
              color: "black",
              padding: 1,
              fontSize: "xl",
            }}
            p={0}
          />
        );
      })}
    </Select>
  );
}
