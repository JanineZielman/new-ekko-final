import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/event';
import type { Event } from '~/service/data/event';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import ImageSlider from '~/components/imageSlider';

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

  return (
    <Container back="/ostre">
      <div className="intro-section fake-grid">
        <div className='info-wrapper'>
          <div>
            {event.organizer[0]?.title &&<p className='host'>{event.organizer[0]?.title} presenterer: </p>}
            <h1>{event.title}</h1>
            <h2 className='artist-running-list'>
              {event.performances.map((performance:any,j:any) => {
                return(
                  <a href={`/ostre/${event.slug}/${performance.slug}`}>{performance.artist[0].title}</a>
                )
              })}
            </h2>
            <br/>
            <div className='info-text'>
              <p><span>Dato:</span> <span className='cap'>{Moment(event.date)?.format("dddd D.M.")} {event.dateEnd && `- ${Moment(event.dateEnd)?.format("dddd D.M.")}`}</span></p>
              <p><span>Sted:</span> <span>{event.location?.[1]?.fullTitle ? event.location?.[1]?.fullTitle : event.location?.[0]?.fullTitle}</span></p>
              {event.openingTime &&<p><span>Åpningstid:</span> <span>{Moment(event.openingTime).utcOffset('+0100').format("HH:mm")} {event.closingTime && `- ${Moment(event.closingTime).utcOffset('+0100').format("HH:mm")}`}</span></p>}
              {event.ticketDescription && 
                <p> <span>Billetter:</span> <span>{event.ticketDescription}</span></p>
              }
            </div>
          </div>
          <h3 className='ticket-wrapper'>
            {event.ticketLink?.includes('https') &&
              <a className='ticket-link button' href={event.ticketLink} target="_blank">Kjøp billetter</a>
            }
          </h3>
        </div>
        <div className='img-wrapper'>
          {event.featuredImage[0] && 
            <img src={event.featuredImage[0]?.url } alt={event.title}/>
          }
        </div>
      </div>

      <div className='fake-grid'>
        <div className='flex space-between event-info'>
          <div className='intro-text'>
            <div dangerouslySetInnerHTML={{__html: event.intro}}></div>
          </div>
          <div className='intro-text'>
            <div dangerouslySetInnerHTML={{__html: event.description}}></div>
          </div>
        </div>
      </div>

      {event.performances?.length > 0 &&
        <div className='Collapsible'>
          <div className='trigger' style={{"height": 0, "padding": "14px"}}></div>
          <div className='content-parent open'>
            <div className='dagens-program'>
              <div className='day'>
                {event.date && <h3 className='cap'>{Moment(event.date).format("dddd D.M.")}</h3>}
                <br/>
                <div className='location'>{event.location[1]?.fullTitle}</div>
                <div className='performances'>
                  {event.performances.map((item, i) => {
                    return(
                      <a className='performance' href={`/ostre/${event.slug}/${item.slug}`}>
                        <div className='time'>{item.time && Moment(item.time).utcOffset('+0100').format("HH:mm")}</div> 
                        <div className='artist'>{item.artist[0].title}</div>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      
        <Collapsible trigger='Arkiv' open={true} slug={`arkiv`}>
          {event.gallery.length > 0 ?
            <>
              <ImageSlider item={event.gallery}/>
              <div className="grid">
                <Spacer number={12} border={""}/>
                <a className='show-all-button' href="/ostre/archive"><h2>Vis fullt arkiv</h2></a>
              </div>
            </>
            :
            <div>
              <a className='show-all-button' href="/ostre/archive"><h2>Vis fullt arkiv</h2></a>
            </div>
          }
          
        </Collapsible>
     

      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
