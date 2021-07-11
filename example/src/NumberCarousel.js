import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';

const {width: windowWidth} = Dimensions.get('window');

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const NUMBER_OF_ITEM = 4;

export default class NumberCarousel extends Component {
  renderItem = ({item, index}) => {
    const backgroundColor = getRandomHexColor();
    return (
      <TouchableOpacity
        style={[styles.item, {backgroundColor}]}
        onPress={() => {
          this.numberCarousel.scrollToIndex(index);
        }}>
        <Text style={styles.text}>{(index + 1).toString()}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Carousel
        style={styles.carousel}
        data={Array(NUMBER_OF_ITEM).fill(0)}
        renderItem={this.renderItem}
        itemWidth={windowWidth * 0.8}
        separatorWidth={0}
        containerWidth={windowWidth}
        ref={c => {
          this.numberCarousel = c;
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  carousel: {
    flexGrow: 0,
    height: 150,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'red',
  },
  item: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 100,
    fontWeight: 'bold',
  },
});
