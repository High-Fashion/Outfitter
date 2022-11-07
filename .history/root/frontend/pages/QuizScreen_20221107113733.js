/*https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/usage*/
/*https://snack.expo.dev/@mali_ai/react-native-dropdown-picker*/
import { useAuth } from "../contexts/Auth";
import { useState,useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  VStack,
  HStack,
  Button,
  Input,
  HamburgerIcon,
} from "native-base";
import DropDownPicker from 'react-native-dropdown-picker';

function QuizScreen({ navigation: { navigate }, route }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [currentInput, setInput] = useState();
    const [items, setItems] = useState([
      {label: 'Emo', value: 'emo'},
      {label: 'Goth', value: 'goth', parent: 'emo'},
      {label: 'Punk', value: 'punk', parent: 'emo'},

      {label: 'Urban', value: 'urban'},
      {label: 'Hipster', value: 'hipster', parent: 'urban'},
      {label: 'Vintage', value: 'vintage', parent: 'urban'},
      {label: 'Streetwear', value: 'streetwear', parent: 'urban'},

      {label: 'Bohemian', value: 'bohemian'},

      {label: 'Surfer', value: 'surfer'},
      {label: 'Beach', value: 'beach', parent: 'surfer'},
      {label: 'Country', value: 'country'},

      {label: 'Geeky', value: 'geeky'},
      {label: 'Nerdy', value: 'nerdy', parent: 'geeky'},
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
    var complete = true;
    Object.keys(completed).forEach((key) => {
      console.log(key + " " + completed[key]);
      if (!completed[key]) complete = false;
    });
    setSetupComplete(complete);
  });

  async function finishSetup() {
    if (!setupComplete) return;
    var finished = await route.params.finish({
      styles: styles,
    });
    if (finished) {
      navigate("Media");
    }
  }


    return(
     <View>{user.firstName && <Text>{ user.firstName}, How would you describe your style?</Text>} 
       <VStack space={5} alignItems="center" flex={1}>

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

      <Input
        multiline={true}
        placeholder="Input style tags"
        value={currentInput}
        onChangeText={(text) => updateValue(text)}
      />
        </View>
        <Button
        isDisabled={!setupComplete}
        onPress={() => {
          finishSetup();
        }}
      >
        <Text>Finish</Text>
      </Button>
        </VStack>
     </View>
    );
}

export default QuizScreen;
