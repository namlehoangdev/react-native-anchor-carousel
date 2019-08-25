import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground, 
} from 'react-native';
import NumberCarousel from './NumberCarousel';
import ImageCarousel from './ImageCarousel';

const { width } = Dimensions.get('window'); 

export default class App extends Component { 
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <NumberCarousel/>
        </View> 
        <View style={styles.carouselContainer2}>
          <ImageCarousel/>
          
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#2C2F34', 
    marginTop:20
  },
  carouselContainer: {
    height: 150,
    width: width,
    borderWidth: 5,
    borderColor: 'white',
    marginTop:10
  },
  carouselContainer2: { 
    width: width,
    height:width*0.8, 
    marginTop:10
  }, 
});
