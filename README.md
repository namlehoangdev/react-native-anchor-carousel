# react-native-anchor-carousel
----
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

A simple swipeable carousel for React Native which anchor two side of list.. 
  

### Installation 
Install the dependency.
```sh
$ npm install react-native-anchor-carousel 
```
```sh
$ yarn add react-native-anchor-carousel 
```
### Example

__**[Expo snack demo here](https://snack.expo.io/@lehoangnamuit/react-native-anchor-carousel)**__

![](https://i.imgur.com/ncvtqsd.gif)   
![](https://i.imgur.com/wd1lxyt.gif) 
 
__**[full example here](https://github.com/lehoangnam97/react-native-anchor-carousel)**__
**Hook Component version:
```javascript
import React, {useRef} from 'react';
import Carousel from 'react-native-anchor-carousel';
```

```javascript
const carouselRef = useRef(null);

```

```javascript
<View style={styles.carouselContainer}>
     <Carousel  style={styles.carousel}
                data={data}
                renderItem={this.renderItem}
                itemWidth={200}
                containerWidth={width - 20} 
                separatorWidth={0}
                ref={carouselRef}
	            //pagingEnable={false}
	            //minScrollDistance={20}
            />
</View>
```
```javascript
  renderItem = ({item, index}) => {
        const {backgroundColor} = item;
        return (
            <TouchableOpacity style={[styles.item, {backgroundColor}]}
                              onPress={() => { carouselRef.current.scrollToIndex(index); }}>
                 .......
            </TouchableOpacity>)
    };
 
```
```javascript
	const styles = StyleSheet.create({ 
		....
		carouselContainer: {
		    height:200  
		},
	    	carousel: {
	            flex:1
		} 
	})
 ```


**Traditional component version:
```javascript
import Carousel from 'react-native-anchor-carousel';
```

```javascript
<View style={styles.carouselContainer}>
     <Carousel  style={styles.carousel}
                data={data}
                renderItem={this.renderItem}
                itemWidth={200}
                containerWidth={width - 20} 
                separatorWidth={0}
                ref={(c) => {
                    this._carousel = c;
                }}
	            //pagingEnable={false}
	            //minScrollDistance={20}
            />
</View>
```
```javascript
  renderItem = ({item, index}) => {
        const {backgroundColor} = item;
        return (
            <TouchableOpacity style={[styles.item, {backgroundColor}]}
                              onPress={() => {
                                  this._carousel.scrollToIndex(index);
                              }}>
                 .......
            </TouchableOpacity>)
    };
 
```
```javascript
	const styles = StyleSheet.create({ 
		....
		carouselContainer: {
		    height:200  
		},
	    	carousel: {
	            flex:1
		} 
	})
 ```

### Usages
 This component currently just support only carousel for **horizontal** side carousel
 From version **2.2.0**, It is now supported __**[Flatlist](https://facebook.github.io/react-native/docs/flatlist)**__ props
 From version **3.0.0** Change scroll behavior of previous versions
 
| Props | Description | Type | Default | Required | 
| ------ | ------ | ------| -----| ----| 
| data | Array of data for rendering | Array |  [] | **Yes**|
|renderItems | take each item from data and renders it. Function receives one agrument `{item,index}` and must return as         React.Element | Function | () => {}  | **Yes** |
| initialIndex | Initial starting focused item of list | Number | 0 | No | 
| keyExtractor | Key extractor for each item of list | Function |  (item, index) => index.toString() | No |
| onScrollEnd |  Fired while scrollview end of scrolling | Function | ()=> {} | No |
| pagingEnable | Enable or disable autor scroll to closest item | Boolean | False | No | 
| containerWidth | Width of the carousel container box  | Number | Screen width | **Yes** | 
| itemWidth | Width of each item in carousel | Number | 90% of screen width | **Yes** | 
| separatorWidth| Width of separator in carousel (cause it only support horizontal side at the present time)| Number | 10 | No
| inActiveScale | Value of the scale effect applied to inactive item | Number | 0.85 | No | 
| inActiveOpacity | Value of the opacity effect applied to inactive item | Number | 0.8 | No | 
| style | Style of the carousel container box | View style | {} | No |
| itemContainerStyle | Style for each carousel container item | View style | {} | No |
| minScrollDistance | Minimum distance when scrolling to move to the next item | Number | 25 | No |
 
### References from
This library is written after taking reference from [react-native-snap-carousel](https://github.com/archriss/react-native-snap-carousel)
  
### Development 
Welcome everybody to contribute !
Hope this simple carousel can help somebody for fast develope react-native app!
  
### Todos 
 - Cover vertical side carousel

License
---- 
MIT 


**Free Software, Hell Yeah!**
 
