import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import Collapsible from '~/components/collapsible';


export const loader: LoaderFunction = async () => {
  const [legal] = await Promise.all([
    fetchContentPage('legal'),
  ]);

  return { legal };
};

export const meta: MetaFunction = ({ data }) => ({
  title: (data as PageEntry).entry?.title,
});

export default function Index() {
  const { legal } = useLoaderData<{ legal: PageEntry;}>();

  return (
    <Container back={false}>
      <Collapsible trigger={legal.entry.title} open={true} slug={legal.entry.slug}>
        <div className='flex'>
          <div className='contact'>
            <img src={legal.entry.pagePhoto[0].url}/>
          </div>
          {/* <div className='contact' dangerouslySetInnerHTML={{ __html: legal.entry.contact }}></div> */}
          <div className='content' dangerouslySetInnerHTML={{ __html: legal.entry.content }}></div>
        </div>
      </Collapsible>
      
      <div className="grid">
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
