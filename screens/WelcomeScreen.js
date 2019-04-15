import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import Slides from '../components/Slides';

const SLIDE_DATA = [
    { text: 'Welcome to Coffe Finder', color: '#1A2145' },
    { text: 'Use this to find a coffe shop', color: '#182E38' },
    { text: 'set your location, then swipe away!', color: '#1E334F' }
];

class WelcomeScreen extends Component {
    state = { token: null };

    async componentWillMount() {
        const token = await AsyncStorage.getItem('fb_token');

        if (token) {
            this.props.navigation.navigate('map');
            this.setState({ token });
        } else {
            this.setState({ token: false });
        }
    }

    onslidesComplete = () => {
        this.props.navigation.navigate('auth');
    }

    render() {
        if (this.state.token === null) {
            return <AppLoading />;
        }

        return (
            <View style={{ flex: 1 }}>
                <Slides data={SLIDE_DATA} onComplete={this.onslidesComplete} />
            </View>
        );
    }
}

export default WelcomeScreen;
