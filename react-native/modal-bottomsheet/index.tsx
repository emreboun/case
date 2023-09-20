import "react-native-gesture-handler";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  BackHandler,
  Dimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

export const PRIMARY_COLOR = "#001A72";
export const ACCENT_COLOR = "#782AEB";
export const BACKGROUND_COLOR = "transparent";
export const BORDER_COLOR = "#C1C6E5";
export const BACKDROP_COLOR = "rgba(0, 0, 0, 0.3)";
export const HEIGHT = 360;
export const OVERDRAG = 20;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  isOpen: boolean;
  toggleSheet: () => void;
  children?: JSX.Element | JSX.Element[];
}

export const ModalBottomSheet: React.FC<Props> = ({
  children,
  isOpen,
  toggleSheet,
}) => {
  useEffect(() => {
    offset.value = 0;
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [isOpen]);

  // Custom back button handler for Android
  const handleBackButton = () => {
    if (!isOpen) {
      return false;
    } else {
      toggleSheet();
      return true;
    }
  };

  const offset = useSharedValue(0);
  const screenHeight = Dimensions.get("window").height;
  const topThreshold = screenHeight / 3;

  const pan = Gesture.Pan()
    .onChange((event) => {
      console.log(event);
      const offsetDelta = event.changeY + offset.value;

      const clamp = Math.max(-OVERDRAG, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < topThreshold) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(topThreshold + 130, {}, () => {
          runOnJS(toggleSheet)();
        });
      }
    });

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const toggle = () => {
    toggleSheet();
  };

  return (
    <View
      style={[
        styles.container,
        isOpen
          ? {
              height: "100%",
              width: "100%",
            }
          : {},
      ]}
    >
      {isOpen && (
        <>
          <AnimatedPressable
            style={styles.backdrop}
            entering={FadeIn}
            exiting={FadeOut}
            onPress={toggle}
          />

          <GestureDetector gesture={pan}>
            <Animated.View
              style={[styles.sheet, translateY]}
              entering={SlideInDown.springify().damping(15)}
              exiting={SlideOutDown}
            >
              <View style={styles.line}></View>

              {children}

              <View style={{ height: 26 }} />
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: BACKGROUND_COLOR,
  },
  line: {
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: "lightgrey",
    height: 6,
    width: 72,
    alignSelf: "center",
  },
  sheet: {
    backgroundColor: "#fff",
    paddingTop: 4,
    width: "100%",
    position: "absolute",
    bottom: -OVERDRAG * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP_COLOR,
    zIndex: 1,
  },
});
