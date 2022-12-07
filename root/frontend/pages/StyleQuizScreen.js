/*https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/usage*/
/*https://snack.expo.dev/@mali_ai/react-native-dropdown-picker*/
import { Button, HStack, Input, Text, View, VStack } from "native-base";
import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from "../contexts/Auth";

function QuizScreen({ navigation: { navigate }, route }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [currentInput, setInput] = useState();
  const [items, setItems] = useState([
    { label: "Emo", value: "emo" },
    { label: "Goth", value: "goth", parent: "emo" },
    { label: "Punk", value: "punk", parent: "emo" },
    { label: "Grunge", value: "grunge", parent: "emo" },
    { label: "Rocker", value: "rocker", parent: "emo" },

    { label: "Urban", value: "urban" },
    { label: "Hipster", value: "hipster", parent: "urban" },
    { label: "Vintage", value: "vintage", parent: "urban" },
    { label: "Streetwear", value: "streetwear", parent: "urban" },
    { label: "Retro", value: "retro", parent: "urban" },
    { label: "Y2K", value: "y2k", parent: "urban" },

    { label: "Bohemian", value: "bohemian" },
    { label: "Hipster", value: "hispter", parent: "bohemian" },

    { label: "Athleisure", value: "athleisure" },
    { label: "Sporty", value: "sporty", parent: "athleisure" },

    { label: "Business Casual", value: "business_casual" },
    { label: "Minimalist", value: "minimalist", parent: "business_casual" },

    { label: "Surfer", value: "surfer" },
    { label: "Beachy", value: "beachy", parent: "surfer" },

    { label: "Country", value: "country" },
    { label: "Wild West", value: "wild_west", parent: "country" },
    { label: "Cottagecore", value: "cottagecore", parent: "country" },
    { label: "Fairycore", value: "fairycore", parent: "country" },
    { label: "Southern", value: "southern", parent: "country" },

    { label: "Geeky", value: "geeky" },
    { label: "Nerdy", value: "nerdy", parent: "geeky" },

    { label: "Preppy", value: "preppy" },
    { label: "Academia", value: "academia", parent: "preppy" },

    { label: "Haute", value: "haute" },

    { label: "K-Pop", value: "kpop" },

    { label: "Kawaii", value: "kawaii" },

    { label: "Biker", value: "biker" },

    { label: "Androgynous", value: "androgynous" },

    { label: "Casual", value: "casual" },
    { label: "loungewear", value: "loungewear", parent: "casual" },
  ]);

  const updateValue = (text) => {
    if (!text.includes("\n")) {
      setInput(text);
      return;
    }
    if (text == "\n") {
      setInput("");
      return;
    }
    setInput("");
    if (!styles.includes(text.replace(/(\r\n|\n|\r)/gm, "")))
      setStyles([...styles, text.replace(/(\r\n|\n|\r)/gm, "")]);
  };

  const removeStyle = (style) => {
    setStyles(
      styles.filter((value) => {
        return value != style;
      })
    );
  };

  const { user } = useAuth();
  const [styles, setStyles] = useState([]);
  const [completed, setCompleted] = useState(false);

  function complete(name) {
    const temp = completed;
    temp[name] = true;
    setCompleted(temp);
  }

  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    console.log("key");
    let complete = true;
    Object.keys(completed).forEach((key) => {
      console.log(key + " " + completed[key]);
      if (!completed[key]) complete = false;
    });
    setSetupComplete(complete);
  });

  async function finishSetup() {
    if (!setupComplete) return;
    let finished = await route.params.finish({
      styles: styles,
    });
    if (finished) {
      navigate("Root");
    }
  }

  return (
    <View>
      {user.firstName && (
        <Text>{user.firstName}, How would you describe your style?</Text>
      )}
      <VStack my={5} justifyContent="space-evenly" flex={1}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
          }}
        >
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            multiple={true}
            min={0}
            max={3}
            mode="BADGE"
            placeholder="Select Style"
          />

          <HStack space={1}>
            {styles.map((style) => (
              <StyleTag style={style} remove={() => removeStyle(style)} />
            ))}
          </HStack>
          <Input
            multiline={true}
            placeholder="Input style tags"
            value={currentInput}
            onChangeText={(text) => updateValue(text)}
          />
        </View>
      </VStack>
      <Button
        isDisabled={!setupComplete}
        onPress={() => {
          styles: styles;
          complete(styles);
          setStyles(styles);
          finishSetup();
        }}
      >
        Finish
      </Button>
    </View>
  );
}

export default QuizScreen;
