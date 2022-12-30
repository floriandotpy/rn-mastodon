import { Status } from "../@types/mastodon";

const timeline: Status[] = require("../../assets/data/timeline.json")

const getUserTimeline = (): Array<Status> => {
    return timeline
}

export {
    getUserTimeline
}