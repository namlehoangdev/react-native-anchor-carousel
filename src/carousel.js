import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef
} from 'react';
import { Animated, StyleSheet, Dimensions, FlatList } from 'react-native';
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {},
  itemContainer: { justifyContent: 'center' },
  button: {}
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function Carousel(props, ref) {
  const {
    inverted = false,
    inActiveScale = 0.8,
    inActiveOpacity = 0.8,
    separatorWidth = 0,
    containerWidth = width,
    itemWidth = 0.9 * width,
    bounces = true,
    data = [],
    style = {},
    initialIndex = 0,
    pagingEnable = true,
    minScrollDistance = 25,
    itemContainerStyle = {},
    keyExtractor = (item, index) => index.toString(),
    renderItem = () => {},
    onScrollEnd = () => {},
    onScrollBeginDrag = () => {},
    onScrollEndDrag = () => {},
    ...otherProps
  } = props;
  const scrollViewRef = useRef(null);
  const currentIndexRef = useRef(initialIndex);
  const scrollXBeginRef = useRef(0);
  const xOffsetRef = useRef(new Animated.Value(0));
  const halfContainerWidthRef = useRef(containerWidth / 2);
  const halfItemWidthRef = useRef(itemWidth / 2);
  const handleOnScrollRef = useRef(() => {});
  const scrollXRef = useRef(0);

  useEffect(() => {
    setScrollHandler();
  }, []);
  useImperativeHandle(ref, () => ({
    scrollToIndex: scrollToIndex
  }));

  function setScrollHandler() {
    handleOnScrollRef.current = Animated.event(
      [{ nativeEvent: { contentOffset: { x: xOffsetRef.current } } }],
      {
        useNativeDriver: true,
        listener: event => {
          scrollXRef.current = event.nativeEvent.contentOffset.x;
        }
      }
    );
  }

  function scrollToIndex(index) {
    if (index < 0 || index >= data.length) {
      return;
    }
    onScrollEnd(data[index], index);
    currentIndexRef.current = index;
    setTimeout(() => {
      scrollViewRef.current &&
        scrollViewRef.current.scrollToOffset({
          offset:
            index * (itemWidth + separatorWidth) +
            halfItemWidthRef.current -
            halfContainerWidthRef.current,
          animated: true
        });
    });
  }
  function handleOnScrollBeginDrag() {
    onScrollBeginDrag && onScrollBeginDrag();
    scrollXBeginRef.current = scrollXRef.current;
  }

  function handleOnScrollEndDrag() {
    onScrollEndDrag && onScrollEndDrag();
    if (scrollXRef.current < 0) {
      return;
    }
    let scrollDistance = scrollXRef.current - scrollXBeginRef.current;
    scrollXBeginRef.current = 0;
    if (Math.abs(scrollDistance) < minScrollDistance) {
      scrollToIndex(currentIndexRef.current);
      return;
    }
    scrollDistance < 0
      ? scrollToIndex(currentIndexRef.current - 1)
      : scrollToIndex(currentIndexRef.current + 1);
  }

  function itemAnimatedStyles(index) {
    const animatedOffset =
      index === 0
        ? halfItemWidthRef.current
        : index === data.length - 1
        ? containerWidth - halfItemWidthRef.current
        : halfContainerWidthRef.current;
    const midPoint =
      index * (itemWidth + separatorWidth) +
      halfItemWidthRef.current -
      animatedOffset;
    const startPoint =
      index === 1
        ? 0
        : index === data.length - 1
        ? (data.length - 2) * (itemWidth + separatorWidth) +
          halfItemWidthRef.current -
          halfContainerWidthRef.current
        : midPoint - itemWidth - separatorWidth;
    const endPoint =
      index === 0
        ? itemWidth +
          separatorWidth +
          halfItemWidthRef.current -
          halfContainerWidthRef.current
        : index === data.length - 2
        ? (data.length - 1) * (itemWidth + separatorWidth) +
          itemWidth -
          containerWidth
        : midPoint + itemWidth + separatorWidth;
    console.log('xOffsetRef.current:', xOffsetRef.current);
    const animatedOpacity = {
      opacity: xOffsetRef.current.interpolate({
        inputRange: [startPoint, midPoint, endPoint],
        outputRange: [inActiveOpacity, 1, inActiveOpacity]
      })
    };

    const animatedScale = {
      transform: [
        {
          scale: xOffsetRef.current.interpolate({
            inputRange: [startPoint, midPoint, endPoint],
            outputRange: [inActiveScale, 1, inActiveScale]
          })
        }
      ]
    };

    return { ...animatedOpacity, ...animatedScale };
  }

  function renderItemContainer({ item, index }) {
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
          itemAnimatedStyles(index)
        ]}
      >
        {renderItem({ item, index })}
      </Animated.View>
    );
  }
  function getItemLayout(data, index) {
    return {
      offset:
        index * (itemWidth + separatorWidth) +
        halfItemWidthRef.current -
        halfContainerWidthRef.current,
      length: itemWidth,
      index
    };
  }

  return (
    <AnimatedFlatList
      {...otherProps}
      bounces={bounces}
      horizontal
      data={data}
      decelerationRate={0}
      automaticallyAdjustContentInsets={false}
      keyExtractor={keyExtractor}
      ref={scrollViewRef}
      renderItem={renderItemContainer}
      style={[styles.container, { width: containerWidth }, style]}
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      onScrollBeginDrag={handleOnScrollBeginDrag}
      onScroll={handleOnScrollRef.current}
      onScrollEndDrag={handleOnScrollEndDrag}
      getItemLayout={getItemLayout}
      //scrollEnabled//snapToInterval={itemWidth}
    />
  );
}

export default forwardRef(Carousel);
