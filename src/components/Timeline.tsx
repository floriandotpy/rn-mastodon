import { getUserTimeline } from "../service/mastodonService"
import React, { useEffect, useState, useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
    Image
} from 'react-native';

import RenderHtml from 'react-native-render-html';
import { ImageAttachment, MediaAttachment, Status } from "../@types/mastodon";

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

interface ImageAttachmentProps {
    attachment: ImageAttachment,
    cropHeight: boolean
}

const ImageAttachmentView = (props: ImageAttachmentProps) => {
    const a = props.attachment

    // compute image dimension to fill width of screen
    const fillScreenRatio = 0.9 // 1.0 to fill width 100%
    const { width } = useWindowDimensions();
    const imageDimensions = a.meta.small
    const imageWidth = width * fillScreenRatio;


    const imageHeight = (props.cropHeight ? 200
        : Math.round(width / imageDimensions.width * imageDimensions.height * fillScreenRatio))

    // TODO: Add runctionality to view image in full size when tapping
    return (
        <View>
            <Image
                source={{ uri: a.preview_url }}
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    marginBottom: 2,
                    borderWidth: 1,
                    borderColor: "#cccccc"
                }}
            />
        </View>

    )
}

interface AttachmentsProps {
    attachements: Array<MediaAttachment>
}
const AttachementsView = (props: AttachmentsProps) => {
    const attachementToView = (attachment: MediaAttachment) => {
        switch (attachment.type) {
            case "image":
                return <ImageAttachmentView
                    attachment={attachment as ImageAttachment}
                    cropHeight={true} />
            case "audio":
                return <Text>Audio attachment not supported yet</Text>
            case "gifv":
                return <Text>Gifv attachment not supported yet</Text>
            case "video":
                return <Text>Video attachment not supported yet</Text>
            case "unknown":
                return <Text>Unknown attachement</Text>
        }
    }
    return (
        <View>
            {props.attachements.map(attachementToView)}
        </View>
    )
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
            <Text style={styles.item_meta}>@{item.account.acct} ?? {formatDate(item.created_at)}</Text>
            <RenderHtml
                baseStyle={styles.item_content}
                contentWidth={width}
                source={source}
            />
            {item.media_attachments?.length > 0 ? <AttachementsView attachements={item.media_attachments} /> : ""}

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
        borderBottomColor: "#DDDDDD",
        borderBottomWidth: 1,
    },
    item_title: {
        fontFamily: "Menlo",
        fontSize: 14,
        fontWeight: "bold"
    },
    item_meta: {
        fontSize: 14,
        fontFamily: "Menlo",
        color: "#666666",
        marginBottom: 6
    },
    item_content: {
        fontFamily: "Menlo",
        fontSize: 14,
        lineHeight: 18
    },
    item_reblog: {
        fontWeight: "bold",
        fontSize: 12,
        fontFamily: "Menlo",
        color: "#444444",
        marginBottom: 8
    }

});

export {
    Timeline
}
