import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';

const { width } = Dimensions.get('window');

const data = [
  { backgroundColor: 'red' },
  { backgroundColor: 'green' },
  { backgroundColor: 'blue' },
  { backgroundColor: 'yellow' }
];

export default class NumberCarousel extends Component {
  renderItem = ({ item, index }) => {
    const { backgroundColor } = item;
    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor }]}
        onPress={() => {
          this.numberCarousel.scrollToIndex(index);
        }}
      >
        <Text style={styles.text}>{index.toString()}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Carousel
        style={styles.carousel}
        data={data}
        renderItem={this.renderItem}
        itemWidth={200}
        containerWidth={width - 10}
        ref={(c) => {
          this.numberCarousel = c;
        }}
      />
    );
  }
}

const styles = StyleSheet.create({ 
  carousel: {
    flex: 1,
    backgroundColor: 'orange'
  },
  item: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 100,
    fontWeight: 'bold'
  }
});
