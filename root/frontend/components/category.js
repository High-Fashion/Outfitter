import React, { useState, Component } from "react";
import { Select, Box, VStack, Text, Button } from "native-base";

export default class Category extends React.Component {
  constructor() {
    super();
    categories = require("../assets/male-categories.json")["mens"];
    subCategory = "";
  }

  render() {
    return (
      <VStack space={3}>
        <Select
          placeholder="Select Item Type"
          onValueChange={(itemValue) => {
            subCategory = [itemValue];
            this.setState({ subCategory });
          }}
        >
          {Object.keys(categories).map((category) => (
            <Select.Item key={category} label={category} value={category} />
          ))}
        </Select>
        {subCategory != "" ? (
          <Select placeholder={"Select type of " + subCategory}>
            {Object.keys(categories[this.state.subCategory]).map((item) => (
              <Select.Item label={item} value={item} />
            ))}
          </Select>
        ) : null}
      </VStack>
    );
  }
}
