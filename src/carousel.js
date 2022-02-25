import React, {
  Component,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef
} from 'react';
import { Animated, StyleSheet, Dimensions, FlatList } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {},
  itemContainer: { justifyContent: 'center' }
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function useConstructor(callBack = () => {}) {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) {
    return;
  }
  callBack();
  setHasBeenCalled(true);
}

function Carousel(props, ref) {
  const {
    data = [],
    style = {},
    containerWidth = windowWidth,
    itemWidth = 0.9 * windowWidth,
    itemContainerStyle = {},
    separatorWidth = 10,
    minScrollDistance = 5,
    inActiveScale = 0.8,
    inActiveOpacity = 0.8,
    inverted = false,
    initialIndex = 0,
    autoPlay = false,
    autoPlayInterval = 4000,
    bounces = true,
    showsHorizontalScrollIndicator = false,
    keyExtractor = (item, index) => index.toString(),
    renderItem = () => {},
    onScrollEnd = () => {},
    onScrollBeginDrag = () => {},
    onScrollEndDrag = () => {},
    ...otherProps
  } = props;
  const scrollViewRef = useRef(null);
  const currentIndexRef = useRef(initialIndex);
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const scrollXRef = useRef(0);
  const scrollXBeginRef = useRef(0);
  const xOffsetRef = useRef(new Animated.Value(0));
  const handleOnScrollRef = useRef(() => {});
  const halfContainerWidth = containerWidth / 2;
  const halfItemWidth = itemWidth / 2;
  const itemTotalMarginBothSide = getItemTotalMarginBothSide();
  const containerStyle = [styles.container, { width: containerWidth }, style];
  const dataLength = data ? data.length : 0;

  let interval;
  useEffect(() => {
    if (!isAutoPlay) {
      return;
    }
    interval = setInterval(() => {
      generateAutoPlay()
    }, autoPlayInterval);
    return () => {
      clearInterval(interval);
    }
  }, [isAutoPlay])

  useConstructor(() => {
    setScrollHandler();
  });

  useImperativeHandle(ref, () => ({
    scrollToIndex: scrollToIndex
  }));

  function isLastItem(index) {
    return index === dataLength - 1;
  }

  function isFirstItem(index) {
    return index === 0;
  }

  function getItemLayout(data, index) {
    return {
      offset: getItemOffset(index),
      length: itemWidth,
      index
    };
  }

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
    if (index < 0 || index >= dataLength) {
      return;
    }
    onScrollEnd && onScrollEnd(data[index], index);
    currentIndexRef.current = index;
    setTimeout(() => {
      scrollViewRef.current &&
        scrollViewRef.current.scrollToOffset({
          offset: getItemOffset(index),
          animated: true
        });
    });
  }

  function generateAutoPlay() {
    scrollToIndex(
      (currentIndexRef.current + 1) % (data.length - 1)
    );
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
    const scrollDistance = scrollXRef.current - scrollXBeginRef.current;
    scrollXBeginRef.current = 0;
    if (Math.abs(scrollDistance) < minScrollDistance) {
      scrollToIndex(currentIndexRef.current);
      return;
    }
    if (scrollDistance < 0) {
      scrollToIndex(currentIndexRef.current - 1);
    } else {
      scrollToIndex(currentIndexRef.current + 1);
    }
  }

  function handleTouchStart() {
    setIsAutoPlay(false);
  }

  function handleTouchEnd() {
    setIsAutoPlay(true);
  }

  function getItemTotalMarginBothSide() {
    const compensatorOfSeparatorByScaleEffect = (1 - inActiveScale) * itemWidth;
    return separatorWidth - compensatorOfSeparatorByScaleEffect / 2;
  }

  function getItemOffset(index) {
    return (
      index * (itemWidth + itemTotalMarginBothSide) -
      (halfContainerWidth - halfItemWidth)
    );
  }

  function getAnimatedOffset(index) {
    if (isFirstItem(index)) {
      return halfItemWidth;
    }
    if (isLastItem(index)) {
      return containerWidth - halfItemWidth;
    }
    return halfContainerWidth;
  }

  function getMidPontInterpolate(index, animatedOffset) {
    return (
      index * (itemWidth + itemTotalMarginBothSide) +
      halfItemWidth -
      animatedOffset
    );
  }
  function getStartPontInterpolate(index, midPoint) {
    if (index === 1) {
      return 0;
    }
    if (isLastItem(index)) {
      return (
        (dataLength - 2) * (itemWidth + itemTotalMarginBothSide) +
        halfItemWidth -
        halfContainerWidth
      );
    }
    return midPoint - itemWidth - itemTotalMarginBothSide;
  }

  function getEndPointInterpolate(index, midPoint) {
    if (isFirstItem(index)) {
      return (
        itemWidth + itemTotalMarginBothSide + halfItemWidth - halfContainerWidth
      );
    }
    if (index === dataLength - 2) {
      return (
        (dataLength - 1) * (itemWidth + itemTotalMarginBothSide) +
        itemWidth -
        containerWidth
      );
    }
    return midPoint + itemWidth + itemTotalMarginBothSide;
  }

  function getItemAnimatedStyle(index) {
    const animatedOffset = getAnimatedOffset(index);
    const midPoint = getMidPontInterpolate(index, animatedOffset);
    const startPoint = getStartPontInterpolate(index, midPoint);
    const endPoint = getEndPointInterpolate(index, midPoint);
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

  function getItemMarginStyle(index) {
    const marginSingleItemSide = itemTotalMarginBothSide / 2;
    if (isFirstItem(index)) {
      return !!inverted
        ? { marginLeft: marginSingleItemSide }
        : { marginRight: marginSingleItemSide };
    }
    if (isLastItem(index)) {
      return !!inverted
        ? { marginRight: marginSingleItemSide }
        : { marginLeft: marginSingleItemSide };
    }
    return { marginHorizontal: marginSingleItemSide };
  }

  function renderItemContainer({ item, index }) {
    return (
      <Animated.View
        pointerEvents={'box-none'}
        style={[
          styles.itemContainer,
          itemContainerStyle,
          { width: itemWidth },
          getItemMarginStyle(index),
          getItemAnimatedStyle(index)
        ]}
      >
        {renderItem({ item, index })}
      </Animated.View>
    );
  }

  return (
    <AnimatedFlatList
      {...otherProps}
      ref={scrollViewRef}
      data={data}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={containerStyle}
      horizontal={true}
      inverted={inverted}
      bounces={bounces}
      decelerationRate={0}
      initialScrollIndex={initialIndex}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      onScroll={handleOnScrollRef.current}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      renderItem={renderItemContainer}
      onScrollBeginDrag={handleOnScrollBeginDrag}
      onScrollEndDrag={handleOnScrollEndDrag}
    />
  );
}

export default forwardRef(Carousel);
