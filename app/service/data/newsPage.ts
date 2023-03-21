import { fetchFromGraphQL, gql } from '~/service/utils';

export interface NewsEntry {
  entry: {
    id: number;
    slug: string;
    title: string;
    newsPhoto: { url: string }[];
		pagePhoto: { url: string }[];
		newsIntro: string;
		complexContent: (
      | { blockType: 'text'; text: string }
      | { blockType: 'video'; videoUrl: string }
      | { blockType: 'embed'; code: string }
    )[];
  };
}

// ... on about_about_Entry {}
// Question: how to use the fragment but query from multiple single type entries?
// Note: this assumes that all entries queried by this are using same fields
const query = gql`
  query ($slug: [String]) {
    entry(slug: $slug) {
      id
      slug
      title
			newsPhoto {
				url
			}
			pagePhoto {
				url
			}
			newsIntro
			complexContent {
				... on complexContent_text_BlockType {
					blockType: typeHandle
					text
				}
				... on complexContent_video_BlockType {
					blockType: typeHandle
					videoUrl
				}
				... on complexContent_embed_BlockType {
					blockType: typeHandle
					code
				}
			}
    }
  }
`;

export const fetchNewsPage = async (slug: string) => {
  const res = await fetchFromGraphQL(query, { slug });
  const { data } = await res.json();

  return data as NewsEntry;
};
