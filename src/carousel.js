import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
  ViewPropTypes,
  FlatList
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {},
  itemContainer: { justifyContent: 'center' },
  button: {}
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this.itemAnimatedStyles = this.itemAnimatedStyles.bind(this);
    this.renderItemContainer = this.renderItemContainer.bind(this);
    this.handleOnScrollBeginDrag = this.handleOnScrollBeginDrag.bind(this);
    this.handleOnScrollEndDrag = this.handleOnScrollEndDrag.bind(this);
    this.getItemLayout = this.getItemLayout.bind(this);
    this.initialize();
    this.setScrollHandler();
  }

  initialize() {
    const {
      itemWidth,
      separatorWidth,
      data,
      containerWidth,
      initialIndex
    } = this.props;
    this.currentIndex = initialIndex;
    this.scrollXBegin = 0;
    this.xOffset = new Animated.Value(0);
    this.halfContainerWidth = containerWidth / 2;
    this.halfItemWidth = itemWidth / 2;
  }

  setScrollHandler() {
    this.handleOnScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.xOffset } } }],
      {
        useNativeDriver: true,
        listener: (event) => {
          this.scrollX = event.nativeEvent.contentOffset.x;
        }
      }
    );
  }

  scrollToIndex(index) {
    const { onScrollEnd, data, itemWidth, separatorWidth } = this.props;
    if (index < 0 || index >= data.length) return;
    onScrollEnd(data[index], index);
    this.currentIndex = index;
    setTimeout(() => {
      this._scrollView.getNode().scrollToOffset({
        offset:
          index * (itemWidth + separatorWidth) +
          this.halfItemWidth -
          this.halfContainerWidth,
        animated: true
      });
    });
  }
  handleOnScrollBeginDrag() {
    const { onScrollBeginDrag } = this.props;
    onScrollBeginDrag && onScrollBeginDrag();
    this.scrollXBegin = this.scrollX;
  }
  l;
  handleOnScrollEndDrag() {
    const { minScrollDistance, onScrollEndDrag } = this.props;
    onScrollEndDrag && onScrollEndDrag();
    if (this.scrollX < 0) {
      return;
    }
    let scrollDistance = this.scrollX - this.scrollXBegin;
    this.scrollXBegin = 0;
    if (Math.abs(scrollDistance) < minScrollDistance) {
      this.scrollToIndex(this.currentIndex);
      return;
    }
    scrollDistance < 0
      ? this.scrollToIndex(this.currentIndex - 1)
      : this.scrollToIndex(this.currentIndex + 1);
  }

  itemAnimatedStyles(index) {
    const {
      data,
      inActiveScale,
      inActiveOpacity,
      itemWidth,
      separatorWidth,
      containerWidth
    } = this.props;
    const animatedOffset =
      index === 0
        ? this.halfItemWidth
        : index === data.length - 1
        ? containerWidth - this.halfItemWidth
        : this.halfContainerWidth;
    const midPoint =
      index * (itemWidth + separatorWidth) +
      this.halfItemWidth -
      animatedOffset;
    const startPoint =
      index === 1
        ? 0
        : index === data.length - 1
        ? (data.length - 2) * (itemWidth + separatorWidth) +
          this.halfItemWidth -
          this.halfContainerWidth
        : midPoint - itemWidth - separatorWidth;
    const endPoint =
      index === 0
        ? itemWidth +
          separatorWidth +
          this.halfItemWidth -
          this.halfContainerWidth
        : index === data.length - 2
        ? (data.length - 1) * (itemWidth + separatorWidth) +
          itemWidth -
          containerWidth
        : midPoint + itemWidth + separatorWidth;

    const animatedOpacity = {
      opacity: this.xOffset.interpolate({
        inputRange: [startPoint, midPoint, endPoint],
        outputRange: [inActiveOpacity, 1, inActiveOpacity]
      })
    };

    const animatedScale = {
      transform: [
        {
          scale: this.xOffset.interpolate({
            inputRange: [startPoint, midPoint, endPoint],
            outputRange: [inActiveScale, 1, inActiveScale]
          })
        }
      ]
    };

    return { ...animatedOpacity, ...animatedScale };
  }

  renderItemContainer({ item, index }) {
    const {
      data,
      renderItem,
      inverted,
      itemWidth,
      separatorWidth,
      itemContainerStyle
    } = this.props;
    let marginWidth = index !== data.length - 1 ? separatorWidth : 0;
    let marginStyle = !!inverted
      ? { marginLeft: marginWidth }
      : { marginRight: marginWidth };
    return (
      <Animated.View
        pointerEvents={'box-none'}
        style={[
          styles.itemContainer,
          itemContainerStyle,
          { width: itemWidth },
          marginStyle,
          this.itemAnimatedStyles(index)
        ]}
      >
        {renderItem({ item, index })}
      </Animated.View>
    );
  }
  getItemLayout(data, index) {
    const {itemWidth,separatorWidth}=this.props;
    return {
      offset:index * (itemWidth + separatorWidth) +
          this.halfItemWidth -
          this.halfContainerWidth,
      length: itemWidth,
      index
    };
  }

  render() {
    const {
      data,
      bounces,
      style,
      itemWidth,
      containerWidth,
      initialIndex,
      keyExtractor,
      ...otherProps
    } = this.props;
    return (
      <AnimatedFlatList
        {...otherProps}
        bounces={bounces}
        horizontal
        data={data}
        decelerationRate={0}
        automaticallyAdjustContentInsets={false}
        keyExtractor={keyExtractor}
        ref={(ref) => (this._scrollView = ref)}
        renderItem={this.renderItemContainer}
        style={[styles.container, { width: containerWidth }, style]}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        onScrollBeginDrag={this.handleOnScrollBeginDrag}
        onScroll={this.handleOnScroll}
        onScrollEndDrag={this.handleOnScrollEndDrag}
        getItemLayout={this.getItemLayout}
        //scrollEnabled//snapToInterval={itemWidth}
      />
    );
  }
}

Carousel.propTypes = {
  style: ViewPropTypes.style,
  bounces: PropTypes.bool,
  itemWidth: PropTypes.number,
  separatorWidth: PropTypes.number,
  containerWidth: PropTypes.number,
  itemContainerStyle: ViewPropTypes.style,
  inActiveScale: PropTypes.number,
  inActiveOpacity: PropTypes.number,
  keyExtractor: PropTypes.func,
  renderItem: PropTypes.func,
  onScrollEnd: PropTypes.func,
  pagingEnable: PropTypes.bool,
  initialIndex: PropTypes.number,
  minScrollDistance: PropTypes.number,
  onScrollBeginDrag: PropTypes.func,
  onScrollEndDrag: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object)
  //itemHeight: PropTypes.number,
  //containerHeight: PropTypes.number,
};

Carousel.defaultProps = {
  inActiveScale: 0.8,
  inActiveOpacity: 0.8,
  separatorWidth: 0,
  containerWidth: width,
  itemWidth: 0.9 * width,
  bounces: true,
  data: [],
  style: {},
  initialIndex: 0,
  pagingEnable: true,
  minScrollDistance: 25,
  itemContainerStyle: {},
  keyExtractor: (item, index) => index.toString(),
  renderItem: () => {},
  onScrollEnd: () => {},
  onScrollBeginDrag: () => {},
  onScrollEndDrag: () => {}
  //containerHeight: 200
  //itemHeight: 0.2 * height - 20,
};
export default Carousel;
