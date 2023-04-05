import { fetchFromGraphQL, gql } from '~/service/utils';

export interface SearchResults {
  events: {
    id: number;
    slug: string;
    title: string;
    url: string;
    type: 'event' | 'festival';
    featuredImage: { url: string }[];
    date: string;
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
  }[];
}

const query = gql`
  query Search($query: String!) {
    events: entries(search: $query, section: "events", orderBy: "date DESC") {
      id
      slug
      title
      url
      type: typeHandle
      ... on events_event_Entry {
        featuredImage: eventFeaturedPhoto {
          url
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
      ... on events_festival_Entry {
        featuredImage: eventFeaturedPhoto {
          url
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

export const fetchSearchResults = async (searchQuery: string) => {
  if (!searchQuery) return { entries: [] } as SearchResults;

  const res = await fetchFromGraphQL(query, { query: searchQuery });
  const { data } = await res.json();

  return data as SearchResults;
};
