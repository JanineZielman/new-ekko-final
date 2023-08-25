import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import type { Artist } from '~/service/data/artist';
import { fetchArtist } from '~/service/data/artist';
import Collapsible from '~/components/collapsible';
import SEO from '~/components/seo';

export const loader: LoaderFunction = async ({ params }) => {
  const [event, artist] = await Promise.all([
    fetchEvent(params.festivalSlug!),
    fetchArtist(params.artistSlug!),
  ]);

  return { event, artist };
};

export default function Index() {
  var Moment = require('moment');
  require('moment/locale/nb');

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

  const locations: any[] = [];

  for (let i = 0; i < event.performances.length; i++) {
    if (!locations.includes(`${event.performances[i].location[1].fullTitle}`)) {
      locations.push(`${event.performances[i]?.location?.[1]?.fullTitle}`);
    }
  }

  const festivalDay = event.program.filter(day => day.date == artist.date);


  return (
    <>
    <SEO
      title={`EKKO | ${artist.title}`}
      description={event.intro ? event.intro.replace(/<[^>]+>/g, '') : ''}
      imageUrl={artist.artist?.[0].featuredImage[0]?.url ? artist.artist?.[0].featuredImage[0]?.url : event.featuredImage[0]?.url}
    />
    <Container back={`/festival/${event.slug}`}>
      <div className="intro-section fake-grid">
        <div className="info-wrapper">
					<div>
						<h1>{artist.artist[0].title}</h1>
            {artist.artist?.[0].artistMeta && <span>{`(${artist.artist?.[0].artistMeta})`}</span>}
            <br/><br/>
					</div>
          
          {artist.artist[0].complexContent?.map(block => {
            if (block.blockType === 'text') {
              return (
                <div className='artist-text' dangerouslySetInnerHTML={{ __html: block.text }}></div>
              );
            }
          })}
          <br/><br/>
          <div className='info-text'>
            <p><span>Dato:</span> <span className='cap'>{Moment(artist.date)?.format("dddd D.M.")}</span></p>
            <p><span>Tid:</span> <span>{Moment(artist.time).utcOffset('+0100').format("HH:mm")}</span></p>
            <p><span>Sted:</span> <span>{artist.location?.[1]?.fullTitle}</span></p>
            <p><span>Åpningstid:</span> <span>{Moment(festivalDay[0]?.startTime).utcOffset('+0100').format("HH:mm")} {festivalDay[0]?.endTime && `- ${Moment(festivalDay[0]?.endTime).utcOffset('+0100').format("HH:mm")}`}</span></p>
            {festivalDay[0]?.ticketInformation && 
              <p> <span>Billetter:</span> <span>{festivalDay[0]?.ticketInformation}</span></p>
            }
          </div>
          <div className='flex space-between margin-top bottom-links'>
            {event.ticketLink?.includes('https') &&
              <a className='ticket-link button' href={event.ticketLink} target="_blank">Kjøp billetter</a>
            }
            <div className='social-links-artist'>
              {artist.artist?.[0].relatedLinks.map((item, i) => {
                return(
                  <a className={`${item.linkTitle}`} href={item.linkUrl} target="_blank"></a>
                )
              })}
            </div>
          </div>
          <div className='content-parent fes-event'>
            <div className='program dagens-program'>
              {event.program.map((item, i) => {
                return(
                  <>
                  {item.date == artist.date &&
                    <div className='program-day'>
                      <h3><br/>Dagens program</h3>
                      {locations.map((location, i) => {
                        const filteredEvents = event.performances.filter(performance => (`${performance.location?.[1]?.fullTitle}` == location));
                        const filteredPerformance = filteredEvents.filter(performance => performance.date == item.date);
                        return(
                          <>
                          {filteredPerformance.length > 0 &&
                            <div className='program-location-item'>
                              <>
                                <div className='location'>{filteredPerformance[0].location[1]?.fullTitle}</div>
                              
                                {filteredEvents.map((performance, i) => {
                                  return(
                                    <>
                                      {item.date == performance.date && 
                                        <a className='performance' href={`/festival/${event.slug}/${performance.slug}`}>
                                          <div className='time'>{Moment(performance.time).utcOffset('+0100').format("HH:mm")}</div> 
                                          <div className='artist'>{performance.artist[0].title}</div>
                                        </a>
                                      }
                                    </>
                                  )
                                })}
                              </>
                            </div>
                            }
                          </>
                        )
                      })}
                    </div>
                  }
                  </>
                )
              })}
            </div>
          </div>
				</div>
        
        <div className='right-column festival'>
          <div className='img-wrapper'>
            <img src={artist.artist[0].featuredImage[0]?.url}/>
          </div>
          {artist.artist[0].complexContent?.map(block => {
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
        </div>

      </div>

      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>

    </Container>
    </>
  );
}