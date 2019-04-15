import React, { Component } from 'react';
import {
    Animated,
    PanResponder,
    Dimensions,
    StyleSheet,
    Platform
 } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.40 * Dimensions.get('window').width;
const SWIPE_OUT_DURATION = 250;

class Swipe extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {},
        keyProp: 'id',      
    }

    constructor(props) {
        super(props);
        
        this.position = new Animated.ValueXY();
        this.animatedToFirst = new Animated.ValueXY();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                {
                  dx: this.position.x,
                  dy: this.position.y
                }
              ]),
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition(gesture);
                }
            }
        });

        this.state = { index: 0 };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];

        if (direction === 'right') {
            onSwipeRight(item);
        } else {
            onSwipeLeft(item);
        }

        Animated.timing(this.animatedToFirst, {
            toValue: { x: 0, y: -10 },
            duration: 150
        }).start(() => {
            // we update state (rerender page) ONLY after the animation is finished
            this.animatedToFirst.setValue({ x: 0, y: 0 });
            this.position.setValue({ x: 0, y: 0 });
            this.setState({ index: this.state.index + 1 });
        });
    }

    getCardStyle() {
        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
            outputRange: ['-90deg', '0deg', '90deg']
        });
        
        return { 
            ...this.position.getLayout(),
            transform: [{ rotate }]
        };
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        return Animated.timing(this.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    resetPosition(gesture) {
        return Animated.timing(this.position, {
            toValue: { x: 0, y: 0 },
            duration: Math.abs(gesture.dx) * 1.5
        }).start();
    }

    renderCards() {
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }

        return this.props.data.map((item, index) => {
            // caso seja renderizado um card q ja foi descartado,
            // não precisa carregar.
            if (index < this.state.index) { 
                return null;
            }
            
            // Animeted the current card.
            if (index === this.state.index) {
                return (
                    <Animated.View
                        key={item[this.props.keyProp]}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }

            // do not animate the next card.
            return (
                <Animated.View key={item[this.props.keyProp]} style={[styles.cardStyle, { top: 10 * (index - this.state.index) }]}>
                    {this.props.renderCard(item)}
                </Animated.View>
            );
        }).reverse();
    }

    render() {
        return (
            <Animated.View style={this.animatedToFirst.getLayout()}>
                {this.renderCards()}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        ...Platform.select({
          android: {
            elevation: 0
          }
        })
    }
});

export default Swipe;
