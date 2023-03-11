import { fetchFromGraphQL, gql } from '~/service/utils';

export interface RecentEvents {
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
  query HomePage($limit: Int!) {
    events: entries(section: "events", orderBy: "date DESC", limit: $limit) {
      id
      slug
      title
      url
      type: typeHandle
      ... on events_event_Entry {
        featuredImage: eventFeaturedPhoto {
          url
        }
        date @formatDateTime(format: "d/n")
      }
      ... on events_festival_Entry {
        featuredImage: eventFeaturedPhoto {
          url
        }
        date @formatDateTime(format: "d/n")
      }
    }
  }
`;

export const fetchRecentEvents = async (limit = 8) => {
  const res = await fetchFromGraphQL(query, { limit });
  const { data } = await res.json();

  return data as RecentEvents;
};
