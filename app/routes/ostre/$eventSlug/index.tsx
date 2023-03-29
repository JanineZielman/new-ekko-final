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
    <Container>
      <div className="intro-section">
        <div className='info-wrapper'>
          <p>{Moment(event.date).format("D.M.  dddd")} {Moment(event.openingTime).format("HH:mm")}</p>
          <h1>{event.title} <br/>
            {event.performances.map((performance:any,j:any) => {
              return(
                <div>
                  {performance.artist[0].title}
                </div>
              )
            })}
          </h1>
        </div>
        <div className='img-wrapper'>
          {event.featuredImage[0] && 
            <img src={event.featuredImage[0]?.url } alt={event.title}/>
          }
        </div>
      </div>

 
      {event.performances?.length > 0 &&
          <Collapsible trigger={'Line-up'} open={true} slug={'line-up'}>
            <div className='artists-section'>
              {event.performances.map((performance, i) => (
                <Link to={`/event/${event.slug}/${performance.slug}`} className='artist-item'>
                  <div className='img-wrapper artist'>
                    {performance.artist?.[0].featuredImage[0] ?
                      <img src={performance.artist?.[0].featuredImage[0].url} alt={performance.artist[0].title} />
                    :
                      <img src={event.featuredImage[0].url} alt={event.title} />
                    }
                  </div>
                  <div className='info-bar'>
                    <h4>{performance.artist?.[0].title}</h4>
                    {/* <p>{performance.time}, {performance.location?.[0]?.title}</p> */}
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
