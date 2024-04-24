import React, { useRef } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';

interface WheelPickerProps {
    wheelWidth: number;
    itemHeight: number;
    data: string[];
    visibleNum?: 1 | 2 | 3;
    selectIndex: number;
    onChange?: (index: number) => void;
}

const WheelPicker: React.FC<WheelPickerProps> = (props) => {
    const _visibleNum = props.visibleNum ?? 2;

    const listRef = useRef<FlatList<string> | null>(null);
    const visibleNum = _visibleNum <= 3 ? _visibleNum : 3;
    const listHeight = (visibleNum * 2 + 1) * props.itemHeight;

    let data = props.data.slice();
    let i = visibleNum;
    while (i--) {
        data.unshift('');
        data.push('');
    }

    let maxOffsetY = data.length * props.itemHeight - listHeight;
    maxOffsetY = maxOffsetY > 0 ? maxOffsetY : 0;

    const scrollEndDrag = (event: {
        nativeEvent: {
            contentOffset: { x: number; y: number };
        };
    }) => {
        const y = event.nativeEvent.contentOffset.y;
        if (y < 0 || y > maxOffsetY) {
            console.log('out range');
            return;
        }

        const idx = Math.round(y / props.itemHeight);
        listRef.current?.scrollToIndex({
            animated: true,
            index: idx,
        });

        console.log(`ff ${event.nativeEvent.contentOffset.y}`);
    };

    const momentumScrollEnd = (event: {
        nativeEvent: {
            contentOffset: { x: number; y: number };
        };
    }) => {
        const y = event.nativeEvent.contentOffset.y;
        const idx = Math.round(y / props.itemHeight);
        props.onChange && props.onChange(idx);
    };

    return (
        <View style={[styles.container, { width: props.wheelWidth }]}>
            <View
                style={[
                    styles.selector,
                    { width: props.wheelWidth, height: props.itemHeight },
                ]}
            />
            <FlatList
                ref={listRef}
                contentOffset={{
                    x: 0,
                    y: props.selectIndex * props.itemHeight,
                }}
                overScrollMode="always"
                showsVerticalScrollIndicator={false}
                style={[styles.list, { maxHeight: listHeight }]}
                data={data}
                scrollEventThrottle={1}
                onScrollEndDrag={scrollEndDrag}
                onMomentumScrollEnd={momentumScrollEnd}
                onScrollToIndexFailed={() => {}}
                renderItem={({ item }) => {
                    return (
                        <View
                            style={[styles.row, { height: props.itemHeight }]}
                        >
                            <Text style={styles.rowTitle}>{item}</Text>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#EEEEEE',
    },

    selector: {
        borderWidth: 1,
        position: 'absolute',
    },

    list: {
        // backgroundColor: 'gray',
        backgroundColor: 'transparent',
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#EEEEEE',
        // borderWidth: 1
    },
    rowTitle: {
        color: 'black',
        fontSize: 12,
        fontWeight: 'normal',
    },
});

export default WheelPicker;
