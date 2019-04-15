import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { MapView, Constants } from 'expo';
import { Card, Button, Icon } from 'react-native-elements';

import { likeJob } from '../actions';
import Swipe from '../components/Swipe';
import { Colors } from '../themes';

class DeckScreen extends Component {
    static navigationOptions = {
        title: 'Places',
        tabBarIcon: ({ tintColor }) => {
                return <Icon name="place" size={25} color={tintColor} />;
        }    
    }

    // https://developers.google.com/places/web-service/search?hl=pt-br
    renderCard(job) {
        const initialRegion = {
            longitude: job.geometry.location.lng,
            latitude: job.geometry.location.lat,
            latitudeDelta: 0.045,
            longitudeDelta: 0.02
        };

        const opened = job.opening_hours && job.opening_hours.open_now;
        return (
            <Card
                title={job.name}
                titleStyle={styles.detailText}
                containerStyle={styles.cardContainer}
            >       
                <View style={{ height: 300 }}>
                    <MapView
                        scrollEnabled={false}
                        style={{ flex: 1 }}
                        cacheEnabled
                        initialRegion={initialRegion}
                    />
                </View>
                <View style={styles.detailWrapper}>
                    <View style={styles.detailContainer}>
                        <Icon name="access-time" color={Colors.green} />
                        <Text style={styles.detailText}>{opened ? 'Aberto' : 'Fechado'}</Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Icon name="map" color={Colors.blue} />
                        <Text style={styles.detailText}>{job.distance} KM</Text>
                    </View>
                </View>
            </Card> 
        );
    }

    renderNoMoreCards = () => {
        return (
            <Card
                title='No More Places'
                titleStyle={styles.detailText}
                containerStyle={styles.cardContainer}
            >
                <Button
                    title="BACK TO SEARCH"
                    large
                    icon={{ name: 'my-location' }} 
                    backgroundColor={Colors.blue}
                    onPress={() => this.props.navigation.navigate('map')}
                />
            </Card>       
        ); 
    }

    render() {
        return (
            <View style={styles.container}>
                <Swipe
                    data={this.props.jobs}
                    renderCard={this.renderCard}
                    renderNoMoreCards={this.renderNoMoreCards}
                    onSwipeRight={job => this.props.likeJob(job)}
                    keyProp="id"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    detailWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    detailContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    detailText: {
        color: Colors.textBlack
    },
    cardContainer: {
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
    container: {
        backgroundColor: Colors.background,
        flex: 1,
        ...Platform.select({
            android: {
              marginTop: Constants.statusBarHeight
            }
        })
    }
});

function mapStateToProps({ jobs }) {
    return { jobs };
}
export default connect(mapStateToProps, { likeJob })(DeckScreen);
