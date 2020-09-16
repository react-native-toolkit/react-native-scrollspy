import React, { useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Button,
} from 'react-native';
import { Scroll, Spy } from 'react-native-scrollspy';

export default function App() {
  const verticalScrollViewRef = useRef(React.createRef<ScrollView>()).current;
  const verticalScrollRef = useRef(React.createRef<Scroll>()).current;

  const horizontalScrollViewRef = useRef(React.createRef<ScrollView>()).current;
  const horizontalScrollRef = useRef(React.createRef<Scroll>()).current;

  const onVerticalSectionChange = (identifier: string) => {
    horizontalScrollRef.current?.scrollToSpy(identifier);
  };

  // const onHorizontalSectionChange = (identifier: string) => {
  //   verticalScrollRef.current?.scrollToSpy(identifier);
  // };

  const scrollToIdentifier = (identifier: string) => {
    horizontalScrollRef.current?.scrollToSpy(identifier);
    verticalScrollRef.current?.scrollToSpy(identifier);
  };

  const scrollX = () => horizontalScrollViewRef.current?.scrollToEnd();

  const scrollY = () => verticalScrollViewRef.current?.scrollToEnd();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.horizontalContainer}>
        <Scroll
          horizontal
          activeOffset={-64}
          // onActiveSectionChange={onHorizontalSectionChange}
          ref={horizontalScrollRef}
          scrollViewRef={horizontalScrollViewRef}
        >
          {(locator) => {
            return [...Array(200).keys()].map((each) => {
              return (
                <Spy key={each} identifier={`${each}`} locator={locator}>
                  <TouchableOpacity
                    onPress={() => scrollToIdentifier(`${each}`)}
                    style={styles.row}
                  >
                    <Text key={each}>{each}</Text>
                  </TouchableOpacity>
                </Spy>
              );
            });
          }}
        </Scroll>
      </View>

      <View style={styles.container}>
        <Scroll
          activeOffset={-64}
          onActiveSectionChange={onVerticalSectionChange}
          ref={verticalScrollRef}
          scrollViewRef={verticalScrollViewRef}
        >
          {(locator) => {
            return [...Array(200).keys()].map((each) => {
              return (
                <Spy key={each} identifier={`${each}`} locator={locator}>
                  <TouchableOpacity
                    onPress={() => scrollToIdentifier(`${each}`)}
                    style={styles.row}
                  >
                    <Text key={each}>{each}</Text>
                  </TouchableOpacity>
                </Spy>
              );
            });
          }}
        </Scroll>
      </View>

      <TouchableOpacity style={styles.scrollX}>
        <Button onPress={scrollX} title="Scroll X" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.scrollY}>
        <Button onPress={scrollY} title="Scroll Y" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {},
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        height: '100vh',
        width: '100vw',
      },
    }),
  },
  row: {
    padding: 32,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
  },
  scrollX: { position: 'absolute', bottom: 56, left: 24 },
  scrollY: { position: 'absolute', bottom: 56, right: 24 },
});
