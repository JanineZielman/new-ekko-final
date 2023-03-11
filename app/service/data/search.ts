import { fetchFromGraphQL, gql } from '~/service/utils';

export interface SearchResults {
  artists: {
    id: number;
    slug: string;
    title: string;
    url: string;
    featuredImage: { url: string }[];
    meta?: string;
  }[];
  events: {
    id: number;
    slug: string;
    title: string;
    url: string;
    type: 'event' | 'festival';
    featuredImage: { url: string }[];
    date: string;
  }[];
}

const query = gql`
  query Search($query: String!) {
    artists: entries(search: $query, section: "artists") {
      id
      slug
      url
      title
      ... on artists_artist_Entry {
        featuredImage: artistFeaturedPhoto {
          url
        }
        meta: artistMeta
      }
    }
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
        date @formatDateTime(format: "d/n/Y")
      }
      ... on events_festival_Entry {
        featuredImage: eventFeaturedPhoto {
          url
        }
        date @formatDateTime(format: "d/n/Y")
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
