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


import {HueSlider, SaturationSlider} from 'react-native-color';

const color_to_hsla_string = ({h, s, l, a}) => {

  return `hsla(${h}, ${s * 100}%, ${l * 100}%, ${a})`;
}

export default class App extends React.Component {
  state = {
    modalVisible: false,
    recents: ['#247ba0', '#70c1b3', '#b2dbbf', '#f3ffbd', '#ff1654'],
    top_color: tinycolor('#70c1b3').toHsl(),
    bottom_color: tinycolor('#70c1b3').toHsl(),
  };

  update_top_hue = h => this.setState({top_color: {...this.state.top_color, h}});
  update_top_saturation = s => this.setState({top_color: {...this.state.top_color, s}});

  update_bottom_hue = h => this.setState({bottom_color: {...this.state.bottom_color, h}});
  update_bottom_saturation = s => this.setState({bottom_color: {...this.state.bottom_color, s}});

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

          <SaturationSlider
            style={styles.sliderRow}
            gradientSteps={20}
            value={top_color.s}
            color={top_color}
            onValueChange={this.update_top_saturation}
          />
        </View>


        <TouchableWithoutFeedback
          onLongPress={() =>
            Haptic.notification(Haptic.NotificationFeedbackType.Success)
          }
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
          <SaturationSlider
            style={styles.sliderRow}
            gradientSteps={20}
            value={bottom_color.s}
            color={bottom_color}
            onValueChange={this.update_bottom_saturation}
          />

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

