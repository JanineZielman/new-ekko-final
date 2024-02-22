import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import type { Artist } from '~/service/data/artist';
import { fetchArtist } from '~/service/data/artist';
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

  const linkedPerformances: any[] = [];

  for (let i = 0; i < event.linkedEvents.length; i++) {
    for (let j = 0; j < event.linkedEvents[i].performances.length; j++) {
      if (!linkedPerformances.includes(`${event.linkedEvents[i].performances[j]}`)) {
        linkedPerformances.push({
          performance: event.linkedEvents[i]?.performances[j],
          artist: event.linkedEvents[i]?.performances[j].artist,
          date: event.linkedEvents[i]?.performances[j].date,
          location: event.linkedEvents[i]?.performances[j].location,
          slug: 'event/' + event.linkedEvents[i].slug,
          time: event.linkedEvents[i]?.performances[j].time,
          timeEnd: event.linkedEvents[i]?.performances[j].timeEnd,
          fullTitle: event.linkedEvents[i]?.performances[j].fullTitle
        });
      }
    }
  } 

  const mergedEvents = event.performances.concat(linkedPerformances)

  mergedEvents.sort(function (a, b) {
    let first = parseFloat(Moment(a.time).format("HH")) + (parseFloat(Moment(a.time).format("mm")) / 60);
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

  for (let i = 0; i < mergedEvents.length; i++) {
    if (!locations.includes(`${mergedEvents[i].location[0]?.title}`)) {
      locations.push(`${mergedEvents[i]?.location?.[0]?.title}`);
    }
  }

  const festivalDay = event.program.filter(day => day.date == artist.date);

  // const ticketDay = event.tickets.filter(ticket => ticket.relatedPerformances.filter == true);
  let ticketDay: any[] = [];

  for (let i = 0; i < event.tickets.length; i++) {
    if (!ticketDay.includes(`${event.tickets[i].relatedPerformances.filter(performance => performance.slug == artist.slug)}`)) {
      if (event.tickets[i].relatedPerformances.filter(performance => performance.slug == artist.slug).length > 0){
        ticketDay.push(event.tickets[i]);
      }
    }
  }


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
            <p><span>Åpningstid:</span> <span>{Moment(festivalDay[0]?.startTime).format("HH:mm")} {festivalDay[0]?.endTime && `- ${Moment(festivalDay[0]?.endTime).format("HH:mm")}`}</span></p>
            <p><span>Tid:</span> <span>{Moment(artist.time).format("HH:mm")} {artist.timeEnd && `- ${Moment(artist.timeEnd).format("HH:mm")}`}</span></p>
            <p><span>Sted:</span> <span className='mutliple-locations'>
                {artist.location.map((item,i) => {
                  return(
                    <span key={`loc${i}`}>{item.venue}{item.room && `, ${item.room}`}<br/></span>
                  )
                })}
              </span></p>
            {artist.ekstraInfo && 
              <p> <span>Ekstra info:</span> <span>{artist.ekstraInfo}</span></p>
            }
            {ticketDay[0] ?
            <>
              <p> 
                <span>Billetter:</span> 
                <span>
                  {ticketDay[0]?.description && <>{ticketDay[0]?.description} <br/></>}
                  {ticketDay[0]?.subdescription && <>{ticketDay[0]?.subdescription}<br/></>} 
                  {ticketDay[0]?.price && `${ticketDay[0]?.price} Kr`} 
                </span>
              </p>
            </>
            :
            <>
              {festivalDay[0]?.ticketInformation && 
                <p> <span>Billetter:</span> <span>{festivalDay[0]?.ticketInformation}</span></p>
              }
            </>
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
                        const filteredEvents = mergedEvents.filter(performance => (`${performance.location?.[0]?.title}` == location));
                        const filteredPerformance = filteredEvents.filter(performance => performance.date == item.date);
                        return(
                          <>
                          {filteredPerformance.length > 0 &&
                            <div className='program-location-item'>
                              <>
                                <div className='location'>{filteredPerformance[0].location[0]?.title}</div>
                              
                                {filteredEvents.map((performance, i) => {
                                  return(
                                    <>
                                      {item.date == performance.date && 
                                        <a className='performance' href={`/festival/${event.slug}/${performance.slug}`}>
                                          <div className='time'>{Moment(performance.time).format("HH:mm")}</div> 
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
            if (block.blockType === 'imageBlock') {
							return (
								<div className='img-wrapper'>
									<img src={block.image[0].url}/>
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