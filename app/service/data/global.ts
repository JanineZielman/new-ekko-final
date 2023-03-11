import { fetchFromGraphQL, gql } from '../utils';

export interface Navigation {
  globalSets: {
    [index: number]: { 
      socialFacebook: string;
      socialInstagram: string;
      socialTwitter: string;
    }
  },
  nodes: {
    id: string;
    title: string;
    url: string;
    navHandle: string;
    navName: string;
  }[];
}

const query = gql`
  query Navigation {
    nodes(level: 1) {
      ... on festival_Node {
        id
        title
        url
        navHandle
        navName
      }
      ... on ostre_Node {
        id
        title
        url
        navHandle
        navName
      }
      ... on about_Node {
        id
        title
        url
        navHandle
        navName
      }
      ... on toggle_Node {
        id
        title
        url
        navHandle
        navName
      }
    }
    globalSets {
      ... on globalInfo_GlobalSet {
        socialFacebook
        socialInstagram
        socialTwitter
      }
    }
  }
`;

export const getNavigation = async () => {
  const res = await fetchFromGraphQL(query);
  let { data } = (await res.json()) as { data: Navigation };

  // filter out empty nodes
  data.nodes = data?.nodes.filter(node => !!node.id);

  return data;
};
