import { getUserTimeline } from "../service/mastodonService"
import React, { useEffect, useState, useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    useWindowDimensions
} from 'react-native';

import RenderHtml from 'react-native-render-html';
import { Status } from "../@types/mastodon";

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

interface StatusProps {
    status: Status
}
const StatusView = (props: StatusProps) => {
    const { width } = useWindowDimensions();
    const item = props.status
    const source = {
        html: item.content
    }
    return (
        <View>
            <Text style={styles.item_title}>{item.account.display_name}</Text>
            <Text style={styles.item_meta}>@{item.account.acct} · {formatDate(item.created_at)}</Text>
            {item.reblog ? <Text>This is a reblog</Text> :
                <RenderHtml
                    baseStyle={styles.item_content}
                    contentWidth={width}
                    source={source}
                />
            }
        </View>
    )
}

const Timeline = () => {

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
        if (item.reblog) {
            return (
                <View style={styles.item}>
                    <Text style={styles.item_reblog}>{item.account.display_name} reblogged:</Text>
                    <StatusView status={item.reblog} />
                </View>
            )
        } else {
            return (
                <View style={styles.item}>
                    <StatusView status={item} />
                </View>
            )
        }
    }

    return (
        <View>
            <FlatList
                style={styles.container}
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

const styles = StyleSheet.create({
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
        marginBottom: 6
    },
    item_content: {
        fontSize: 16,
    },
    item_reblog: {
        fontWeight: "bold",
        color: "#444444",
        marginBottom: 6
    }

});

export {
    Timeline
}
