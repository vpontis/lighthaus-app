import React, { useState } from "react";
import { StyleSheet, Dimensions, View, ActivityIndicator } from "react-native";
import { Icon } from "react-native-elements";
import tinycolor from "tinycolor2";
import * as Haptic from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

import { HueSlider } from "react-native-color";

const color_to_hsla_string = ({ h, s, l, a }) => {
  return `hsla(${h}, ${s * 100}%, ${l * 100}%, ${a})`;
};

const IP_ADDRESS = "192.168.1.6";
const LIGHTHAUS_ADDRESS = `http://${IP_ADDRESS}:5000/`;
const PLAY_SPEED = 0.004;
const FASTFORWARD_SPEED = 0.015;

const LighthausPreview = ({ top_color_hsla, bottom_color_hsla }) => (
  <View
    style={{
      width: Dimensions.get("window").width,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <LinearGradient
      colors={[top_color_hsla, bottom_color_hsla]}
      style={{
        width: 126,
        backgroundColor: "red",
        borderRadius: 60,

        height: Dimensions.get("window").height - 300
      }}
    />
  </View>
);

const ControlBar = ({ update_color, is_loading }) => {
  if (is_loading) {
    return (
      <View
        style={{
          marginTop: 40,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-start"
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start"
      }}
    >
      <Icon
        name="stop"
        type="font-awesome"
        size={26}
        color="black"
        onPress={() => update_color(0.0)}
        onLongPress={() => update_color(0.0)}
      />
      <Icon
        name="play"
        type="font-awesome"
        size={26}
        color="black"
        onPress={() => update_color(PLAY_SPEED)}
        onLongPress={() => update_color(PLAY_SPEED)}
      />
      <Icon
        name="fast-forward"
        type="font-awesome"
        size={26}
        color="black"
        onPress={() => update_color(FASTFORWARD_SPEED)}
        onLongPress={() => update_color(FASTFORWARD_SPEED)}
      />
    </View>
  );
};

const App = () => {
  const [top_color, set_top_color] = useState(tinycolor("#00AAFF").toHsl());
  const [bottom_color, set_bottom_color] = useState(
    tinycolor("#55FF00").toHsl()
  );
  const [is_loading, set_is_loading] = useState(false);

  const update_top_hue = h => set_top_color({ ...top_color, h });
  const update_bottom_hue = h => set_bottom_color({ ...bottom_color, h });

  const update_color = async (scroll_speed = 0.05) => {
    set_is_loading(true);

    const top_rgb = tinycolor.fromRatio(top_color).toRgb();
    const bottom_rgb = tinycolor.fromRatio(bottom_color).toRgb();

    const payload = {
      color: [bottom_rgb, top_rgb],
      scroll_speed
    };
    console.log("sending thing...", payload);

    try {
      const { data } = await axios.post(LIGHTHAUS_ADDRESS, payload);
      console.log("resp", data, payload);
      await Haptic.notificationAsync(Haptic.NotificationFeedbackType.Success);
    } catch (e) {
      console.error("error", e);
    }

    set_is_loading(false);
  };

  const top_color_hsla = color_to_hsla_string(top_color);
  const bottom_color_hsla = color_to_hsla_string(bottom_color);

  return (
    <View
      style={{
        backgroundColor: "white",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-between",
        flex: 1
      }}
    >
      <View
        style={{
          justifyContent: "flex-end",
          backgroundColor: "white",
          height: 80,
          marginBottom: 10
        }}
      >
        <HueSlider
          style={styles.sliderRow}
          gradientSteps={40}
          value={top_color.h}
          onValueChange={update_top_hue}
        />
      </View>

      <LighthausPreview
        top_color_hsla={top_color_hsla}
        bottom_color_hsla={bottom_color_hsla}
      />

      <View
        style={{
          backgroundColor: "white",
          height: 150,
          justifyContent: "flex-start"
        }}
      >
        <HueSlider
          style={styles.sliderRow}
          gradientSteps={40}
          value={bottom_color.h}
          onValueChange={update_bottom_hue}
        />

        <ControlBar update_color={update_color} is_loading={is_loading} />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 32,
    paddingBottom: 32
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6
  },
  sliderRow: {
    alignSelf: "stretch",
    marginLeft: 12,
    marginTop: 12
  }
});
