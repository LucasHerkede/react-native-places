import React, { Component } from 'react';
import { View, Text, Platform, Linking, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Card, Icon, Divider } from 'react-native-elements';
import { MapView } from 'expo';
import { connect } from 'react-redux';

import { Colors, Fonts } from '../themes';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ReviewDetailScreen extends Component {
    static navigationOptions = () => ({
        headerTransparent: true
    })
    
    render() {
        const place = this.props.place;
        
        const initialRegion = {
            longitude: place.geometry.location.lng,
            latitude: place.geometry.location.lat,
            latitudeDelta: 0.045,
            longitudeDelta: 0.02
        };

        let url = `http://maps.apple.com/?ll=${place.geometry.location.lat},${place.geometry.location.lng}`;
        if (Platform.OS === 'android') {
            url = `geo:${place.geometry.location.lat},${place.geometry.location.lng}`;
        }

        const opened = place.opening_hours && place.opening_hours.open_now;


        return (
            <View style={styles.container}>
                <View style={styles.headerEffect} />
                <Card 
                    containerStyle={styles.cardWrapper} 
                    title={place.name}
                >
                    <View>
                        <View style={styles.detailWrapper}>
                            <View style={styles.detailContainer}>
                                <Icon name="access-time" color={Colors.green} />
                                <Text style={styles.detailText}>{opened ? 'Aberto' : 'Fechado'}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="map" color={Colors.blue} />
                                <Text style={styles.detailText}>{place.distance} KM</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Icon name="star" color={Colors.green} />
                                <Text style={styles.detailText}>{place.detail.rating}/5</Text>
                            </View>
                        </View>
                    </View>
                </Card>
                
                <ScrollView style={styles.scrollContainer}>
                    <Button
                        title='Acess now!'
                        backgroundColor="#03a9f4"
                        onPress={() => Linking.openURL(url)}
                    />
                    <View style={styles.infoContainer}>
                        <Text style={styles.titleText}>Infos</Text>
                        <Divider />
                        <View style={styles.infoWrapper}>
                            <Icon name="phone" color={Colors.blue} />
                            <Text style={styles.textInfo}>{place.detail.formatted_phone_number}</Text>
                        </View>
                        <View style={styles.infoWrapper}>
                            <Icon name="location-on" color={Colors.blue} />
                            <Text style={styles.textInfo}>{place.detail.formatted_address}</Text>
                        </View>
                    </View>
                    <View style={styles.mapWrapper}>
                        <MapView
                            scrollEnabled={false}
                            style={{ flex: 1 }}
                            cacheEnabled
                            initialRegion={initialRegion}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardWrapper: {
        marginTop: 70,
        borderRadius: 2,
        borderColor: Colors.border,
        borderWidth: 0.5,
        ...Platform.select({
            ios: {
              shadowColor: 'rgba(0,0,0, .2)',
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 1,
              shadowRadius: 1,
            },
            android: {
              elevation: 0.5,
            },
        }),
    },
    headerEffect: {
        height: 150,
        width: SCREEN_WIDTH,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: Colors.blue,
    },
    detailWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10,
    },
    infoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    mapWrapper: {
        height: 300,
    },
    scrollContainer: {
        margin: 15,
    },
    infoContainer: {
        padding: 20,
    },
    detailContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    detailText: {
        color: Colors.textBlack,
        fontSize: Fonts.size.medium
    },
    textInfo: {
        color: Colors.textBlack,
        fontSize: Fonts.size.medium
    },
    titleText: {
        color: Colors.textBlack,
        fontSize: Fonts.size.h6
    },
    container: {
        backgroundColor: Colors.white,
        flex: 1,
    }
});

const mapStateToProps = ({ placeDetail }) => {
    return { place: placeDetail };
};
export default connect(mapStateToProps)(ReviewDetailScreen);
