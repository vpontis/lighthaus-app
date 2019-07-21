import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { Icon } from "react-native-elements";
import tinycolor from "tinycolor2";
import * as Haptic from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

import { HueSlider } from "react-native-color";

const color_to_hsla_string = ({ h, s, l, a }) => {
  return `hsla(${h}, ${s * 100}%, ${l * 100}%, ${a})`;
};

const LIGHTHAUS_ADDRESS = "http://192.168.1.5:5000/";
const PLAY_SPEED = 0.004;
const FASTFORWARD_SPEED = 0.015;

export default class App extends React.Component {
  state = {
    top_color: tinycolor("#00AAFF").toHsl(),
    bottom_color: tinycolor("#55FF00").toHsl()
  };

  update_top_hue = h =>
    this.setState({ top_color: { ...this.state.top_color, h } });
  update_top_saturation = s =>
    this.setState({ top_color: { ...this.state.top_color, s } });

  update_bottom_hue = h =>
    this.setState({ bottom_color: { ...this.state.bottom_color, h } });
  update_bottom_saturation = s =>
    this.setState({ bottom_color: { ...this.state.bottom_color, s } });

  update_color = async (scroll_speed = 0.05) => {
    const { top_color, bottom_color } = this.state;
    const top_rgb = tinycolor.fromRatio(top_color).toRgb();
    const bottom_rgb = tinycolor.fromRatio(bottom_color).toRgb();

    const payload = {
      color: [bottom_rgb, top_rgb],
      scroll_speed
    };
    console.log("sending thing...");

    try {
      const { data } = await axios.post(LIGHTHAUS_ADDRESS, payload);
      console.log("resp", data, payload);
      await Haptic.notificationAsync(Haptic.NotificationFeedbackType.Success);
    } catch (e) {
      console.log("error", e);
    }
  };

  render() {
    const { top_color, bottom_color } = this.state;
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
            onValueChange={this.update_top_hue}
          />
        </View>

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
            onValueChange={this.update_bottom_hue}
          />

          <View
            style={{
              marginTop: 40,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "flex-start"
            }}
          >
            {/*<Text onPress={() => this.update_color(0.0)}>*/}
            {/*  Send*/}
            {/*</Text>*/}

            <Icon
              name="stop"
              type="font-awesome"
              size={26}
              color="black"
              onPress={() => this.update_color(0.0)}
              onLongPress={() => this.update_color(0.0)}
            />
            <Icon
              name="play"
              type="font-awesome"
              size={26}
              color="black"
              onPress={() => this.update_color(PLAY_SPEED)}
              onLongPress={() => this.update_color(PLAY_SPEED)}
            />
            <Icon
              name="fast-forward"
              type="font-awesome"
              size={26}
              color="black"
              onPress={() => this.update_color(FASTFORWARD_SPEED)}
              onLongPress={() => this.update_color(FASTFORWARD_SPEED)}
            />
          </View>
        </View>
      </View>
    );
  }
}

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
