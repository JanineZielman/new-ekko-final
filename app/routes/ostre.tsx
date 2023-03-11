import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';

export const loader: LoaderFunction = () => {
  return fetchContentPage('ostre');
};

export const meta: MetaFunction = ({ data }) => ({
  title: (data as PageEntry).entry?.title,
});

export default function Oestre() {
  const { entry } = useLoaderData<PageEntry>();

  return (
    <Container>
      <div className="grid">
        <div className='item w3 l3'>
          <h1>{entry.title}</h1>
          {/* Need to do this to output rich text content */}
          <h3 dangerouslySetInnerHTML={{ __html: entry?.contact }} />
          <Spacer number={1} border={"no-border"}/>
        </div>
        <div className="item w3">
          <div className='header-img'>
            <img src={entry.photo?.[0].url} alt={entry.title} />
          </div>
        </div>
        <Spacer number={6} border={""}/>
        <div className='item w3 l6'>
          <div dangerouslySetInnerHTML={{ __html: entry?.content }} />
        </div>
        <Spacer number={18} border={""}/>
        <Spacer number={6} border={""}/>
      </div>
    </Container>
  );
}
