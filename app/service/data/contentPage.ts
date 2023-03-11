import { fetchFromGraphQL, gql } from '~/service/utils';

export interface PageEntry {
  entry: {
    id: number;
    title: string;
    url: string;
    contact: string;
    photo: { url: string }[];
    content: string;
  };
}

// ... on about_about_Entry {}
// Question: how to use the fragment but query from multiple single type entries?
// Note: this assumes that all entries queried by this are using same fields
const query = gql`
  query ($slug: [String]) {
    entry(slug: $slug) {
      id
      title
      contact
      photo: pagePhoto {
        url
      }
      content: pageContent
    }
  }
`;

export const fetchContentPage = async (slug: string) => {
  const res = await fetchFromGraphQL(query, { slug });
  const { data } = await res.json();

  return data as PageEntry;
};
