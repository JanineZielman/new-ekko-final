import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/event';
import type { Event } from '~/service/data/event';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import type { Artist } from '~/service/data/artist';
import { fetchArtist } from '~/service/data/artist';
import Collapsible from '~/components/collapsible';

export const loader: LoaderFunction = async ({ params }) => {
  const [event, artist] = await Promise.all([
    fetchEvent(params.eventSlug!),
    fetchArtist(params.artistSlug!),
  ]);

  return { event, artist };
};

export default function Index() {
  const { event, artist } = useLoaderData<{ event: Event; artist: Artist }>();

  return (
    <Container back={`/ostre/${event.slug}`}>
      <div className="intro-section fake-grid">
        <div className="info-wrapper">
					<div>
            <p>{Moment(event.date)?.format("dddd D.M.")} {artist.time && `${Moment(artist.time).utcOffset('+0000').format("HH:mm")}`}</p>
            <br/>
						<h1>{artist.artist[0].title}</h1>
            {artist.artist?.[0].artistMeta && <span>{`(${artist.artist?.[0].artistMeta})`}</span>}
					</div>
          <h3 className='margin-bottom'>
            {event.ticketLink?.includes('https') &&
              <a className='ticket-link white-button' href={event.ticketLink} target="_blank">Billetter</a>
            }
          </h3>
				</div>

        <div className='img-wrapper'>
          {artist.artist?.[0].featuredImage[0] ?
            <img src={artist.artist?.[0].featuredImage[0].url} alt={artist.artist[0].title} />
          :
            <img src={event.featuredImage[0].url} alt={event.title} />
          }

          <div className="flex space-between white-bg">
            <div className="info">
              <h4>{artist.artist[0].title}</h4>
              <p>{artist.time}, {artist.location[0].title}</p>
            </div>
          </div>
        </div>
      </div>


      {artist.artist[0].complexContent.length > 0 &&
        <Collapsible trigger={'More about the artist'} open={false} slug={'about'}>
          {artist.artist[0].complexContent?.map(block => {
            if (block.blockType === 'text') {
              return (
                <div dangerouslySetInnerHTML={{ __html: block.text }}></div>
              );
            }
            if (block.blockType === 'embed') {
              return (
                <div className='embed' dangerouslySetInnerHTML={{ __html: block.code }}></div>
              );
            }
            if (block.blockType === 'video') {
              // TODO: handle video embeds based on their url
            }
          })}
        </Collapsible>
      }

      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
