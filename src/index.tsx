import React, { ReactNode, Component } from 'react';
import {
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  ViewProps,
  LayoutChangeEvent,
} from 'react-native';

export type positionDataType = {
  x: number;
  y: number;
};

export type positionType = {
  [key: string]: positionDataType;
};

export interface ScrollProps extends ScrollViewProps {
  activeOffset?: number;
  children: (arg: (prop: positionType) => unknown) => ReactNode;
  scrollViewRef?: React.RefObject<ScrollView>;
  onActiveSectionChange?: (identifier: string) => unknown;
}

export interface ScrollState {
  positions: {
    [key: string]: positionDataType;
  };
}

export class Scroll extends Component<ScrollProps, ScrollState> {
  scrollRef = React.createRef<ScrollView>();

  constructor(props: ScrollProps) {
    super(props);
    this.state = {
      positions: {},
    };
    if (props.scrollViewRef) {
      this.scrollRef = props.scrollViewRef;
    }
  }

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      onScroll: onScrollProp,
      activeOffset = 0,
      horizontal,
      onActiveSectionChange,
    } = this.props;
    const {
      nativeEvent: {
        contentOffset: { x, y },
      },
    } = event;

    for (const each in this.state.positions) {
      if (!horizontal) {
        if (y + activeOffset < this.state.positions?.[each]?.y) {
          onActiveSectionChange && onActiveSectionChange(each);
          break;
        }
      } else {
        if (x + activeOffset < this.state.positions?.[each]?.x) {
          onActiveSectionChange && onActiveSectionChange(each);
          break;
        }
      }
    }

    onScrollProp && onScrollProp(event);
  };

  updateScrollPositions = (position: positionType) => {
    this.setState({
      positions: {
        ...this.state.positions,
        ...position,
      },
    });
  };

  scrollToSpy = (identifier: string, animated = true) => {
    this.scrollRef.current?.scrollTo({
      ...this.state.positions[identifier],
      animated,
    });
  };

  render() {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScroll: onScrollProp,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      activeOffset,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onActiveSectionChange,
      children,
      scrollEventThrottle = 16,
      ...otherProps
    } = this.props;

    return (
      <ScrollView
        scrollEventThrottle={scrollEventThrottle}
        onScroll={this.onScroll}
        ref={this.scrollRef}
        {...otherProps}
      >
        {children(this.updateScrollPositions)}
      </ScrollView>
    );
  }
}

export interface SpyProps extends ViewProps {
  identifier: string;
  locator: (prop: positionType) => unknown;
  children?: ReactNode;
}

export const Spy = ({
  identifier,
  onLayout: onLayoutProp,
  locator,
  ...otherProps
}: SpyProps) => {
  const onLayout = (event: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { x, y },
      },
    } = event;

    locator({ [identifier]: { x, y } });

    onLayoutProp && onLayoutProp(event);
  };

  return <View onLayout={onLayout} {...otherProps} />;
};
