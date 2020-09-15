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
  activeOffset: number;
  children: (arg: (prop: positionType) => unknown) => ReactNode;
}

export interface ScrollState {
  positions: {
    [key: string]: positionDataType;
  };
}

export class Scroll extends Component<ScrollProps, ScrollState> {
  constructor(props: ScrollProps) {
    super(props);
    this.state = {
      positions: {},
    };
  }
  scrollRef = React.createRef<ScrollView>();

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { onScroll: onScrollProp } = this.props;
    const {
      nativeEvent: {
        contentOffset: {},
      },
    } = event;
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

  scrollToSpy = (identifier: string) => {
    this.scrollRef.current?.scrollTo(this.state.positions[identifier]);
  };

  componentDidMount() {
    setTimeout(() => {
      this.scrollToSpy('150');
    }, 3000);
  }

  render() {
    const { children, ...otherProps } = this.props;

    console.log(this.state.positions);

    return (
      <ScrollView ref={this.scrollRef} {...otherProps}>
        {children(this.updateScrollPositions)}
      </ScrollView>
    );
  }
}

// export const Scroll = forwardRef<ScrollView, ScrollProps>(
//   ({ onScroll: onScrollProp, children, ...otherProps }, ref) => {
//     const [positions, setPositions] = useState<{
//       [key: string]: { x: number; y: number };
//     }>({});

//     const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//       const {
//         nativeEvent: {
//           contentOffset: { y, x },
//         },
//       } = event;
//       onScrollProp && onScrollProp(event);
//     };

//     console.log(positions);

//     return (
//       <ScrollView ref={ref} onScroll={onScroll} {...otherProps}>
//         {children(setPositions)}
//       </ScrollView>
//     );
//   }
// );

export interface SpyProps extends ViewProps {
  identifier: string;
  locator: (prop: positionType) => unknown;
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
