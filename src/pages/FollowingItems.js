import React, {Component} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

import Animated from 'react-native-reanimated';
import {State, PanGestureHandler} from 'react-native-gesture-handler';

const BOX_SIZE = 100;

const {
  Value,
  event,
  Clock,
  startClock,
  clockRunning,
  stopClock,
  cond,
  eq,
  set,
  add,
  block,
  spring,
} = Animated;

function follow(value) {
  const config = {
    damping: 28,
    mass: 0.3,
    stiffness: 188,
    overshootClamping: false,
    toValue: value,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  };

  const state = {
    finished: new Value(0),
    position: new Value(0),
    velocity: new Value(0),
    time: new Value(0),
  };

  const clock = new Clock();

  return block([
    cond(clockRunning(clock), 0, startClock(clock)),
    spring(clock, state, config), //stops clock when animation is complete
    state.position,
  ]);
}

//todo:keep the items from goign off screen
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

    // this.transX = cond(
    //   eq(State.ACTIVE, this.panState),
    //   [set(this.posX, add(this.offsetX, this.dragX))],
    //   [set(this.offsetX, this.posX), this.posX],
    // );

    // this.transY = cond(
    //   eq(State.ACTIVE, this.panState),
    //   [set(this.posY, add(this.offsetY, this.dragY))],
    //   [set(this.offsetY, this.posY), this.posY],
    // );

    //alternatively for fluidity when dragEnds,
    const state = {
      finished: new Value(0),
      time: new Value(0),
      velocity: this.vX,
      position: new Value(0),
    };

    const config = {
      damping: 12,
      stiffness: 150,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
      overshootClamping: false,
      toValue: state.position,
      mass: 1,
    };

    const clock = new Clock();

    this.transX = cond(
      eq(State.ACTIVE, this.panState),
      [stopClock(clock), set(this.posX, add(this.offsetX, this.dragX))],
      cond(
        eq(this.panState, State.UNDETERMINED),
        0,
        set(this.posX, [
          cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.velocity, this.vX),
            set(state.position, this.posX),
            startClock(clock),
          ]),
          spring(clock, state, config),
          cond(state.finished, stopClock(clock)),
          set(this.offsetX, this.posX),
          state.position,
        ]),
      ),
    );

    this.transY = cond(
      eq(State.ACTIVE, this.panState),
      [set(this.posY, add(this.offsetY, this.dragY))],
      [set(this.offsetY, this.posY), this.posY],
    );

    this.transX1 = follow(this.transX);
    this.transY1 = follow(this.transY);

    this.transX2 = follow(this.transX1);
    this.transY2 = follow(this.transY1);

    this.transX3 = follow(this.transX2);
    this.transY3 = follow(this.transY2);
  }

  render() {
    return (
      <View style={{flex: 1, ...StyleSheet.absoluteFill}}>
        <Animated.Image
          source={require('../../assets/images/hr.jpg')}
          style={{
            ...styles.box,
            transform: [{translateX: this.transX1}, {translateY: this.transY1}],
          }}></Animated.Image>
        <Animated.Image
          source={require('../../assets/images/bp.jpg')}
          style={{
            ...styles.box,
            transform: [{translateX: this.transX2}, {translateY: this.transY2}],
          }}></Animated.Image>
        <Animated.Image
          source={require('../../assets/images/tl.jpg')}
          style={{
            ...styles.box,
            transform: [{translateX: this.transX3}, {translateY: this.transY3}],
          }}></Animated.Image>
        <PanGestureHandler
          onGestureEvent={this.onDrag}
          onHandlerStateChange={this.onDrag}>
          <Animated.Image
            source={require('../../assets/images/hr.jpg')}
            style={{
              ...styles.box,
              transform: [{translateX: this.transX}, {translateY: this.transY}],
            }}></Animated.Image>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    width: BOX_SIZE,
    height: BOX_SIZE,
    alignSelf: 'center',
    borderColor: '#F5FCFF',
    borderRadius: BOX_SIZE / 2,
    // margin: BOX_SIZE / 2,
    resizeMode: 'cover',
  },
});
