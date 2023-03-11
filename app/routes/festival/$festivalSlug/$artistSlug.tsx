import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import type { Artist } from '~/service/data/artist';
import { fetchArtist } from '~/service/data/artist';

export const loader: LoaderFunction = async ({ params }) => {
  const [event, artist] = await Promise.all([
    fetchEvent(params.festivalSlug!),
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
            <img src={artist.artist[0].featuredImage[0]?.url}/>
          </div>
          <div className="flex space-between white-bg">
            <div className="info">
              <h4>{artist.artist[0].title}</h4>
              <p>{artist.time}, {artist.location[0].title}</p>
            </div>
            <div>

            </div>
          </div>
        </div>

        {/* {artist.artist[0].complexContent?.map(block => {
          if (block.blockType === 'embed') {
            return (
              <div dangerouslySetInnerHTML={{ __html: block.code }}></div>
            );
          }
          if (block.blockType === 'video') {
            // TODO: handle video embeds based on their url
          }
        })} */}


        <div className="w2 item align-bottom offset white-bg">
          <div>
            <h2>Related artists:</h2>
          </div>
        </div>
        <Spacer number={4} border="" />
        {event.performances.map((performance, i) => {
          return(
            <>
              {performance.date == artist.date &&
                <Link to={`/festival/${event.slug}/${performance.slug}`} className='item w2 white-bg'>
                  <div className='img-wrapper'><img src={performance.artist[0].featuredImage[0]?.url} alt={performance.artist[0].title} /></div>
                  <h4>{performance.artist[0].title}</h4>
                  <p>{performance.time} {performance.location[0].title}</p>
                </Link>
              }
            </>
          )
        })}
 
      </div>
    </Container>
  );
}