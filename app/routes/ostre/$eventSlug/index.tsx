import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/event';
import type { Event } from '~/service/data/event';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import ImageSlider from '~/components/imageSlider';
import SEO from '~/components/seo';

export const loader: LoaderFunction = ({ params }) => {
  return fetchEvent(params.eventSlug!);
};

export default function Index() {
  var Moment = require('moment');
  require('moment/locale/nb');

  const event = useLoaderData<Event>();

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
    <Container back="/ostre">
      <div className="intro-section fake-grid">
        <div className='info-wrapper'>
          <div>
            {event.organizer[0]?.title &&<p className='host'>{event.organizer[0]?.title} presenterer: </p>}
            {event.singlePage == false && 
              <>
                <h1>{event.title}</h1>
                <br/>
              </>
            }
            {event.showArtistInfo &&
              <h2 className='artist-running-list'>
                {event.performances.map((performance:any,j:any) => {
                  return(
                    <div>
                      <a href={`/ostre/${event.slug}/${performance.slug}`}>{performance.artist[0].title}</a>
                    </div>
                  )
                })}
              </h2>
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
              <p><span>Dato:</span> <span className='cap'>{Moment(event.date)?.format("dddd D.M.")} {event.dateEnd && `- ${Moment(event.dateEnd)?.format("dddd D.M.")}`}</span></p>
              <p><span>Sted:</span> <span className='mutliple-locations'>
                {event.location.map((item,i) => {
                  return(
                    <span key={`loc${i}`}>{item.venue}{item.room && `, ${item.room}`}<br/></span>
                  )
                })}
              </span></p>
              {event.openingTime &&<p><span>Åpningstid:</span> <span>{Moment(event.openingTime).format("HH:mm")} {event.closingTime && `- ${Moment(event.closingTime).format("HH:mm")}`}</span></p>}
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
              <div className='content-parent'>
                <br/><br/>
                <div className='dagens-program'>
                  {uniqueDates.map((item, i) => {
                    const filteredPerformance = event.performances.filter(performance => performance.date == item);
                    return(
                      <div className={`day ${event.singlePage}`}>
                        {event.singlePage &&
                          <p><br/>Tidsplan</p>
                        }
                        {(!event.singlePage || event.isMultiDay) &&
                          <>
                            <p className='cap'>{Moment(item).format("dddd D.M.")}</p>
                            <br/>
                            <div className='location'>{event.location[0]?.title}</div>
                          </>
                        }
                        <div className={`performances`}>
                          {filteredPerformance.map((item, i) => {

                            return(
                              <a className='performance' href={`/ostre/${event.slug}/${item.slug}`}>
                                <div className='time'>{item.time && Moment(item.time).format("HH:mm")} {item.timeEnd && `- ${Moment(item.timeEnd).format("HH:mm")}`}</div> 
                                <div className='artist'>{item.artist[0].title}</div>
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
  
          </div>
        </div>
        <div className='right-column'>
          <div className='img-wrapper'>
            <img src={event.featuredImage[0]?.url } alt={event.title}/>
            {event.singlePage &&
              <div className='artists-single-event'>
                {event.performances.map((performance, i) => {
                  return(
                    <Link to={`/ostre/${event.slug}/${performance.slug}`} className='artist-item'>
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
      <div className='fake-grid'>
        {event.gallery.length > 0 && 
          <Collapsible trigger={'Arkiv'} open={false} slug={'#'}>
            <ImageSlider item={event.gallery}/>
            <div className="grid">
              <Spacer number={12} border={""}/>
              <a className='show-all-button' href="/festival/archive"><h2>Vis fullt arkiv</h2></a>
            </div>
          </Collapsible>
        }
      </div>  
      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
    </Container>
    </>
  );
}
