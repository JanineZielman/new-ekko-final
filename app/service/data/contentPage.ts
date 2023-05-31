import { fetchFromGraphQL, gql } from '~/service/utils';

export interface PageEntry {
  entry: {
    slug: string;
    title: string;
    contact: string;
    content: string;
    date: string;
    gallery: {url: string}[];
    linkedEvents: {
      slug: string;
    }[];
    sections: {
      sectionTitle: string;
      sectionBody: string;
    }[];
    performances: {
      artist: {
        title: string;
      }[];
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
      sections {
        ... on sections_entry_BlockType {
          sectionTitle
          sectionBody
        }
      }
      linkedEvents {
        slug
        ... on events_event_Entry {
          slug
          gallery {
            url
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
            url
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
