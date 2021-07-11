# react-native-anchor-carousel
----
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

A simple swipeable carousel for React Native which anchor two side of list.
  

### Installation 
Install the dependency.
```sh
$ npm install react-native-anchor-carousel 
```
```sh
$ yarn add react-native-anchor-carousel 
```
\
For older version, install **3.1.2**
```sh
$ npm install react-native-anchor-carousel@3.1.2
```
```sh
$ yarn add react-native-anchor-carousel@3.1.2 
```

### Example

__**[Expo snack demo here](https://snack.expo.io/@lehoangnamuit/react-native-anchor-carousel)**__

![](https://i.imgur.com/FDRMGZS.gif)
![](https://i.imgur.com/ZPoSTFG.gif)   
![](https://i.imgur.com/bzRIiTG.gif)

__**[full example here](https://github.com/lehoangnam97/react-native-anchor-carousel/tree/master/example)**__

```javascript
import Carousel from 'react-native-anchor-carousel';
const {width: windowWidth} = Dimensions.get('window');
const styles = StyleSheet.create({
 carousel: {
  flexGrow: 0,
  height: 150,
 }
});
```

\
**Hook Component version:**
```javascript
const carouselRef = React.useRef(null);
renderItem = ({item, index}) => {
 return (
         <TouchableOpacity
                 style={styles.item}
                 onPress={() => {
                  carouselRef.current.scrollToIndex(index);
                 }}>
          ...
         </TouchableOpacity>
 );
}
return (<Carousel
        ref={carouselRef}
        data={Array(3).fill(0)}
        renderItem={renderItem}
        style={styles.carousel}
        itemWidth={windowWidth * 0.8}
        containerWidth={windowWidth}
        separatorWidth={0}
/>)
```
 
\
**Traditional Class Component version:**
 
```javascript
renderItem = ({item, index}) => {
 return (
         <TouchableOpacity
                 style={styles.item}
                 onPress={() => {
                  this.numberCarousel.scrollToIndex(index);
                 }}>
          ...
         </TouchableOpacity>
 );
};

render() {
 return (
         <Carousel
                 style={styles.carousel}
                 ref={c => {
                  this.numberCarousel = c;
                 }}
                 data={Array(3).fill(0)}
                 renderItem={this.renderItem}
                 itemWidth={windowWidth * 0.8}
                 separatorWidth={0}
                 containerWidth={windowWidth}
         />
 );
}
```
  

### Usages
 This component currently just support only carousel for **horizontal** side carousel
 From version **2.2.0**.
\
 It is now supported __**[Flatlist](https://facebook.github.io/react-native/docs/flatlist)**__ props
 from version **3.0.0** Change scroll behavior of previous versions
\
From version **4.0.0** it has been moved to *Functional component* and fix separator bug 
 
| Props | Description | Type | Default | Required | 
| ------ | ------ | ------| -----| ----| 
| **data** | Array of data for rendering | Array |  [] | **Yes**|
| **renderItems** | take each item from data and renders it. Function receives one agrument `{item,index}` and must return as React.Element | Function | () => {}  | **Yes** |
| **keyExtractor** | Key extractor for each item of list | Function |  (item, index) => index.toString() | **Should** |
| **Other Flatlist Props** | Other [Flatlist Props](https://reactnative.dev/docs/flatlist)  |  |  |  |
| *minScrollDistance* | Minimum distance when scrolling to move to the next item. **Notice this property when you need to improve smoothness** | Number | 5 | No |
| containerWidth | Width of the carousel container box  | Number | Screen width | **Yes** |
| itemWidth | Width of each item in carousel | Number | 90% of screen width | **Yes** |
| separatorWidth| Width of separator in carousel (cause it only support horizontal side at the present time)| Number | 10 | No
| inActiveScale | Value of the scale effect applied to inactive item | Number | 0.8 | No | 
| inActiveOpacity | Value of the opacity effect applied to inactive item | Number | 0.8 | No | 
| style | Style of the carousel container box | View style | {} | No |
| itemContainerStyle | Style for each carousel container item | View style | {} | No |
| onScrollEnd |  Fired while scrollview end of scrolling | Function | ()=> {} | No |
| initialIndex | Initial starting focused item of list | Number | 0 | No |


 
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
 
