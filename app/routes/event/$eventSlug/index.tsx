import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/event';
import type { Event } from '~/service/data/event';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';

export const loader: LoaderFunction = ({ params }) => {
  return fetchEvent(params.eventSlug!);
};

export default function Index() {
  const event = useLoaderData<Event>();

  console.log(event)

  return (
    <Container>
      <div className="grid">
        <div className="item w3 l3">
					<div className='padding-right'>
						<h1 className='big'>{event.title}</h1>
						<div className='big times'>{event.date}</div>
            <p>{event.location[0]?.fullTitle}</p>
					</div>
				</div>

        <div className="item w3 l3 overflow">
          <div className='img-wrapper'>
            {event.featuredImage[0] && 
              <img src={event.featuredImage[0]?.url } alt={event.title}/>
            }
          </div>
        </div>

        {event.performances?.length > 0 &&
          <>
            <div className="w2 item align-bottom offset blue-bg">
              <div>
                <h2>Artists:</h2>
              </div>
            </div>
            <Spacer number={4} border="" />
            {event.performances.map((performance, i) => (
              <Link to={`/event/${event.slug}/${performance.slug}`} className='item w2 white-bg'>
                <div className='img-wrapper artist'>
                  {performance.artist?.[0].featuredImage[0] ?
                    <img src={performance.artist?.[0].featuredImage[0].url} alt={performance.artist[0].title} />
                  :
                    <img src={event.featuredImage[0].url} alt={event.title} />
                  }
                  </div>
                <h4>{performance.artist?.[0].title}</h4>
                <p>{performance.time}, {performance.location?.[0]?.title}</p>
              </Link>
            ))}
          </>
        }
      </div>
    </Container>
  );
}
