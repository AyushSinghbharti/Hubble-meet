import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface DividerProps {
    color?: string;
    thickness?: number;
    marginVertical?: number;
    marginHorizontal?: number;
    width?: number | string;
    style?: ViewStyle;
    align?: 'left' | 'center' | 'right';
    zIndex?: number;
    position?: 'relative' | 'absolute';
}

const Divider: React.FC<DividerProps> = ({
    color = '#E0E0E0',
    thickness = StyleSheet.hairlineWidth,
    marginVertical = 8,
    marginHorizontal = 0,
    width = '100%',
    align = 'center',
    zIndex = 1,
    position = 'relative',
    style,
}) => {
    const alignmentStyles: ViewStyle = {
        alignSelf:
            align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    };

    return (
        <View
            style={[
                {
                    height: thickness,
                    backgroundColor: color,
                    marginVertical,
                    marginHorizontal,
                    width,
                    zIndex,
                    position,
                },
                alignmentStyles,
                style,
            ]}
        />
    );
};

export default Divider;
