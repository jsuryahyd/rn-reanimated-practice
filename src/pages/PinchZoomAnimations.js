import React, {Component, createRef, useRef, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {
  PinchGestureHandler,
  PanGestureHandler,
  RotationGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const {event, block, Value, set, add, eq, cond, multiply} = Animated;

export class PinchZoomAnimations extends Component {
  constructor(props) {
    super(props);
    this.panRef = createRef();
    this.pinchRef = createRef();
    this.rotateRef = createRef();

    this.translateX = new Value(0);
    const offsetX = new Value(0);
    this.translateY = new Value(0);
    const offsetY = new Value(0);
    this.scale = new Value(1);
    const offsetZ = new Value(1);
    this.onPanGesture = event([
      {
        nativeEvent: ({translationX, translationY, state}) => {
          return block([
            set(this.translateX, add(offsetX, translationX)),
            set(this.translateY, add(offsetY, translationY)),
            cond(eq(State.END, state), [
              set(offsetX, add(offsetX, translationX)),
              set(offsetY, add(offsetY, translationY)),
            ]),
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
            cond(
              eq(State.END, state),
              set(this.scale, multiply(offsetZ, this.scale)),
            ),
          ]);
        },
      },
    ]);

    this.onRotation = event([
      {
        nativeEvent: ({translationX, translationY, State}) => {
          return block([]);
        },
      },
    ]);
  }

  render() {
    return (
      <View style={{flex: 1, ...StyleSheet.absoluteFill}}>
        <PanGestureHandler
          onGestureEvent={this.onPanGesture}
          onHandlerStateChange={this.onPanGesture}
          minDist={10}
          simultaneousHandlers={[this.pinchRef, this.rotateRef]}
          ref={this.panRef}>
          <Animated.View>
            <PinchGestureHandler
              ref={this.pinchRef}
              onGestureEvent={this.onPinchGesture}
              onHandlerStateChange={this.onPinchGesture}
              simultaneousHandlers={[this.panRef, this.rotateRef]}>
              <Animated.View>
                <RotationGestureHandler
                  ref={this.rotateRef}
                  onGestureEvent={this.onRotation}
                  onHandlerStateChange={this.onRotation}
                  simultaneousHandlers={[this.pinchRef, this.panRef]}>
                  <Animated.Image
                    source={require('../../assets/images/hr.jpg')}
                    style={{
                      width: 200,
                      height: 175,
                      transform: [
                        {
                          translateX: this.translateX,
                        },
                        {translateY: this.translateY},
                        {scale: this.scale},
                      ],
                    }}></Animated.Image>
                </RotationGestureHandler>
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}
