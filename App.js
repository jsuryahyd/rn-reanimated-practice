/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {SpringPhysics, MoveAlong, MoveBackOnRelease} from './src/pages';
import {
  createTabNavigator,
  createBottomTabNavigator,
} from 'react-navigation-tabs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
  DrawerActions,
} from 'react-navigation-drawer';
import PinchZoomAnimations from './src/pages/PinchZoomAnimations';
import {FollowingItems} from './src/pages/FollowingItems';
function App() {
  const simplePhysics = createBottomTabNavigator(
    {
      MoveAlong: MoveAlong,
      MoveBackOnRelease: MoveBackOnRelease,
      SpringPhysics: SpringPhysics,
    },
    {
      defaultNavigationOptions: ({navigation}) => {
        return {
          tabBarButtonComponent: ({focused}) => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderLeftWidth:
                    navigation.state.routeName == 'MoveBackOnRelease' ? 0.5 : 0,
                  borderRightWidth:
                    navigation.state.routeName == 'MoveBackOnRelease' ? 0.5 : 0,
                  borderColor: 'gray',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate(navigation.state.routeName)
                  }>
                  <Text
                    style={{
                      fontSize: 14,
                      color: focused ? 'green' : 'gray',
                      textAlign: 'center',
                    }}>
                    {navigation.state.routeName.replace(
                      /[A-Z]+/g,
                      m => ' ' + m,
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          },
        };
      },
      tabBarOptions: {
        //wont work since whole tabbarcomponent is changed
        activeBackgroundColor: 'green',
        activeTintColor: 'green',
      },
    },
  );

  const simplePhysicsStack = createStackNavigator(
    {
      simplePhysics: simplePhysics,
    },
    {
      defaultNavigationOptions: ({navigation}) => ({
        headerTitle: 'Simple Physics',
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
      }),
    },
  );

  const MainNavigationStack = createDrawerNavigator(
    {
      simplePhysics: {
        screen: simplePhysicsStack,
        navigationOptions: {
          drawerLabel: 'Simple Physics',
        },
      },
      other: {
        //since inside drawernavigator, navigationOptions of each screen willnot have header options, create a stack for each screen; and if not listed individually inside drawernavigator, screens wont be listed inside sidedrawer
        screen: createStackNavigator(
          {OtherScreen},
          {
            defaultNavigationOptions: ({navigation}) => ({
              headerTitle: 'Other Screen',
              headerLeft: (
                <Text
                  style={{paddingHorizontal: 10}}
                  onPress={() => {
                    navigation.openDrawer();
                  }}>
                  Menu
                </Text>
              ),
            }),
          },
        ),
        navigationOptions: ({navigation}) => ({
          // //will not work
          // headerLeft: (
          //   <Text
          //     style={{paddingHorizontal: 10}}
          //     onPress={() => {
          //       // alert('opne derawer');
          //       // DrawerActions.openDrawer();
          //       // navigation.navigate("DrawerOpen");
          //       navigation.openDrawer();
          //     }}>
          //     Menu
          //   </Text>
          // ),
          drawerLabel: 'Other Screen',
        }),
      },
      PinchZoomAnimations: {
        screen: createStackNavigator(
          {
            home: PinchZoomAnimations,
          },
          {
            defaultNavigationOptions: ({navigation, navigationOptions}) => {
              return {
                headerTitle: 'Pinch, Zoom and Rotate',
              };
            },
          },
        ),
        navigationOptions: {
          drawerLabel: 'Pinch, Zoom and Rotate',
        },
      },
      FollowingItems: {
        screen: createStackNavigator(
          {home: FollowingItems},
          {
            defaultNavigationOptions: ({navigation}) => {
              return {
                headerLeft: (
                  <Text
                    style={{paddingHorizontal: 10}}
                    onPress={() => {
                      navigation.openDrawer();
                    }}>
                    Menu
                  </Text>
                ),
                headerTitle: 'Following Items',
              };
            },
          },
        ),
        navigationOptions: {drawerLabel: 'Following Items'},
      },
    },
    {
      initialRouteName: 'FollowingItems',
      // headerMode: 'none',
      drawerType: 'front',
      defaultNavigationOptions: ({navigation}) => ({}),
    },
  );

  const RootNavigator = createDrawerNavigator(
    {
      main: {
        screen: MainNavigationStack,
        // navigationOptions: {
        //   drawerLabel: 'Simple Physics',
        // },
      },
    },
    // {
    //   contentComponent: props => {
    //     console.log(props);
    //     return (
    //       <ScrollView>
    //         <SafeAreaView>
    //           {/* <View>
    //       <TouchableOpacity style={{flexDirection: 'row'}}>
    //         <Text>Simple Physics</Text>
    //       </TouchableOpacity>
    //     </View>

    //     <View>
    //       <TouchableOpacity style={{flexDirection: 'row'}}>
    //         <Text>Other</Text>
    //       </TouchableOpacity>
    //     </View> */}
    //           <DrawerNavigatorItems {...props} />
    //         </SafeAreaView>
    //       </ScrollView>
    //     );
    //   },
    //   drawerWidth: 300,
    //   drawerType: 'front',
    //   contentOptions: {
    //     items: ['main'],
    //     activeTintColor: 'green',
    //   },
    // },
  );
  const Appcontainer = createAppContainer(RootNavigator);

  return <Appcontainer />;
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

function OtherScreen({navigation}) {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text onPress={() => navigation.openDrawer()}>Open Drawer</Text>
    </ScrollView>
  );
}

// OtherScreen.navigationOptions = {
//   headerTitle: 'Other',
// };
