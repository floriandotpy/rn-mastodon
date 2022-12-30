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
  useWindowDimensions
} from 'react-native';


import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import RenderHtml from 'react-native-render-html';
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
   paddingTop: 22
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 24,
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
    marginBottom: 8
  },
  item_content: {
    fontSize: 16,
  },

});

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Timeline = () => {

  const { width } = useWindowDimensions();
  const [timeline, setTimeline] = useState<Array<Status>>([]);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (shouldRefresh) {
      console.log("Refreshing from API")
      const fetchData = async () => {
        setTimeline(await getUserTimeline(null))
      }
      fetchData()
    }
    // the wait needs to be required to force that the loading indicator is visible briefly
    wait(500).then(() => {
      setShouldRefresh(false)
    })
  }, [shouldRefresh])

  const onRefresh = useCallback(() => {
    console.log("pulled: refresh")
    setShouldRefresh(true);
  }, []);

  const loadMore = useCallback(() => {
    console.log("Loading more from API")
    const fetchData = async () => {
      let lastId = null;
      if (timeline.length > 0) {
        const lastToot = timeline[timeline.length - 1]
        lastId = lastToot.id
      }
      const previousToots = await getUserTimeline(lastId)
      setTimeline((existingTimeline) => {
        return [...existingTimeline, ...previousToots]})
    }
    fetchData()
  }, [timeline]);

  const renderItem = ({item}) => {
    const source = {
      html: item.content
    }
    return (
      <View style={listStyles.item}>
        <Text style={listStyles.item_title}>{item.account.display_name}</Text>
        <Text style={listStyles.item_meta}>@{item.account.acct} · {item.created_at}</Text>
        {item.reblog ? <Text>This is a reblog</Text> : 
          <RenderHtml
            baseStyle={listStyles.item_content}
            contentWidth={width}
            source={source}
          />
        }
        {/* <Text style={listStyles.item_content}>{item.content}</Text> */}
        {/* <Text>Width: {width}</Text> */}
        
      </View>
    ) 
  }

  return (
    <View>
      <FlatList 
        style={listStyles.container} 
        data={timeline}
        renderItem={renderItem}
        keyExtractor={item => item.id}

        // pull-to-refresh
        refreshing={shouldRefresh}
        onRefresh={onRefresh}

        // infinite scroll
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ></FlatList>
    </View>
  );
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Timeline />
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
