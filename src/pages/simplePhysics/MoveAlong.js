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

//sticky
function interaction(transX, gestureState) {
  const start = new Value(0);
  const isDragging = new Value(0);
  const position = new Value(0);

  return cond(
    eq(State.ACTIVE, gestureState),
    [
      cond(eq(isDragging, 0), [set(isDragging, 1), set(start, position)]),
      set(position, add(start, transX)),
    ],
    [set(isDragging, 0), position],
  );
}

export class MoveAlong extends Component {
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
                translateX: interaction(this.gestureX, this.gestureState),
                translateY: interaction(this.gestureY, this.gestureState),
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
