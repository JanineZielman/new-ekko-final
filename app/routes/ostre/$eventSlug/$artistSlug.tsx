import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/event';
import type { Event } from '~/service/data/event';

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
  var Moment = require('moment');
  require('moment/locale/nb');

  const { event, artist } = useLoaderData<{ event: Event; artist: Artist }>();

  return (
    <Container back={`/ostre/${event.slug}`}>
      <div className="intro-section fake-grid">
        <div className="info-wrapper">
					<div>
            {artist.artist?.[0].artistMeta && <span>{`(${artist.artist?.[0].artistMeta})`}</span>}
						<h1>{artist.artist[0].title}</h1>
            <br/>
            <div className='info-text'>
            <p><span>Dato:</span> <span className='cap'>{Moment(artist.date)?.format("dddd D.M.")}</span></p>
            {/* <p><span>Dato:</span> <span className='cap'>{Moment(event.date)?.format("dddd D.M.")} {event.dateEnd && `- ${Moment(event.dateEnd)?.format("dddd D.M.")}`}</span></p> */}
            <p><span>Tid:</span> <span className='cap'>{artist.time && `${Moment(artist.time).utcOffset('+0000').format("HH:mm")}`}</span></p>
            <p><span>Sted:</span> <span>{event.location?.[1]?.fullTitle ? event.location?.[1]?.fullTitle : event.location?.[0]?.fullTitle}</span></p>
            {event.openingTime &&<p><span>Åpningstid:</span> <span>{Moment(event.openingTime).utcOffset('+0100').format("HH:mm")} {event.closingTime && `- ${Moment(event.closingTime).utcOffset('+0100').format("HH:mm")}`}</span></p>}
            {event.ticketDescription && 
              <p> <span>Billetter:</span> <span>{event.ticketDescription}</span></p>
            }
          </div>
					</div>

          <div className='flex space-between margin-top bottom-links'>
            <div>
              {event.ticketLink?.includes('https') &&
                <a className='ticket-link button' href={event.ticketLink} target="_blank">Kjøp billetter</a>
              }
            </div>
            <div className='social-links-artist'>
              {artist.artist?.[0].relatedLinks.map((item, i) => {
                return(
                  <a className={`${item.linkTitle}`} href={item.linkUrl} target="_blank"></a>
                )
              })}
            </div>
          </div>
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
              <p>{artist.time}, {artist.location[1]?.fullTitle}</p>
            </div>
          </div>
        </div>
      </div>


      {artist.artist[0].complexContent.length > 0 &&
        <Collapsible trigger={'Mer informasjon om artisten'} open={true} slug={'about'}>
          {artist.artist[0].complexContent?.map(block => {
            if (block.blockType === 'text') {
              return (
                <div className='artist-text' dangerouslySetInnerHTML={{ __html: block.text }}></div>
              );
            }
            if (block.blockType === 'embed') {
              return (
                <div className='embed' dangerouslySetInnerHTML={{ __html: block.code }}></div>
              );
            }
            if (block.blockType === 'video') {
              return (
                <div className='embed'>
                  <iframe src={block.videoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/')}/>
                </div>
              );
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
