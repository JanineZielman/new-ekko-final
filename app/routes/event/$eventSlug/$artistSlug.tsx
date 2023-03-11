import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/event';
import type { Event } from '~/service/data/event';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import type { Artist } from '~/service/data/artist';
import { fetchArtist } from '~/service/data/artist';

export const loader: LoaderFunction = async ({ params }) => {
  const [event, artist] = await Promise.all([
    fetchEvent(params.eventSlug!),
    fetchArtist(params.artistSlug!),
  ]);

  // Remove current artist from the performance list of the event
  event.performances = event.performances?.filter(
    performance => performance.slug !== artist.slug
  );

  return { event, artist };
};

export default function Index() {
  const { event, artist } = useLoaderData<{ event: Event; artist: Artist }>();

  console.log(event)

  return (
    <Container>
      <div className="grid">
        <div className="item w3 l3">
					<div className='padding-right'>
						<h1 className='big'>{artist.artist[0].title}</h1>
						<div className='big times'>{Moment(artist.date).format('D/MM')}</div>
            <br/>
            {artist.artist[0].complexContent?.map(block => {
              if (block.blockType === 'text') {
                return (
                  <div dangerouslySetInnerHTML={{ __html: block.text }}></div>
                );
              }
            })}
					</div>
				</div>

        <div className="item w3 l3 overflow">
          <div className='img-wrapper'>
            {artist.artist[0].featuredImage[0] ? 
              <img src={artist.artist[0].featuredImage[0]?.url}/>
              :
              <img src={event.featuredImage[0]?.url} alt={event.title} />
            }
          </div>
          <div className="flex space-between blue-bg">
            <div className="info">
              <h4>{artist.artist[0].title}</h4>
              <p>{artist.time}, {artist.location?.[0]?.title}</p>
            </div>
            <div>

            </div>
          </div>
        </div>
        
        {event.performances?.length > 0 &&
          <>
            <div className="w2 item align-bottom offset blue-bg">
              <div>
                <h2>Related artists:</h2>
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
