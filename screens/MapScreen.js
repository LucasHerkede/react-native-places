import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { MapView, Location, Permissions } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';

class MapScreen extends Component {
    static navigationOptions = {
        title: 'Map',
        tabBarIcon: ({ tintColor }) => {
                return <Icon name="my-location" size={25} color={tintColor} />;
        }    
    }

    state = {
        region: {
            longitude: -122,
            latitude: 37,
            longitudeDelta: 0.04,
            latitudeDelta: 0.09
        }
    }
    
    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        
        if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            const region = {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                longitudeDelta: 0.04,
                latitudeDelta: 0.09
            };
            this.setState({ region });
        }
    }

    onRegionChangeComplete = (region) => {
        this.setState({ region });
    }

    onButtonPress = () => {
        this.props.fetchJobs(this.state.region, () => {
            this.props.navigation.navigate('deck');
        });
    }
    
    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapView 
                    style={{ flex: 1 }}  
                    region={this.state.region}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                />
                <View style={styles.buttonConainer}>
                    <Button 
                        large
                        title='SEARCH HERE'
                        backgroundColor='#009688'
                        icon={{ name: 'search' }}
                        onPress={this.onButtonPress}
                    />
                </View>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    buttonConainer: {
        position: 'absolute',
        bottom: 20,
        right: 0,
        left: 0
    }
});

export default connect(null, actions)(MapScreen);
