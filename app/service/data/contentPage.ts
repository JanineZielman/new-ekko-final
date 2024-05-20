import { fetchFromGraphQL, gql } from '~/service/utils';

export interface PageEntry {
  entry: {
    slug: string;
    title: string;
    contact: string;
    content: string;
    date: string;
    pagePhoto: { url: string }[];
    gallery: {
      url: string
      title: string
      artistName: string
      ekstraInfo: string
    }[];
    linkedEvents: {
      slug: string;
    }[];
    sections: {
      sectionTitle: string;
      sectionBody: string;
      images: {url: string}[];
    }[];
    performances: {
      artist: {
        title: string;
      }[];
    }[];
    pastEvents: {
      eventTitle: string;
      isFestival: boolean;
      date: string;
      dateEnd: string;
      artists: string;
    }[];
  };
}

// ... on about_about_Entry {}
// Question: how to use the fragment but query from multiple single type entries?
// Note: this assumes that all entries queried by this are using same fields
const query = gql`
  query ($slug: [String]) {
    entry(slug: $slug) {
      slug
      title
      contact
      content: pageContent
      gallery {
        url(transform: "optimised")
        title
        artistName
        ekstraInfo
      }
      ... on legal_legal_Entry {
        pagePhoto{
          url(transform: "optimised")
        }
      }
      sections {
        ... on sections_entry_BlockType {
          sectionTitle
          sectionBody
          images{
            url(transform: "optimised")
          }
        }
      }
      ... on archive_archive_Entry{
        pastEvents{
          ... on pastEvents_event_BlockType{
            eventTitle
            isFestival
            date
            dateEnd
            artists
          }
        }
      }
      linkedEvents {
        slug
        ... on events_event_Entry {
          slug
          gallery {
            url(transform: "optimised")
            title
            artistName
            ekstraInfo
          }
          date
          title
          performances {
            ... on performance_performance_Entry {
              artist {
                ... on artists_artist_Entry {
                  title
                }
              }
            }
          }
        }
        ... on events_festival_Entry {
          gallery {
            url(transform: "optimised")
            title
            artistName
            ekstraInfo
          }
          date
          title
          slug
        }
      }
      linkedFestival{
        slug
      }
    }
  }
`;

export const fetchContentPage = async (slug: string) => {
  const res = await fetchFromGraphQL(query, { slug });
  const { data } = await res.json();

  return data as PageEntry;
};