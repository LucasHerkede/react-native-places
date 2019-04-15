import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { clearLikedJobs } from '../actions';

class SettingsScreen extends Component {
    render() {
        return (
            <View style={{ paddingTop: 10}}>
                <Button
                    title="Clear liked places"
                    large
                    icon={{ name: 'delete-forever' }}
                    backgroundColor="#f44336"
                    onPress={this.props.clearLikedJobs}
                />
            </View>
        );
    }
}

export default connect(null, { clearLikedJobs })(SettingsScreen);
