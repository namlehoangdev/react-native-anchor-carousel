import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import NumberCarousel from './NumberCarousel';
import ImageCarousel from './ImageCarousel';
import ShopCarousel from './ShopCarousel';

export default class Index extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <Text style={styles.title}>Example 1</Text>
          <NumberCarousel />
          <Text style={styles.title}>Example 2</Text>
          <ShopCarousel />
          <Text style={styles.title}>Example 3</Text>
          <ImageCarousel />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2F34',
    paddingVertical: 30,
  },
  title: {
    color: 'white',
    marginTop: 40,
    marginBottom: 5,
  },
});
