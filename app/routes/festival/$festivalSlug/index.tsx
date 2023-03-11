import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';

export const loader: LoaderFunction = ({ params }) => {
  return fetchEvent(params.festivalSlug!);
};

export default function Index() {
  const event = useLoaderData<Event>();

  console.log(event)

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
				<Spacer number={12} border=""/>
			</div>
		</Container>
  );
}
