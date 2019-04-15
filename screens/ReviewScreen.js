import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { viewJobDetail } from '../actions';
import { Colors } from '../themes';

class ReviewScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Review Places', 
        headerRight: (
            <Button 
                title="Settings" 
                onPress={() => { navigation.navigate('settings'); }} 
                backgroundColor={Colors.transparent}
                color="rgba(0, 122, 255, 1)"
            />
        )
    })

    onDetailPress = (job) => {
        this.props.viewJobDetail(job, () => {
            this.props.navigation.navigate('reviewDetail');
        });
    }

    RenderLikedJobs() {
        return this.props.likedJobs.map(job => {
            const opened = job.opening_hours && job.opening_hours.open_now;
            return (
                <Card 
                    key={job.id}
                    title={job.name}
                    containerStyle={styles.cardContainer}
                >
                    <View>
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

                        <Button
                            title='Details'
                            backgroundColor="#03a9f4"
                            onPress={() => { this.onDetailPress(job); }}
                        />
                    </View>
                </Card>
            );
        });
    }

    render() {
        return (
            <ScrollView>
                {this.RenderLikedJobs()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    detailWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10,
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
    }
});

function mapStateToProps({ likedJobs }) {
    return { likedJobs };
}
export default connect(mapStateToProps, { viewJobDetail })(ReviewScreen);
