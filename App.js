import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { Icon } from 'react-native-elements';
import { PersistGate } from 'redux-persist/es/integration/react';
// import { Notifications } from 'expo';

// import registerForNotifications from './services/push_notificaiton';
import configureStore from './store';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import ReviewScreen from './screens/ReviewScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReviewDetailScreen from './screens/ReviewDetailScreen';

export default class App extends React.Component {

  componentDidMount() {
    // registerForNotifications();
    // Notifications.addListener((notification) => {
    //   const { data: { text }, origin } = notification;

    //   if (origin === 'received' && text) {
    //     Alert.alert(
    //       'New Push Notification',
    //       text,
    //       [{ text: 'Ok' }]
    //     );
    //   }
    // });
  }

  render() {
    const { persistor, store } = configureStore();
    const MainNavigatior = createBottomTabNavigator({
      welcome: { screen: WelcomeScreen },
      auth: { screen: AuthScreen },
      main: { 
        screen: createBottomTabNavigator({
          map: { screen: MapScreen },
          deck: { screen: DeckScreen },
          review: {
            screen: createStackNavigator({
              review: { screen: ReviewScreen },
              reviewDetail: { screen: ReviewDetailScreen },
              settings: { screen: SettingsScreen }
            }),
            navigationOptions: {
              tabBarIcon: ({ tintColor }) => {
                return <Icon name="favorite" size={25} color={tintColor} />;
              },
            }
          }
        }, {
          tabBarOptions: {
            labelStyle: { fontSize: 12 },
            showIcon: true,
          },
        })
       }
    }, {
      navigationOptions: {
        tabBarVisible: false
      },
      lazy: true
    });

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={styles.container}>
            <MainNavigatior />
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
