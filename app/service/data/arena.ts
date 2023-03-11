import { fetchFromGraphQL, gql } from '~/service/utils';

export interface allVideos {
  entries: {
    id: number;
    title: string;
		complexContent: {
			[index: number]: { 
				videoUrl: string;
			}
		}
  }[];
}

const query = gql`
  query Arena{
    entries {
			title
			... on artists_artist_Entry {
				id
				title
				complexContent {
					... on complexContent_video_BlockType {
						videoUrl
					}
				}
			}
		}
  }
`;

export const fetchAllVideos = async () => {
  const res = await fetchFromGraphQL(query);
  const { data } = await res.json();

  return data as allVideos;
};
