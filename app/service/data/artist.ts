import { fetchFromGraphQL, gql } from '~/service/utils';

export interface Artist {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  timeEnd: string;
  location: {
    title: string;
    venue: string;
    room: string;
  }[];
  artist: {
    url: string;
    title: string;
    artistMeta: string;
    relatedLinks: {
      linkTitle: string;
      linkUrl: string;
    }[];
    featuredImage: { url: string }[];
    complexContent: (
      | { blockType: 'text'; text: string }
      | { blockType: 'video'; videoUrl: string }
      | { blockType: 'embed'; code: string }
    )[];
  }[];
}

const artistFragment = gql`
  fragment artistData on artists_artist_Entry {
    title
    artistMeta
    featuredImage: artistFeaturedPhoto {
      url
    }
    relatedLinks {
      linkTitle
      linkUrl
    }
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
`;

const query = gql`
  query Artist($slug: String!) {
    entry(slug: [$slug]) {
      id
      slug
      title
      date
      time
      timeEnd
      location {
        title
        venue
        room
      }
      artist{
        ...artistData
      }
    }
  }

  ${artistFragment}
`;

export const fetchArtist = async (slug: string) => {
  const res = await fetchFromGraphQL(query, { slug });
  const { data } = await res.json();

  return data?.entry as Artist;
};
