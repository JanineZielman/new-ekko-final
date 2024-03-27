import { fetchFromGraphQL, gql } from '~/service/utils';

export interface RecentNews {
  events: {
    id: number;
    slug: string;
    title: string;
    newsPhoto: { url: string }[];
		pagePhoto: { url: string }[];
    newsIntro: string;
  }[];
}

const query = gql`
  query News($limit: Int!) {
    events: entries(section: "news", orderBy: "postDate DESC", limit: $limit) {
      id
      slug
      title
      newsIntro
			newsPhoto {
				url(transform: "optimised")
			}
			pagePhoto {
				url(transform: "optimised")
			}
    }
  }
`;

export const fetchRecentNews = async (limit:number) => {
  const res = await fetchFromGraphQL(query, { limit });
  const { data } = await res.json();

  return data as RecentNews;
};
