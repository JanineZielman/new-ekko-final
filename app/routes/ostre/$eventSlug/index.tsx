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
            <p>{Moment(event.date).format("dddd D.M.")} {Moment(event.openingTime).utcOffset('+0000').format("HH:mm")}</p>
            <h2>{event.title}</h2>
            <h1>
              {event.performances.map((performance:any,j:any) => {
                return(
                  <div>
                    {performance.artist[0].title}
                    {performance.artist?.[0].artistMeta && <span>{`(${performance.artist?.[0].artistMeta})`}</span>}
                  </div>
                )
              })}
            </h1>
            <br/>
            <div className='intro-text'>
              <div dangerouslySetInnerHTML={{__html: event.intro}}></div>
            </div>
          </div>
          <h3 className='ticket-wrapper'>
            {event.ticketLink?.includes('https') &&
              <a className='ticket-link white-button' href={event.ticketLink} target="_blank">Billetter</a>
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
          <div className='info-text'>
            <p>Sted: {event.location?.[0]?.title}{event.location?.[1]?.title ? `, ${event.location?.[1]?.title}` : ''}</p>
            <p>Tid: {Moment(event.openingTime).utcOffset('+0000').format("HH:mm")} {event.closingTime && `- ${Moment(event.closingTime).utcOffset('+0000').format("HH:mm")}`}</p>
            <p>{event.ticketDescription && `Billetter: ${event.ticketDescription}`}</p>
          </div>
          <div className='intro-text'>
            <div dangerouslySetInnerHTML={{__html: event.description}}></div>
          </div>
        </div>
      </div>

      {event.performances?.length > 0 &&
        <Collapsible trigger={'Dagens Program'} open={true} slug={'dagens-program'}>
          <div className='artists-section'>
            {event.performances.map((performance, i) => (
              <Link to={`/ostre/${event.slug}/${performance.slug}`} className='artist-item'>
                <div className='info-bar'>
                  <h2>{performance.artist?.[0].title}</h2>
                  {performance.artist?.[0].artistMeta && <div>{`(${performance.artist?.[0].artistMeta})`}</div>}
                  <br/>
                  {performance.time &&<p>{Moment(performance.time).utcOffset('+0000').format("HH:mm")}</p>}
                </div>
              </Link>
            ))}
          </div>
        </Collapsible>
      }

      
        <Collapsible trigger='Arkiv' open={true} slug={`arkiv`}>
          {event.gallery.length > 0 ?
            <>
              <ImageSlider item={event.gallery}/>
              <div className="grid">
                <Spacer number={12} border={""}/>
                <a className='show-all-button' href="/archive"><h2>Tidligere arrangementer</h2></a>
              </div>
            </>
            :
            <div>
              <a className='show-all-button' href="/archive"><h2>Tidligere arrangementer</h2></a>
            </div>
          }
          
        </Collapsible>
     

      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
