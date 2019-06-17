import React, {Component} from 'react';
import {Animated, StyleSheet, Dimensions, ViewPropTypes, FlatList} from 'react-native';
import PropTypes from 'prop-types';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {},
    itemContainer: {justifyContent: 'center', backgroundColor: 'white'},
    button: {}
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.scrollToIndex = this.scrollToIndex.bind(this);
        this.scrollToClosestPoint = this.scrollToClosestPoint.bind(this);
        this.itemAnimatedStyles = this.itemAnimatedStyles.bind(this);
        this.renderItemContainer = this.renderItemContainer.bind(this);
        this.handleOnMomentumScrollEnd = this.handleOnMomentumScrollEnd.bind(this);
        this.initialize();
        this.setScrollHandler();
    }

    initialize() {
        const {itemWidth, separatorWidth, data, containerWidth} = this.props;
        this.xOffset = new Animated.Value(0);
        this.halfContainerWidth = containerWidth / 2;
        this.halfItemWidth = itemWidth / 2;
        this.itemMidPoints = data.reduce((result, item, index) => {
            const midPositionOfItem =
                index * (itemWidth + separatorWidth) + this.halfItemWidth;
            result.push({value: midPositionOfItem, index, item});
            return result;
        }, []);
    }

    setScrollHandler() {
        this.handleOnScroll = Animated.event(
            [{nativeEvent: {contentOffset: {x: this.xOffset}}}],
            {
                useNativeDriver: true,
                listener: (event) => {
                    this.scrollX = event.nativeEvent.contentOffset.x;
                }
            }
        );
    }

    scrollToClosestPoint() {
        const {onScrollEnd, pagingEnable} = this.props;
        if (!pagingEnable) return;
        const viewportMidPosX = this.scrollX + this.halfContainerWidth;
        const closestPoint = this.itemMidPoints.reduce(
            (prevResult, currentItem) =>
                Math.abs(prevResult.value - viewportMidPosX) >
                Math.abs(currentItem.value - viewportMidPosX) ? currentItem : prevResult,
            this.itemMidPoints[0]
        );
        onScrollEnd(closestPoint.item, closestPoint.index);

        this._scrollView.getNode().scrollToOffset({
            offset: closestPoint.value - this.halfContainerWidth,
            animated: true
        });
    }

    scrollToIndex(index) {
        const {onScrollEnd, data} = this.props;
        if (index < 0 || index >= data.length) return;
        onScrollEnd(data[index], index);
        this._scrollView.getNode().scrollToOffset({
            offset: this.itemMidPoints[index].value - this.halfContainerWidth,
            animated: true
        });
    }

    handleOnMomentumScrollEnd() {
        // if (this._scrollTimeout) {
        //     clearTimeout(this._scrollTimeout);
        // }
        // this._scrollTimeout = setTimeout(() => {
        //     this.scrollToClosestPoint();
        //     this._scrollTimeout = null;
        // }, 0);
        this.scrollToClosestPoint();
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

        const animatedOffset = index === 0 ? this.halfItemWidth : index === data.length - 1
            ? containerWidth - this.halfItemWidth : this.halfContainerWidth;
        const midPoint = index * (itemWidth + separatorWidth) + this.halfItemWidth - animatedOffset;
        const startPoint = index === data.length - 1 ? midPoint - this.halfContainerWidth : midPoint - itemWidth - separatorWidth;
        const endPoint = index === 0 ? midPoint + this.halfContainerWidth : midPoint + itemWidth + separatorWidth;
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

        return {...animatedOpacity, ...animatedScale};
    }


    renderItemContainer({item, index}) {
        const {
            data,
            renderItem,
            itemWidth,
            separatorWidth,
            itemContainerStyle
        } = this.props;
        return (
            <Animated.View
                pointerEvents={'box-none'}
                style={[
                    styles.itemContainer,
                    itemContainerStyle,
                    {width: itemWidth},
                    index === data.length - 1 ? {} : {marginRight: separatorWidth},
                    this.itemAnimatedStyles(index)
                ]}
            >
                {renderItem({item, index})}
            </Animated.View>
        );
    }

    render() {
        const {data, style, itemWidth, containerWidth, initialIndex} = this.props;
        return (
            <AnimatedFlatList
                horizontal
                //bounces
                keyExtractor={(item, index) => index.toString()}
                //scrollEnabled
                ref={(ref) => this._scrollView = ref}
                automaticallyAdjustContentInsets={false}
                decelerationRate={0}
                style={[styles.container, {width: containerWidth}, style]}
                snapToInterval={itemWidth}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={initialIndex}
                //onScrollEndDrag={this.handleOnMomentumScrollEnd}
                onMomentumScrollEnd={this.handleOnMomentumScrollEnd}
                onScroll={this.handleOnScroll}
                data={data}
                renderItem={this.renderItemContainer}
            />
        );
    }
}

Carousel.propTypes = {
    style: ViewPropTypes.style,
    itemWidth: PropTypes.number,
    separatorWidth: PropTypes.number,
    containerWidth: PropTypes.number,
    itemContainerStyle: ViewPropTypes.style,
    inActiveScale: PropTypes.number,
    inActiveOpacity: PropTypes.number,
    renderItem: PropTypes.func,
    onScrollEnd: PropTypes.func,
    pagingEnable: PropTypes.bool,
    initialIndex: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object)
    //itemHeight: PropTypes.number,
    //containerHeight: PropTypes.number,
    //onItemPress: PropTypes.func,
};

Carousel.defaultProps = {
    inActiveScale: 0.8,
    inActiveOpacity: 0.8,
    separatorWidth: 0,
    containerWidth: width,
    itemWidth: 0.9 * width,
    data: [],
    style: {},
    initialIndex: 0,
    pagingEnable: true,
    itemContainerStyle: {},
    renderItem: () => {
    },
    onScrollEnd: () => {
    }
    //containerHeight: 200
    //itemHeight: 0.2 * height - 20,
};
export default Carousel;
