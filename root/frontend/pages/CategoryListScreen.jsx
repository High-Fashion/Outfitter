import React, { useState } from "react";
import { Button, View, FlatList, Pressable } from "native-base";

import Card from "../components/card.jsx";

function CategoryListScreen({ navigation }) {
  const [DATA, setData] = useState(require("../assets/male-categories.json"));
  return (
    <View>
      {/* <Text>Data</Text> */}
      <FlatList
        contentContainerStyle={{ paddingBottom: "60%" }}
        columnWrapperStyle={{ justifyContent: "space-evenly", width: "100%" }}
        ItemSeparatorComponent={() => <View style={{ height: "2%" }} />}
        numColumns={2}
        data={Object.keys(DATA["mens"])}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("ItemList", {
                items: DATA["mens"][item],
                name: item,
              })
            }
          >
            <Card itemType={item} image={require("./../assets/hanger.png")} />
          </Pressable>
        )}
      />
      <Button
        onPress={() =>
          navigation.navigate("ItemList", { items: DATA["mens"][item] })
          // console.log(Object.keys(DATA["mens"]))
        }
      >
        Category Type of Item
      </Button>
    </View>
  );
}

export default CategoryListScreen;
