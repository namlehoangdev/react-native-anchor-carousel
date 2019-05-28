# react-native-anchor-carousel
----
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

A simple swipeable carousel for React Native which anchor two side of list.. 
  

### Installation 
Install the dependencies and devDependencies and start the server. 
```sh
$ npm install react-native-anchor-carousel
$ yarn add react-native-anchor-carousel
```
###Example
[Imgur](https://i.imgur.com/LDlucK8.gifv)

### Usages
 This component currently just support only carousel for **horizontal** side carousel
 
| Props | Description | Type | Default | Required | 
| ------ | ------ | ------| -----| ----| 
| data | Array of data for rendering | Array |  [] | **Yes**|
|renderItems | take each item from data and renders it. Function receives one agrument `{item,index}` and must return as         React.Element | Function | () => {}  | **Yes** |
| initialIndex | Initial starting focused item of list | Number| 0 | No |  
| onScrollEnd |  Fired while scrollview end of scrolling | Function | ()=> {} | No |
| pagingEnable | Enable or disable autor scroll to closest item | Boolean | False | No | 
| containerWidth | Width of the carousel container box  | number | Screen width | **Yes** | 
| itemWidth | Width of each item in carousel | Number | 60% of screen width | **Yes** | 
| separatorWidth| Width of separator in carousel (cause it only support horizontal side at the present time)| Number | -20 | No
| inActiveScale | Value of the scale effect applied to inactive item | Number | 0.85 | No | 
| inActiveOpacity | Value of the opacity effect applied to inactive item | Number | 0.8 | No | 
| style | Style of the carousel container box | View style | {} | No |
| itemContainerStyle | Style for each carousel container item | View style | {} | No |
 
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
 
