import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  View,
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import tinycolor from 'tinycolor2';
import {LinearGradient, Haptic} from 'expo';
import axios from 'axios';


import {HueSlider, SaturationSlider} from 'react-native-color';

const color_to_hsla_string = ({h, s, l, a}) => {
  return `hsla(${h}, ${s * 100}%, ${l * 100}%, ${a})`;
}

const INITIAL_TOP_COLOR = {}

export default class App extends React.Component {
  state = {
    top_color: tinycolor('#00AAFF').toHsl(),
    bottom_color: tinycolor('#55FF00').toHsl(),
  };

  update_top_hue = h => this.setState({top_color: {...this.state.top_color, h}});
  update_top_saturation = s => this.setState({top_color: {...this.state.top_color, s}});

  update_bottom_hue = h => this.setState({bottom_color: {...this.state.bottom_color, h}});
  update_bottom_saturation = s => this.setState({bottom_color: {...this.state.bottom_color, s}});

  update_color = async () => {
    const {top_color, bottom_color} = this.state;
    const top_rgb = tinycolor.fromRatio(top_color).toRgb();
    const bottom_rgb = tinycolor.fromRatio(bottom_color).toRgb();

    Haptic.notification(Haptic.NotificationFeedbackType.Success)
    const scrollspeed = 1000;

    const payload = {
      color: [bottom_rgb, top_rgb],
      scrollspeed,
    }
    
    try {
      const {data} = await axios.post('http://192.168.1.45:5000/', payload)
    } catch (e) {
      console.log(e)
    }
  }

  render () {
    const {top_color, bottom_color} = this.state;
    const top_color_hsla = color_to_hsla_string(top_color);
    const bottom_color_hsla = color_to_hsla_string(bottom_color);

    return (
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          flex: 1,

        }}
      >
        <View
          style={{
            justifyContent: 'flex-end',
            backgroundColor: 'white',
            height: 150,
            flexGrow: 1,
            marginBottom: 10,
          }}
        >
          <HueSlider
            style={styles.sliderRow}
            gradientSteps={40}
            value={top_color.h}
            onValueChange={this.update_top_hue}
          />

        </View>


        <TouchableWithoutFeedback
          onLongPress={this.update_color}
          style={{
            backgroundColor: 'white',
          }}
        >
          <View
            style={{
              width: Dimensions.get('window').width,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LinearGradient
              colors={[top_color_hsla, bottom_color_hsla]}
              style={{
                width: 126,
                backgroundColor: 'red',
                borderRadius: 95,

                height: Dimensions.get('window').height - 300,
              }}
            />
          </View>
        </TouchableWithoutFeedback>

        <View
          style={{
            flexGrow: 1,
            backgroundColor: 'white',
            height: 200,
            justifyContent: 'flex-start',
          }}
        >

          <HueSlider
            style={styles.sliderRow}
            gradientSteps={40}
            value={bottom_color.h}
            onValueChange={this.update_bottom_hue}
          />
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingBottom: 32
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
  },
  sliderRow: {
    alignSelf: 'stretch',
    marginLeft: 12,
    marginTop: 12
  },
});

