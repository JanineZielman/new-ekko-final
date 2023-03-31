import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/event';
import type { Event } from '~/service/data/event';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';

export const loader: LoaderFunction = ({ params }) => {
  return fetchEvent(params.eventSlug!);
};

export default function Index() {
  const event = useLoaderData<Event>();

  console.log(event)

  return (
    <Container back="/ostre">
      <div className="intro-section fake-grid">
        <div className='info-wrapper'>
          <div>
            <p>{Moment(event.date).format("D.M.  dddd")} {Moment(event.openingTime).format("HH:mm")}</p>
            <h2>{event.title}</h2>
            <h1>
              {event.performances.map((performance:any,j:any) => {
                return(
                  <div>
                    {performance.artist[0].title}
                  </div>
                )
              })}
            </h1>
          </div>
          <h3 className='margin-bottom'>
            {event.ticketLink?.includes('https') &&
              <a className='ticket-link white-button' href={event.ticketLink} target="_blank">Billetter</a>
            }
          </h3>
        </div>
        <div className='img-wrapper'>
          {event.featuredImage[0] && 
            <img src={event.featuredImage[0]?.url } alt={event.title}/>
          }
        </div>
      </div>

      <div className='fake-grid'>
        <div className='flex space-between event-info'>
          <div className='info-text'>
            <p>{event.location?.[0]?.title}{event.location?.[1]?.title ? `, ${event.location?.[1]?.title}` : ''}</p>
            <p>{Moment(event.openingTime).format("HH:mm")} - {Moment(event.closingTime).format("HH:mm")}</p>
            <p>{event.ticketDescription}</p>
          </div>
          <div className='intro-text'>
            <div dangerouslySetInnerHTML={{__html: event.intro}}></div>
          </div>
        </div>
      </div>

      {event.performances?.length > 0 &&
        <Collapsible trigger={'Artists'} open={true} slug={'artists'}>
          <div className='artists-section'>
            {event.performances.map((performance, i) => (
              <Link to={`/ostre/${event.slug}/${performance.slug}`} className='artist-item'>
                <div className='img-wrapper artist'>
                  {performance.artist?.[0].featuredImage[0] &&
                    <img src={performance.artist?.[0].featuredImage[0].url} alt={performance.artist[0].title} />
                  }
                </div>
                <div className='info-bar'>
                  <h2>{performance.artist?.[0].title}</h2>
                  {performance.artist?.[0].artistMeta && <div>{`(${performance.artist?.[0].artistMeta})`}</div>}
                  <br/>
                  {performance.time &&<p>{Moment(performance.time).format("HH:mm")}</p>}
                </div>
              </Link>
            ))}
          </div>
        </Collapsible>
      }
      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
