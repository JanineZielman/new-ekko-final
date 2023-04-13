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
        <Spacer number={60} border=""/>
        <div className='animation'>
          <img src="/ani.gif" alt="" />
        </div>
      </div>
      <Collapsible trigger={about.entry.title} open={false} slug={about.entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: about.entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: about.entry.content }}></div>
        </div>
      </Collapsible>
      <Collapsible trigger={ostre.entry.title} open={false} slug={ostre.entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: ostre.entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: ostre.entry.content }}></div>
        </div>
        <a className='show-all-button-simple' href="/ostre"><h2>Read more</h2></a>
      </Collapsible>
      <Collapsible trigger={ekko_festival_info.entry.title} open={false} slug={ekko_festival_info.entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: ekko_festival_info.entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: ekko_festival_info.entry.content }}></div>
        </div>
        <a className='show-all-button-simple' href={`/festival/${ekko_festival_info.entry.linkedFestival[0]?.slug}`}><h2>Read more</h2></a>
      </Collapsible>
      <div className="grid">
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
