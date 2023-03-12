import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';


export const loader: LoaderFunction = async ({params}) => {
  const [event, ekko_festival_info] = await Promise.all([
    fetchEvent(params.festivalSlug!),
    fetchContentPage('ekko_festival_info'),
  ]);

  return { event, ekko_festival_info };
};

export default function Index() {
  const { event, ekko_festival_info } = useLoaderData<{ event: Event, ekko_festival_info: PageEntry }>();


  return (
    <Container>
			<div className="grid">
        <Spacer number={3} border=""/>
        <div className='item w1'>
          <div className='float graphic-element'>
            <img src={event.festivalSectionGraphicElements?.[0]?.url}/>
          </div>
        </div>
        <Spacer number={20} border=""/>
        <div className='item w1'>
          <div className='float'>
            <h2>{event.title}</h2>
            <h2 dangerouslySetInnerHTML={{ __html: event.intro }}></h2>
          </div>
        </div>
        <Spacer number={35} border=""/>
			</div>
      <Collapsible trigger={ekko_festival_info.entry.title} open={false} slug={ekko_festival_info.entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: ekko_festival_info.entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: ekko_festival_info.entry.content }}></div>
        </div>
      </Collapsible>
      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
		</Container>
  );
}
