import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import Collapsible from '~/components/collapsible';

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
        <Spacer number={60} border={""}/>
      </div>
      <Collapsible trigger={entry.title} open={false} slug={entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: entry.content }}></div>
        </div>
      </Collapsible>
      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
  );
}
