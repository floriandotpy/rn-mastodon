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
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';

import RenderHtml from 'react-native-render-html';
import { Status } from "./src/@types/mastodon";



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


const formatDate = (dateString: string): string => {

  const secondsNow = Math.floor(new Date().getTime() / 1000);
  const secondsOther = Math.floor(new Date(dateString).getTime() / 1000);
  const diff = Number(secondsNow - secondsOther);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) {
    const seconds = Math.round(diff);
    return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`
  } else if (diff < hour) {
    const minutes = Math.round(diff / minute);
    return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
  } else if (diff < day) {
    const hours = Math.round(diff / hour);
    return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
  } else if (diff < month) {
    const days = Math.round(diff / day)
    return `${days} ${days > 1 ? "days" : "day"} ago`;
  } else if (diff < year) {
    const months = Math.round(diff / month);
    return `${months} ${months > 1 ? "months" : "month"} ago`;
  } else { // diff > year
    const years = Math.round(diff / year);
    return `${years} ${years > 1 ? "years" : "year"} ago`;
  }
}

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
        return [...existingTimeline, ...previousToots]
      })
    }
    fetchData()
  }, [timeline]);

  const renderItem = ({ item }) => {
    const source = {
      html: item.content
    }
    return (
      <View style={listStyles.item}>
        <Text style={listStyles.item_title}>{item.account.display_name}</Text>
        <Text style={listStyles.item_meta}>@{item.account.acct} · {formatDate(item.created_at)}</Text>
        {item.reblog ? <Text>This is a reblog</Text> :
          <RenderHtml
            baseStyle={listStyles.item_content}
            contentWidth={width}
            source={source}
          />
        }
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
  return (
    <SafeAreaView>
      <Timeline />
    </SafeAreaView>
  );
};

export default App;
