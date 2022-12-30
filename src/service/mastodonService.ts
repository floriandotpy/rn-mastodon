import { Status } from "../@types/mastodon";

import config from "../../config.json";
    
const getUserTimeline = async (): Promise<Array<Status>> => {
    const url = "https://sigmoid.social/api/v1/timelines/home"
    let data: Array<Status> = [];
    try {

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