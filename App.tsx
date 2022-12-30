/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import { getUserTimeline } from "./src/service/mastodonService"
import React, {useEffect, useState, useCallback, type PropsWithChildren} from 'react';
import {
  Button,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Status } from "./src/@types/mastodon";

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const listStyles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 8,
    borderBottomColor: "#A6A6AA",
    borderBottomWidth: 1
  },
  item_title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  item_meta: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4
  },
  item_content: {
    fontSize: 16,
  },

});

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Timeline = () => {

  const [timeline, setTimeline] = useState<Array<Status>>([]);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(true);

  // const timeline = getUserTimeline();
  useEffect(() => {
    if (shouldRefresh) {
      console.log("Refreshing from API")
      const fetchData = async () => {
        setTimeline(await getUserTimeline())
      }
      fetchData()
    }
    // the wait needs to be required to force that the loading indicator is visible briefly
    wait(500).then(() => {
      setShouldRefresh(false)
    })
  }, [shouldRefresh])

  const onRefresh = useCallback(() => {
    console.log("onRefresh")
    setShouldRefresh(true);
    console.log(shouldRefresh)
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={listStyles.item}>
        <Text style={listStyles.item_title}>{item.account.display_name}</Text>
        <Text style={listStyles.item_meta}>@{item.account.acct} · {item.created_at}</Text>
        <Text>{item.reblog ? "This is a reblog" : ""}</Text>
        <Text style={listStyles.item_content}>{item.content}</Text>
      </View>
    ) 
  }

  return (
    <View>
      <Button onPress={onRefresh} title="Refresh" />
      <FlatList 
        style={listStyles.container} 
        data={timeline}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={shouldRefresh}
        onRefresh={onRefresh}
        ></FlatList>
    </View>
  );
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          
          <Timeline />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
