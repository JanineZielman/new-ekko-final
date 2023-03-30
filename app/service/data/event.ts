import { fetchFromGraphQL, gql } from '~/service/utils';

export interface Event {
  id: number;
  slug: string;
  title: string;
  url: string;
  organizer: { title: string }[];
  featuredImage: { url: string }[];
  isMultiDay: boolean;
  date: string;
  dateEnd: string;
  location: {
    title: string;
    fullTitle: string;
  }[];
  intro: string;
  description: string;
  ticketLink: string;
  ticketDescription: string;
  openingTime: string;
  closingTime: string;
  performances: {
    slug: string;
    fullTitle: string;
    date: string;
    time: string;
    timeEnd: string;
    location: {
      title: string;
      fullTitle: string;
    }[];
    artist: {
      slug: string;
      title: string;
      artistMeta: string;
      featuredImage: { url: string }[];
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
    date
    dateEnd
    openingTime
    closingTime
    location {
      title
      fullTitle
    }
    intro
    description
    ticketLink
    ticketDescription
    performances {
      ... on performance_performance_Entry {
        slug
        fullTitle
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
