import React, {Component} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

import Animated from 'react-native-reanimated';
import {State, PanGestureHandler} from 'react-native-gesture-handler';

const {Value, event, cond, eq, set, add} = Animated;
export class FollowingItems extends Component {
  constructor(props) {
    super(props);

    this.dragX = new Value(0);
    this.dragY = new Value(0);
    this.vX = new Value(0);
    this.vY = new Value(0);
    this.panState = new Value(-1);

    this.posX = new Value(0);
    this.offsetX = new Value(0);

    this.posY = new Value(0);
    this.offsetY = new Value(0);

    this.onDrag = event([
      {
        nativeEvent: {
          translationX: this.dragX,
          translationY: this.dragY,
          velocityX: this.vX,
          velocityY: this.vY,
          state: this.panState,
        },
      },
    ]);

    this.transX = cond(
      eq(State.ACTIVE, this.panState),
      [set(this.posX, add(this.offsetX, this.dragX))],
      [set(this.offsetX, this.posX), this.posX],
    );

    this.transY = cond(
      eq(State.ACTIVE, this.panState),
      [set(this.posY, add(this.offsetY, this.dragY))],
      [set(this.offsetY, this.posY), this.posY],
    );
  }

  render() {
    return (
      <View style={{flex: 1, ...StyleSheet.absoluteFill}}>
        <PanGestureHandler
          onGestureEvent={this.onDrag}
          onHandlerStateChange={this.onDrag}>
          <Animated.Image
            source={require('../../assets/images/hr.jpg')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              transform: [{translateX: this.transX}, {translateY: this.transY}],
            }}></Animated.Image>
        </PanGestureHandler>
      </View>
    );
  }
}
