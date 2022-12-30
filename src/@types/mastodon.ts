
/*
Source of some types: tsl-mastodon-api
*/
type AudioAttachment = {
    blurhash?: (string | null);
    description?: (string | null);
    id: string;
    meta: AudioAttachmentMeta;
    preview_url: string;
    remote_url?: (string | null);
    /** @deprecated */
    text_url?: string;
    type: 'audio';
    url: string;
}
type AudioAttachmentMeta = {
    audio_bitrate: string;
    audio_channels: string;
    audio_encode: string;
    duration: number;
    length: string;
    original: AudioAttachmentMetaOriginal;
}
type AudioAttachmentMetaOriginal = {
    bitrate: number;
    duration: number;
}
type GIFVAttachment = {
    blurhash: string;
    description?: (string | null);
    id: string;
    meta: GIFVAttachmentMeta;
    preview_url: string;
    remote_url?: (string | null);
    /** @deprecated */
    text_url?: string;
    type: 'gifv';
    url: string;
}
type GIFVAttachmentMeta = {
    aspect: number;
    duration: number;
    fps: number;
    height: number;
    length: string;
    original: GIFVAttachmentMetaOriginal;
    size: string;
    small: GIFVAttachmentMetaSmall;
    width: number;
}
type GIFVAttachmentMetaOriginal = {
    bitrate: number;
    duration: number;
    frame_rate: string;
    height: number;
    width: number;
}
type GIFVAttachmentMetaSmall = {
    aspect: number;
    height: number;
    size: string;
    width: number;
}
type ImageAttachment = {
    blurhash: string;
    description?: (string | null);
    id: string;
    meta: ImageAttachmentMeta;
    preview_url: string;
    remote_url?: (string | null);
    /** @deprecated */
    text_url?: string;
    type: 'image';
    url: string;
}
type ImageAttachmentMeta = {
    focus: ImageAttachmentMetaFocus;
    original: ImageAttachmentMetaOriginal;
    small: ImageAttachmentMetaSmall;
}
type ImageAttachmentMetaFocus = {
    x: number;
    y: number;
}
type ImageAttachmentMetaOriginal = {
    aspect: number;
    height: number;
    size: string;
    width: number;
}
type ImageAttachmentMetaSmall = {
    aspect: number;
    height: number;
    size: string;
    width: number;
}
type MediaAttachment = (AudioAttachment | GIFVAttachment | ImageAttachment );


type Account = {
    acct: string;
    avatar?: string;
    avatar_static?: string;
    bot?: boolean;
    created_at: string;
    discoverable?: boolean;
    display_name: string;
    followers_count: number;
    following_count: number;
    group?: boolean;
    header?: string;
    header_static?: string;
    id: string;
    last_status_at: string;
    locked?: boolean;
    note?: string;
    statuses_count: number;
    url: string;
    username: string;
}

type FilterResult = {
    // TODO
}

type StatusMention = {
    id: string,
    username: string,
    url: string,
    acct: string
}

type Tag = {
    // TODO
}

type CustomEmoji = {
    // TODO
}

type PreviewCard = {
    // TODO
}

type Poll = {
    // TODO
}

type Status = {
    id: string,
    created_at: string,
    in_reply_to_id: string | null,
    in_reply_to_account_id: string | null,
    sensitive: boolean,
    spoiler_text: string,
    visibility: string,  // TODO enum
    language: string | null,
    uri: string,
    url: string,
    replies_count: number,
    reblogs_count: number,
    favourites_count: number,
    edited_at: string | null,
    favourited: boolean,
    reblogged: boolean,
    muted: boolean,
    bookmarked: boolean,
    content: string,
    filtered?: Array<FilterResult>,
    reblog: Status | null,
    media_attachments: Array<MediaAttachment>,
    mentions: Array<StatusMention>,
    tags: Array<Tag>,
    emojis: Array<CustomEmoji>,
    card: PreviewCard | null,
    poll: Poll | null,
    application?: string,
    account: Account,

}

export type { 
    Status, 
    Account 
};