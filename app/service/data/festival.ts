import { fetchFromGraphQL, gql } from '~/service/utils';

export interface Event {
  id: number;
  slug: string;
  title: string;
  url: string;
  organizer: { title: string }[];
  featuredImage: { url: string }[];
  festivalSectionGraphicElements: { url: string }[];
  isMultiDay: boolean;
  date: string;
  dateEnd: string;
	lineup: string;
  location: {
    title: string;
    fullTitle: string;
  }[];
  intro: string;
  description: string;
  ticketLink: string;
  ticketDescription: string;
  tickets: {
    description: string;
    subdescription: string;
    price: string;
    ticketLink: string;
  }[];
  program: {
    date: string;
    endDate: string;
    program: {
      date: string;
    }[];
  }[]
  sections: {
    sectionTitle: string;
    sectionBody: string;
  }[];
  performances: {
    title: string;
    date: string;
    time: string;
    timeEnd: string;
    slug: string;
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
  fragment eventData on events_festival_Entry {
    organizer {
      title
    }
    featuredImage: eventFeaturedPhoto {
      url
    }
    festivalSectionGraphicElements{
      url
    }
    program {
      date
      endDate
      ... on program_day_BlockType {
        date
      }
    }
    isMultiDay
    date
    dateEnd
    location {
      title
      fullTitle
    }
    intro
    description
		lineup
    ticketLink
    ticketDescription
    tickets{
      description
      subDescription
      price
      ticketLink
    }
    sections {
      ... on sections_entry_BlockType {
        sectionTitle
        sectionBody
      }
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
