import { Status } from "../@types/mastodon";

import config from "../../config.json";
    
const getUserTimeline = async (older_than_id: string | null): Promise<Array<Status>> => {
    let url = "https://sigmoid.social/api/v1/timelines/home"

    if (older_than_id) {
        url += `?max_id=${older_than_id}`
    }
    let data: Array<Status> = [];
    try {
        console.log("Fetching from: " + url);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                'Authorization': `Bearer ${config.access_token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        data = await response.json() as Array<Status>;
    } catch (error) {
        console.log("Error", error);
    }
    return data
}


export {
    getUserTimeline
}