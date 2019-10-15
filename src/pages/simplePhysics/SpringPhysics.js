import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {State, PanGestureHandler} from 'react-native-gesture-handler';
const {
  event,
  Value,
  abs,
  cond,
  eq,
  lessThan,
  greaterThan,
  set,
  add,
  debug,
  multiply,
  Clock,
  diff,
  divide,
  startClock,
  stopClock,
  lessOrEq,
  greaterOrEq,
  sub,
} = Animated;

function damping(dt, velocity, mass = 1, damping = 12) {
  const acc = divide(multiply(-1, damping, velocity), mass);
  return set(velocity, add(velocity, multiply(dt, acc)));
}

function springForce(dt, position, velocity, anchor, mass = 1, tension = 300) {
  const distance = sub(position, 0);
  const acc = divide(multiply(-1, tension, distance), mass);
  return set(velocity, add(velocity, multiply(dt, acc)));
}

function stopClockWhenNeeded(dt, position, velocity, clock) {
  const df = diff(position);
  const noMovementFrames = new Value(0);

  return cond(
    lessThan(abs(df), 1e-3),
    [
      set(noMovementFrames, add(noMovementFrames, 1)),
      debug('No movement frame number ', noMovementFrames),
      cond(greaterThan(noMovementFrames, 5), [
        stopClock(clock),
        debug('-------------------clock stopped', clock),
      ]),
    ],
    set(noMovementFrames, 0),
  );
}

function springInteraction(transX, gestureState) {
  const start = new Value(0);
  const isDragging = new Value(0);
  const position = new Value(0);
  const velocity = new Value(0);
  const anchor = new Value(0);
  const clock = new Clock();
  const dt = divide(diff(clock), 1000);
  const mult = multiply(velocity, dt);

  return cond(
    eq(gestureState, State.ACTIVE),
    [
      cond(eq(isDragging, 0), [set(isDragging, 1), set(start, position)]),
      stopClock(clock),
      set(anchor, add(start, transX)),
      springForce(dt, position, velocity, anchor),
      // debug('velocity after spring force ', velocity),
      //resistance of sprint
      damping(dt, velocity,1,50),

      //spring effect b/w finger and box
      // springForce(dt, position, velocity, 0,1,10),
      // damping(dt, velocity),
      dt,
      // debug('start is ', start),
      // debug('transX : ', transX),
      set(position, add(start, transX)),
    ],
    [
      set(isDragging, 0), //dragging stopped
      startClock(clock), //start the clock, that runs the automatic backward motion

      // debug('clock running --------------------------------', clock),
      springForce(dt, position, velocity, 0),
      // debug('velocity after spring force ', velocity),
      damping(dt, velocity),
      // debug('velocity after damping ', velocity),
      stopClockWhenNeeded(dt, position, velocity, clock),
      // debug('position before', position),
      set(position, add(position, mult)),
      // debug('dt', dt),
      // debug('position after', position),
    ],
  );
}

export class SpringPhysics extends Component {
  gestureState = new Value(-1);
  gestureX = new Value(0);
  gestureY = new Value(0);
  velocity = new Value(0);
  _gestureEvent = event([
    {
      nativeEvent: {
        translationX: this.gestureX,
        translationY: this.gestureY,
        state: this.gestureState,
        vy: this.velocity,
      },
    },
  ]);

  componentDidMount() {
    //   setTimeout(()=>{
    //   },5000)
  }

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={this._gestureEvent}
          onHandlerStateChange={this._gestureEvent}>
          <Animated.View
            //   onLayout={e=>console.log(e.nativeEvent.layout.y)}
            style={[
              styles.box,
              {
                translateX: springInteraction(this.gestureX, this.gestureState),
                translateY: springInteraction(this.gestureY, this.gestureState),
              },
            ]}
          />
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  // paragraph: {
  //   margin: 24,
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  box: {
    width: 80,
    height: 80,
    backgroundColor: '#16a085',
  },
});
