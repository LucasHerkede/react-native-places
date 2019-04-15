import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component {

    renderLastSlide(index) {
        if (index === this.props.data.length - 1) {
            return (
                <Button
                    title="Onwords!"
                    raised
                    large
                    containerViewStyle={styles.buttonStyle}
                    onPress={this.props.onComplete}
                    backgroundColor="#54A1C4"
                />
            );
        } 
    }

    renderSlides() {
        return this.props.data.map((slide, index) => {
            return (
                <View key={slide.text} style={[styles.slideStyle, { backgroundColor: slide.color }]}>
                    <Text style={styles.slideTextStyle}>{slide.text}</Text>
                    {this.renderLastSlide(index)}
                </View>    
            );
        });
    }

    render() {
        return (
            <ScrollView
                horizontal
                pagingEnabled
            >
                {this.renderSlides()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    slider: {
        flex: 1,
    },
    slideStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH
    },
    slideTextStyle: {
        fontSize: 30,
        textAlign: 'center',
        color: 'white'
    },
    buttonStyle: {
        marginTop: 15
    }
});

export default Slides;
