import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import Collapsible from '~/components/collapsible';


export const loader: LoaderFunction = async () => {
  const [about, ostre, ekko_festival_info] = await Promise.all([
    fetchContentPage('about'),
    fetchContentPage('ostre'),
    fetchContentPage('ekko_festival_info')
  ]);

  return { about, ostre, ekko_festival_info };
};

export const meta: MetaFunction = ({ data }) => ({
  title: (data as PageEntry).entry?.title,
});

export default function Index() {
  const { about, ostre, ekko_festival_info } = useLoaderData<{ about: PageEntry; ostre: PageEntry, ekko_festival_info: PageEntry }>();

  return (
    <Container back={false}>
      <div className="grid">
        <Spacer number={72} border=""/>
        <div className='main-images'>
          <a className="festival-img wrap" href={`/festival/${ekko_festival_info.entry.linkedFestival[0]?.slug}`}>
            <h2>Festival</h2>
            <img src="/2@4x-8.png"/>
          </a>
          <a className="ostre-img wrap" href="/ostre">
            <h2>Østre</h2>
            <img src="/3@4x-8.png"/>
          </a>
          <a className="ekko-img wrap" href="/about">
            <h2>Foreningen Ekko</h2>
            <img src="/4@4x-8.png"/>
          </a>
        </div>
      </div>
    </Container>
  );
}
