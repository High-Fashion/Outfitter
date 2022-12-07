import { useHeaderHeight } from "@react-navigation/elements";
import {
  FlatList,
  HStack,
  Pressable,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import Avatar from "../components/Avatar";
import FollowButton from "../components/FollowButton";
import { useAuth } from "../contexts/Auth";
import { ProfileHeader } from "./ProfileScreen";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

function UserList(props) {
  const { user } = useAuth();
  return (
    <VStack flex={1}>
      <FlatList
        style={{ width: width }}
        data={[...props.data]}
        renderItem={({ item }) => {
          return (
            <HStack
              key={item._id}
              flex={1}
              justifyContent="space-between"
              mr={4}
            >
              <HStack>
                <Avatar />
                <VStack>
                  <Text>{item.username}</Text>
                  <Text>{item.firstName + " " + item.lastName}</Text>
                </VStack>
              </HStack>
              {item.username != user.username && (
                <VStack justifyContent={"space-around"}>
                  <FollowButton user={item} />
                </VStack>
              )}
            </HStack>
          );
        }}
      />
    </VStack>
  );
}

function Indicator(props) {
  const inputRange = Object.keys(props.measurements).map((m) => m * width);
  const indicatorWidth = props.scrollX.interpolate({
    inputRange,
    outputRange: Object.keys(props.measurements).map(
      (measurement) => props.measurements[measurement].width
    ),
  });
  const translateX = props.scrollX.interpolate({
    inputRange,
    outputRange: Object.keys(props.measurements).map(
      (measurement) => props.measurements[measurement].x
    ),
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        backgroundColor: "#818cf8",
        height: 3,
        width: indicatorWidth,
        bottom: 0,
        left: 0,
        transform: [{ translateX }],
      }}
    />
  );
}

const Tab = (props) => {
  return (
    <Pressable
      onPress={props.onPress}
      onLayout={(e) => {
        props.setMeasurement(e.nativeEvent.layout);
      }}
    >
      <Text fontSize="md" fontWeight="medium">
        {props.label}
      </Text>
    </Pressable>
  );
};

function Tabs({ labels, setHeight, scrollX, onItemPress }) {
  const [measurements, setMeasurements] = useState({});

  useEffect(() => {
    console.log(measurements);
  }, [measurements]);

  return (
    <View
      onLayout={(e) => {
        setHeight(e.nativeEvent.layout.height);
      }}
      pb={2}
      borderBottomWidth={1}
      borderBottomColor="muted.400"
      flexDir={"row"}
      justifyContent="space-evenly"
    >
      {labels.map((item, index) => {
        return (
          <Tab
            key={index}
            onPress={() => onItemPress(index)}
            label={item.label}
            setMeasurement={(measurement) =>
              setMeasurements({ ...measurements, [item.id]: measurement })
            }
          />
        );
      })}
      {Object.keys(measurements).length === labels.length && (
        <Indicator measurements={measurements} scrollX={scrollX} />
      )}
    </View>
  );
}

export default function PeopleListScreen({ navigation, route }) {
  navigation.setOptions({
    header: ProfileHeader({
      goBack: navigation.goBack,
      self: route.params.self,
      username: route.params.username,
      hideSettings: true,
    }),
  });

  const labels =
    route?.params?.mutual?.length > 0
      ? [
          {
            id: 0,
            label: route?.params?.mutual?.length + " mutual",
          },
          {
            id: 1,
            label: route.params.followers.length + " followers",
          },
          {
            id: 2,
            label: route.params.following.length + " following",
          },
        ]
      : [
          {
            id: 0,
            label: route.params.followers.length + " followers",
          },
          {
            id: 1,
            label: route.params.following.length + " following",
          },
        ];

  const [secondHeaderHeight, setHeight] = useState(0);
  const headerHeight = useHeaderHeight();
  const initialScreen = ["mutual", "followers", "following"].indexOf(
    route.params.path
  );
  const scrollX = useRef(new Animated.Value(0)).current;

  const ref = useRef();

  const onItemPress = useCallback((itemIndex) => {
    ref?.current?.scrollTo({
      x: itemIndex * width,
    });
  });

  return (
    <VStack flex={1}>
      <Tabs
        scrollX={scrollX}
        setHeight={setHeight}
        labels={labels}
        onItemPress={onItemPress}
      />
      <ScrollView>
        <Animated.ScrollView
          ref={ref}
          horizontal={true}
          height={height - headerHeight - secondHeaderHeight}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentOffset={{
            y: 0,
            x:
              route?.params?.mutual?.length > 0
                ? initialScreen * width
                : (initialScreen - 1) * width,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        >
          {route?.params?.mutual?.length > 0 && (
            <UserList data={route.params.mutual} />
          )}
          <UserList data={route.params.followers} />
          <UserList data={route.params.following} />
        </Animated.ScrollView>
      </ScrollView>
    </VStack>
  );
}
