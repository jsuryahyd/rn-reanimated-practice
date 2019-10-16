import React, {Component, createRef, useRef, useState} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import {
  PinchGestureHandler,
  PanGestureHandler,
  RotationGestureHandler,
  State,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const {
  event,
  block,
  Value,
  set,
  add,
  eq,
  cond,
  multiply,
  debug,
  concat,
} = Animated;

class PinchZoomAnimations extends Component {
  panRef = createRef();
  pinchRef = createRef();
  rotateRef = createRef();
  constructor(props) {
    super(props);

    this.translateX = new Value(0);
    const offsetX = new Value(0);

    this.translateY = new Value(0);
    const offsetY = new Value(0);
    this.scale = new Value(1);
    const offsetZ = new Value(1);
    const initialRotation = new Value(0);
    this.rotation = new Value(0);

    this.onPanGesture = event([
      {
        nativeEvent: values => {
          const {translationX, translationY, state} = values;
          return block([
            cond(
              eq(State.ACTIVE, state),
              [
                set(this.translateX, add(offsetX, translationX)),
                set(this.translateY, add(offsetY, translationY)),
              ],
              // [debug('lsakdjfl', state)],
            ),
            cond(
              eq(State.END, state),
              [
                set(offsetX, add(offsetX, translationX)),
                set(offsetY, add(offsetY, translationY)),
              ],
              // [debug('lsakdjfl', state)],
            ),
          ]);
        },
      },
    ]);

    this.onPinchGesture = event([
      {
        nativeEvent: ({scale, state}) => {
          return block([
            cond(
              eq(State.ACTIVE, state),
              set(this.scale, multiply(scale, offsetZ)),
            ),
            cond(eq(State.END, state), [
              set(offsetZ, multiply(offsetZ, scale)),
            ]),
          ]);
        },
      },
    ]);

    this.onRotation = event([
      {
        nativeEvent: ({rotation, state}) => {
          console.table(rotation, state);
          return block([
            cond(
              eq(State.ACTIVE, state),

              [
                set(this.rotation, add(initialRotation, rotation)),
                // set(initialRotation, add(initialRotation, this.rotation)),
                this.rotation,
              ],
            ),
            cond(eq(State.END, state), [
              set(initialRotation, add(initialRotation, rotation)),

              // this.rotation,
            ]),
            // debug('this.rotation', this.rotation),
            // debug('initialRotation', initialRotation),
            // debug('rotation', rotation),
          ]);
        },
      },
    ]);

    this.reset = () => {
      //  return block([
      //     set(this.scale, 1),
      //     set(this.rotation, 0),
      //     set(this.translateX, 0),
      //     set(this.translateY, 0),
      //     debug("wtf",this.rotation)
      //   ]);
      this.scale.setValue(1);
      this.rotation.setValue(0);
      this.translateX.setValue(0);
      this.translateY.setValue(0);

      offsetX.setValue(0);
      offsetY.setValue(0);
      offsetZ.setValue(1);
      initialRotation.setValue(0);
    };
  }

  render() {
    return (
      <View style={{flex: 1, ...StyleSheet.absoluteFill,justifyContent:"center",alignItems:"center"}}>
        <PanGestureHandler
          onGestureEvent={this.onPanGesture}
          onHandlerStateChange={this.onPanGesture}
          minDist={100}
          simultaneousHandlers={[this.pinchRef, this.rotateRef]}
          ref={this.panRef}>
          <Animated.View
            style={{
              // borderWidth: 1,
              // borderColor: 'blue',
              transform: [
                {
                  translateX: this.translateX,
                },
                {translateY: this.translateY},
                {
                  scale: this.scale,
                },
                {
                  rotate: this.rotation,
                },
              ],
              width: 200,
              height: 175,
            }}>
            <PinchGestureHandler
              ref={this.pinchRef}
              onGestureEvent={this.onPinchGesture}
              onHandlerStateChange={this.onPinchGesture}
              simultaneousHandlers={[this.panRef, this.rotateRef]}>
              <Animated.View style={{flex: 1, width: '100%'}}>
                <RotationGestureHandler
                  ref={this.rotateRef}
                  onGestureEvent={this.onRotation}
                  onHandlerStateChange={this.onRotation}
                  simultaneousHandlers={[this.pinchRef, this.panRef]}>
                  <Animated.Image
                    source={require('../../assets/images/mrs_maisel.jpeg')}
                    style={{
                      width: 200,
                      height: 175,
                    }}
                    resizeMode="cover"></Animated.Image>
                </RotationGestureHandler>
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>

        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 80,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{padding: 20, borderWidth: 1, zIndex: 10}}
            onPress={this.reset}>
            <Text style={{textAlign: 'center'}}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

PinchZoomAnimations.navigationOptions = ({navigation}) => {
  return {
    headerLeft: (
      <Text
        style={{paddingHorizontal: 10}}
        onPress={() => {
          // alert('opne derawer');
          // DrawerActions.openDrawer();
          // navigation.navigate("DrawerOpen");
          navigation.openDrawer();
        }}>
        Menu
      </Text>
    ),
  };
};
export default PinchZoomAnimations;
