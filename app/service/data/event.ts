import { fetchFromGraphQL, gql } from '~/service/utils';

export interface Event {
  id: number;
  slug: string;
  title: string;
  url: string;
  singlePage: boolean;
  showArtistInfo: boolean;
  organizer: { title: string }[];
  featuredImage: { url: string }[];
  isMultiDay: boolean;
  date: string;
  dateEnd: string;
  location: {
    title: string;
    venue: string;
    room: string;
  }[];
  gallery: {
    url: string;
    title: string;
  }[];
  intro: string;
  description: string;
  ticketLink: string;
  ticketDescription: string;
  openingTime: string;
  closingTime: string;
  complexContent: (
    | { blockType: 'text'; text: string }
    | { blockType: 'video'; videoUrl: string }
    | { blockType: 'embed'; code: string }
    | { blockType: 'imageBlock'; image: {url: string}[] }
  )[];
  performances: {
    slug: string;
    fullTitle: string;
    date: string;
    time: string;
    timeEnd: string;
    location: {
      title: string;
      venue: string;
      room: string;
    }[];
    artist: {
      slug: string;
      title: string;
      artistMeta: string;
      featuredImage: { url: string }[];
      relatedLinks: {
        linkTitle: string;
        linkUrl: string;
      }[];
      complexContent: (
        | { blockType: 'text'; text: string }
        | { blockType: 'video'; videoUrl: string }
        | { blockType: 'embed'; code: string }
        | { blockType: 'imageBlock'; image: {url: string}[] }
      )[];
    }[];
  }[];
}

const eventFragment = gql`
  fragment eventData on events_event_Entry {
    organizer {
      title
    }
    featuredImage: eventFeaturedPhoto {
      url
    }
    isMultiDay
    singlePage
    showArtistInfo
    date
    dateEnd
    openingTime
    closingTime
    location {
      title
      venue
      room
    }
    gallery{
      url
      title
    }
    intro
    description
    ticketLink
    ticketDescription
    complexContent {
      ... on complexContent_text_BlockType {
        blockType: typeHandle
        text
      }
      ... on complexContent_video_BlockType {
        blockType: typeHandle
        videoUrl
      }
      ... on complexContent_embed_BlockType {
        blockType: typeHandle
        code
      }
      ... on complexContent_imageBlock_BlockType {
        blockType: typeHandle
        image {
          url
        }
      }
    }
    performances {
      ... on performance_performance_Entry {
        slug
        fullTitle
        date
        time
        timeEnd
        location {
          title
          venue
          room
        }
        artist {
          slug
          ... on artists_artist_Entry {
            title
            artistMeta
            featuredImage: artistFeaturedPhoto {
              url
            }
            relatedLinks {
              linkTitle
              linkUrl
            }
            complexContent {
              ... on complexContent_text_BlockType {
                blockType: typeHandle
                text
              }
              ... on complexContent_video_BlockType {
                blockType: typeHandle
                videoUrl
              }
              ... on complexContent_embed_BlockType {
                blockType: typeHandle
                code
              }
              ... on complexContent_imageBlock_BlockType {
                blockType: typeHandle
                image {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

const query = gql`
  query Event($slug: String!) {
    entry(section: "events", slug: [$slug]) {
      id
      slug
      title
      url
      ...eventData
    }
  }

  ${eventFragment}
`;

export const fetchEvent = async (slug: string) => {
  const res = await fetchFromGraphQL(query, { slug });
  const { data } = await res.json();

  return data?.entry as Event;
};
