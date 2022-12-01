import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  Pressable,
  ScrollView,
  Select,
  useToast,
  View,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import OutfitCard from "../components/OutfitCard";
import ToastAlert from "../components/ToastAlert";
import capitalize from "../utils/capitalize";
import ImageSelecter from "../utils/imageSelecter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/Auth";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";

function ItemPicker(props) {
  const { user } = useAuth();

  return (
    <View>
      <Modal
        size="full"
        isOpen={props.open}
        onClose={() => props.setOpen(false)}
      >
        <Modal.Content>
          <Modal.Header alignItems={"center"}>
            <Modal.CloseButton onPress={() => props.setOpen(false)} />
            <Heading>Items</Heading>
          </Modal.Header>
          <Modal.Body>
            <ScrollView>
              <View mx="2">
                <SearchBar hideFilter />
              </View>
              <VStack pt="3" space="3">
                {user?.wardrobe?.items?.map((item) => (
                  <Pressable
                    onPress={() => {
                      props.setItem(item);
                      props.setOpen(false);
                    }}
                    key={item._id}
                  >
                    <ItemCard info item={item} />
                  </Pressable>
                ))}
              </VStack>
            </ScrollView>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Box
        borderRadius="md"
        borderWidth={props.item ? 0 : 1}
        borderColor="muted.300"
      >
        <Pressable onPress={() => props.setOpen(true)}>
          {props.item ? (
            <ItemCard info item={props.item} />
          ) : (
            <VStack
              alignItems="center"
              height="sm"
              justifyContent="space-around"
            >
              <Icon
                as={MaterialCommunityIcons}
                name="selection-search"
                color="indigo.300"
                size="5xl"
              />
            </VStack>
          )}
        </Pressable>
      </Box>
    </View>
  );
}

function OutfitPicker(props) {
  const { user } = useAuth();

  return (
    <View>
      <Modal
        size="full"
        isOpen={props.open}
        onClose={() => props.setOpen(false)}
      >
        <Modal.Content>
          <Modal.Header alignItems={"center"}>
            <Modal.CloseButton onPress={() => props.setOpen(false)} />
            <Heading>Outfits</Heading>
          </Modal.Header>
          <Modal.Body>
            <ScrollView>
              <View mx="2">
                <SearchBar hideFilter />
              </View>
              <VStack pt="3" space="3">
                {user?.wardrobe?.outfits?.map((outfit) => (
                  <Pressable
                    onPress={() => {
                      props.setOutfit(outfit);
                      props.setOpen(false);
                    }}
                    key={outfit._id}
                  >
                    <OutfitCard info outfit={outfit} />
                  </Pressable>
                ))}
              </VStack>
            </ScrollView>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Box
        borderRadius="md"
        borderWidth={props.outfit ? 0 : 1}
        borderColor="muted.300"
      >
        <Pressable onPress={() => props.setOpen(true)}>
          {props.outfit ? (
            <OutfitCard info outfit={props.outfit} />
          ) : (
            <VStack
              alignItems="center"
              height="sm"
              justifyContent="space-around"
            >
              <Icon
                as={MaterialCommunityIcons}
                name="selection-search"
                color="indigo.300"
                size="5xl"
              />
            </VStack>
          )}
        </Pressable>
      </Box>
    </View>
  );
}

export default function PostScreen({ route, navigation }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const editing = route?.params?.post != undefined;
  const [submitting, setSubmitting] = useState(false);
  const [formData, setData] = useState(
    editing
      ? { ...route.params.post }
      : route.params.type == "clothing"
      ? {
          item: route.params?.item ? route.params.item : undefined,
        }
      : {
          outfit: route.params?.outfit ? route.params.outfit : undefined,
        }
  );

  async function addPost() {}
  async function editPost() {}

  const finish = async () => {
    if (!formData.image) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              status={"error"}
              colorScheme={"error"}
              title={"Post must contain an image!"}
            />
          );
        },
      });
      return;
    }
    if (route.params.type == "clothing" && !formData.item) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              status={"error"}
              colorScheme={"error"}
              title={"Post must contain an item!"}
            />
          );
        },
      });
      return;
    }
    if (route.params.type == "outfit" && !formData.outfit) {
      toast.show({
        render: () => {
          return (
            <ToastAlert
              status={"error"}
              colorScheme={"error"}
              title={"Post must contain an outfit!"}
            />
          );
        },
      });
      return;
    }
    setSubmitting(true);
    var res = editing
      ? await editPost(formData, route.params.post._id)
      : await addPost(formData);
    setSubmitting(false);
    toast.show({
      render: () => {
        return (
          <ToastAlert
            status={res === true ? "success" : "error"}
            colorScheme={res === true ? "success" : "error"}
            title={
              res === true
                ? "Item successfully " + (editing ? "updated" : "created") + "!"
                : "Failed to " +
                  (editing ? "update" : "create") +
                  " post, please try again."
            }
          />
        );
      },
    });
    if (res == true) {
      navigation.navigate("Wardrobe");
    }
  };

  useEffect(() => {
    if (editing) {
      navigation.setOptions({
        headerTitle: "Editing Post",
      });
    } else {
      navigation.setOptions({
        headerTitle: "New " + capitalize(route.params.type) + " Post",
      });
    }
  }, [route]);

  return (
    <ScrollView>
      <ImageSelecter
        image={formData?.image}
        setImage={(image) => setData({ ...formData, image: image })}
      />
      <VStack mx={5} space={2} paddingBottom={7}>
        <FormControl>
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Caption
          </FormControl.Label>
          <Input
            multiline
            defaultValue={formData["caption"]}
            onChangeText={(text) => setData({ ...formData, caption: text })}
            placeholder={"Caption"}
          />
        </FormControl>
        {route.params.type == "outfit" && (
          <FormControl>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Outfit
            </FormControl.Label>
            <OutfitPicker
              open={open}
              setOpen={setOpen}
              outfit={formData["outfit"]}
              setOutfit={(text) => setData({ ...formData, outfit: text })}
            />
          </FormControl>
        )}
        {route.params.type == "clothing" && (
          <FormControl>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Item
            </FormControl.Label>
            <ItemPicker
              open={open}
              setOpen={setOpen}
              item={formData["item"]}
              setItem={(text) => setData({ ...formData, item: text })}
            />
          </FormControl>
        )}
        <Button leftIcon={submitting && <Spinner />} onPress={() => finish()}>
          Submit
        </Button>
      </VStack>
    </ScrollView>
  );
}
