import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import type { Artist } from '~/service/data/artist';
import { fetchArtist } from '~/service/data/artist';
import Collapsible from '~/components/collapsible';

export const loader: LoaderFunction = async ({ params }) => {
  const [event, artist] = await Promise.all([
    fetchEvent(params.festivalSlug!),
    fetchArtist(params.artistSlug!),
  ]);

  // Remove current artist from the performance list of the event
  // event.performances = event.performances?.filter(
  //   performance => performance.slug !== artist.slug
  // );

  return { event, artist };
};

export default function Index() {
  const { event, artist } = useLoaderData<{ event: Event; artist: Artist }>();

  event.performances.sort(function (a, b) {
    let first = parseFloat(Moment(a.time).format("HH")) + (parseFloat(Moment(a.time).format("mm")) / 60) ;
    let second = parseFloat(Moment(b.time).format("HH")) + (parseFloat(Moment(b.time).format("mm")) / 60);
    if (first < 6){
      first = first + 24;
    }
    if (second < 6){
      second = second + 24;
    }
    return first - second
  });

  return (
    <Container back={`/festival/${event.slug}`}>
      <div className="intro-section fake-grid">
        <div className="info-wrapper">
					<div>
            <p>{Moment(event.date).format("D.M.  dddd")} {Moment(artist.time).utcOffset('+0100').format("HH:mm")}</p>
            <br/>
						<h1>{artist.artist[0].title}</h1>
					</div>
          <h3 className='margin-bottom'>
            {event.ticketLink?.includes('https') &&
              <a className='ticket-link white-button' href={event.ticketLink} target="_blank">Billetter</a>
            }
          </h3>
				</div>

        <div className='img-wrapper'>
          <img src={artist.artist[0].featuredImage[0]?.url}/>
        </div>

      </div>

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

      <Collapsible trigger={'Line-up'} open={false} slug={'line-up'}>
        <div className='artists-section'>
          {event.performances.map((performance, i) => {
            return(
              <>
                {performance.date == artist.date &&
                  <Link to={`/festival/${event.slug}/${performance.slug}`} className='artist-item'>
                    {performance.artist[0].featuredImage[0]?.url && <div className='img-wrapper'><img src={performance.artist[0].featuredImage[0]?.url} alt={performance.artist[0].title} /></div>}
                    <div className='info-bar'>
                      <h2>{performance.artist[0].title}</h2>
                      {performance.artist?.[0].artistMeta && <div>{`(${performance.artist?.[0].artistMeta})`}</div>}
                      <br/>
                      <p>{Moment(performance.time).utcOffset('+0100').format("HH:mm")}</p>
                    </div>
                  </Link>
                }
              </>
            )
          })}
        </div>
      </Collapsible>

      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>

    </Container>
  );
}