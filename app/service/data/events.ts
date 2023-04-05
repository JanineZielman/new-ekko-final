import { fetchFromGraphQL, gql } from '~/service/utils';

export interface Event {
  id: number;
  slug: string;
  title: string;
  url: string;
  type: 'event' | 'festival';
  featuredImage: { url: string }[];
  date: string;
  openingTime: string;
  closingTime: string;
  location: {
    title: string;
    fullTitle: string;
  }[];
  ticketLink: string;
  performances:{
    title: string;
    slug: string;
    date: string;
    time: string;
    timeEnd: string;
    location: {
      title: string;
      fullTitle: string;
    }[];
    artist: {
      title: string;
      featuredImage: { url: string }[];
    }[];
  }[];
}

export interface AllEvents {
  events: Event[];
}

const query = gql`
  query Kalender($limit: Int!) {
    events: entries(section: "events", orderBy: "date DESC", limit: $limit) {
      id
      slug
      title
      url
      type: typeHandle
      ... on events_event_Entry {
        openingTime
        closingTime
        featuredImage: eventFeaturedPhoto {
          url
        }
        location {
          title
          fullTitle
        }
        date
        ticketLink
        performances {
          title
          slug
          date
          time
          timeEnd
          location {
            title
            fullTitle
          }
          ... on performance_performance_Entry {
            artist {
              title
              ... on artists_artist_Entry {
                featuredImage: artistFeaturedPhoto{
                  url
                }
              }
            }
          }
        }
      }
      ... on events_festival_Entry {
        featuredImage: eventFeaturedPhoto {
          url
        }
        location {
          title
          fullTitle
        }
        date
        performances {
          title
          slug
          date
          time
          timeEnd
          location {
            title
            fullTitle
          }
          ... on performance_performance_Entry {
            artist {
              title
              ... on artists_artist_Entry {
                featuredImage: artistFeaturedPhoto{
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

export const fetchAllEvents = async (limit:number) => {
  const res = await fetchFromGraphQL(query, { limit });
  const { data } = await res.json();

  return data as AllEvents;
};
