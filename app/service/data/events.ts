import { fetchFromGraphQL, gql } from '~/service/utils';

export interface Event {
  id: number;
  slug: string;
  title: string;
  url: string;
  type: 'event' | 'festival';
  featuredImage: { url: string }[];
  date: string;
  dateEnd: string;
  openingTime: string;
  closingTime: string;
  linkedFestival: string;
  organizer:{
    title: string;
  }
  location: {
    title: string;
    venue: string;
    room: string;
  }[];
  ticketLink: string;
  ticketDescription: string;
  performances:{
    title: string;
    slug: string;
    date: string;
    time: string;
    timeEnd: string;
    openingTime: string;
    closingTime: string;
    location: {
      title: string;
      venue: string;
      room: string;
    }[];
    artist: {
      title: string;
      featuredImage: { url: string }[];
    }[];
  }[];
  linkedEvents: {
    title: string;
    date: string;
    dateEnd: string;
    slug: string;
    featuredImage: { url: string }[];
    location: {
      title: string;
      venue: string;
      room: string;
    }[];
    performances: {
      title: string;
      date: string;
      time: string;
      timeEnd: string;
      slug: string;
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
      }[];
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
          venue
          room
        }
        organizer {
          title
        }
        linkedFestival{
          slug
        }
        date
        dateEnd
        ticketLink
        ticketDescription
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
          venue
          room
        }
        organizer {
          title
        }
        date
        dateEnd
        ticketLink
        ticketDescription
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
        linkedEvents{
          title
          slug
          ... on events_event_Entry{
            date
            dateEnd
            location {
              title
              fullTitle
            }
            featuredImage: artistFeaturedPhoto {
              url
            }
            performances {
              ... on performance_performance_Entry {
                title
                slug
                date
                time
                timeEnd
                location {
                  title
                  fullTitle
                }
                artist {
                  slug
                  ... on artists_artist_Entry {
                    title
                    artistMeta
                    featuredImage: artistFeaturedPhoto {
                      url
                    }
                  }
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
