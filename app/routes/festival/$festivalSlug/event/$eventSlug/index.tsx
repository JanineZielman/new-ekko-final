import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/event';
import type { Event } from '~/service/data/event';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import SEO from '~/components/seo';

export const loader: LoaderFunction = ({ params }) => {
  return fetchEvent(params.eventSlug!);
};

export default function Index() {
  var Moment = require('moment');
  require('moment/locale/nb');

  const event = useLoaderData<Event>();

  event.performances.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return Moment(a.date) - Moment(b.date);
  });

  function isDateInArray(needle:any, haystack:any) {
    for (var i = 0; i < haystack.length; i++) {
      if (needle === haystack[i]) {
        return true;
      }
    }
    return false;
  }
  
  var uniqueDates = [];
  for (var i = 0; i < event.performances.length; i++) {
    if (!isDateInArray(event.performances[i].date, uniqueDates)) {
      uniqueDates.push(event.performances[i].date);
    }
  }  

  return (
    <>
    <SEO
      title={`${event.title}`}
      description={event.intro ? event.intro.replace(/<[^>]+>/g, '') : ''}
      imageUrl={event.featuredImage[0]?.url}
    />
    <Container back={false}>
      <div className="intro-section fake-grid">
        <div className='info-wrapper'>
          <div>
            {event.organizer[0]?.title &&<p className='host'>{event.organizer[0]?.title} presenterer: </p>}
            {event.singlePage == false && 
              <>
                <h1>{event.title}</h1>
              </>
            }
            {event.showArtistInfo &&
            <>
             <br/>
              <h2 className='artist-running-list'>
                {event.performances.map((performance:any,j:any) => {
                  return(
                    <div>
                      <a href={`${performance.slug}`}>{performance.artist[0].title}</a>
                    </div>
                  )
                })}
              </h2>
            </>
            }
            <br/>
            <div className='intro-text'>
              <div dangerouslySetInnerHTML={{__html: event.intro}}></div>
              <div dangerouslySetInnerHTML={{__html: event.description}}></div>
            </div>
            <br/>

            {event.showArtistInfo &&
              event.performances.map((performance, i) => {
                return(
                  <div className='artist-text'>
                    {performance.artist[0].complexContent?.map(block => {
                      if (block.blockType === 'text') {
                        return (
                          <>
                            <h3>{performance.artist[0].title}</h3>
                            {performance.artist?.[0].artistMeta && <div>{`(${performance.artist?.[0].artistMeta})`}</div>}
                            <br/>
                            <div className='artist-text' dangerouslySetInnerHTML={{ __html: block.text }}></div>
                          </>
                        );
                      }
                    })}
                    <br/><br/>
                  </div>
                )
              })
            }
            
            <div className='info-text'>
              <p><span>Dato:</span> <span className='cap'>{new Date(event.date).toLocaleDateString("nb", {timeZone: 'Europe/Oslo', weekday: 'long', month: 'numeric', day: 'numeric' })} {event.dateEnd && `- ${new Date(event.dateEnd).toLocaleDateString("nb", {timeZone: 'Europe/Oslo', weekday: 'long', month: 'numeric', day: 'numeric' })}`}</span></p>
              <p><span>Sted:</span> <span className='mutliple-locations'>
                {event.location.map((item,i) => {
                  return(
                    <span key={`loc${i}`}>{item.venue}{item.room && `, ${item.room}`}<br/></span>
                  )
                })}
              </span></p>
              {event.openingTime &&<p><span>Åpningstid:</span> <span>{new Date(event.openingTime).toLocaleTimeString("nb", {timeZone: 'Europe/Oslo', hour: "2-digit", minute: "2-digit" })} {event.closingTime && `- ${new Date(event.closingTime).toLocaleTimeString("nb", {timeZone: 'Europe/Oslo', hour: "2-digit", minute: "2-digit" })}`}</span></p>}
              {event.ticketDescription && 
                <p> <span>Billetter:</span> <span dangerouslySetInnerHTML={{__html: event.ticketDescription}}></span></p>
              }
            </div>
          
            {event.ticketLink?.includes('https') &&
              <h3 className='ticket-wrapper'>
                <a className='ticket-link button' href={event.ticketLink} target="_blank">Kjøp billetter</a>
              </h3>
            }
            
            {event.performances?.length > 0 &&
              <div className='content-parent fes-event-multiple'>
                <br/><br/>
                <div className='dagens-program'>
                  {uniqueDates.map((item, i) => {
                    const filteredPerformance = event.performances.filter(performance => performance.date == item);
                    filteredPerformance.sort(function (a, b) {
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
                    return(
                      <div className={`day ${event.singlePage}`}>
                        {event.singlePage ?
                          <p><br/>Tidsplan</p>
                        :
                          <>
                            <p className='cap'>{new Date(item).toLocaleDateString("nb", {timeZone: 'Europe/Oslo', weekday: 'long', month: 'numeric', day: 'numeric' })}</p>
                          </>
                        }
                        <div className={`performances`}>
                          {filteredPerformance.map((item, i) => {
                            return(
                              <a className='performance' href={`${event.slug}/${item.slug}`}>
                                <div className='location location-time'>
                                  {item.location[0].venue}{item.location[0].room && `, ${item.location[0].room}`}
                                  <div className='time'>
                                    {item.time && new Date(item.time).toLocaleTimeString("nb", {timeZone: 'Europe/Oslo', hour: "2-digit", minute: "2-digit" })}
                                    {!event.showArtistInfo && 
                                    <> - {new Date(item.timeEnd).toLocaleTimeString("nb", {timeZone: 'Europe/Oslo', hour: "2-digit", minute: "2-digit" })}</>
                                    }
                                  </div> 
                                </div>
                                <div className='info'>
                                  <div className='artist'>{item.fullTitle}</div>
                                </div>
                              </a>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            }

            {event.complexContent?.map(block => {
              if (block.blockType === 'text') {
                return (
                  <div className='artist-text' dangerouslySetInnerHTML={{ __html: block.text }}></div>
                );
              }
            })}
  
          </div>
        </div>
        <div className='right-column festival'>
          <div className='img-wrapper'>
            <img src={event.featuredImage[0]?.url } alt={event.title}/>
            {event.complexContent?.map(block => {
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
                    <img  src={block.image[0].url}/>
                  </div>
                );
              }
            })}
            {event.singlePage &&
              <div className='artists-single-event'>
                {event.performances.map((performance, i) => {
                  return(
                    <Link to={`${event.slug}/${performance.slug}`} className='artist-item'>
                      {performance.artist[0].featuredImage[0]?.url && <div className='img-wrapper'><img src={performance.artist[0].featuredImage[0]?.url} alt={performance.artist[0].title} /></div>}
                      <div className='info-bar'>
                        <p>{performance.artist[0].title}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            }
          </div>
        </div>
      </div>     

      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
    </Container>
    </>
  );
}
