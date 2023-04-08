import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import News from '~/components/news';
import ImageSlider from '~/components/imageSlider';


export const loader: LoaderFunction = async ({params}) => {
  const [event, ekko_festival_info] = await Promise.all([
    fetchEvent(params.festivalSlug!),
    fetchContentPage('ekko_festival_info'),
  ]);

  const slug = params.festivalSlug;

  return { event, ekko_festival_info, slug };
};

export default function Index() {
  const { event, ekko_festival_info, slug } = useLoaderData<{ event: Event, ekko_festival_info: PageEntry, news: RecentNews, slug: String }>();

  event.performances.sort(({ time: a }, { time: b }) => parseInt(Moment(a).utcOffset('+0700').format("HH:mm").replace(/:/g, '')) - parseInt(Moment(b).utcOffset('+0700').format("HH:mm").replace(/:/g, '')))
  event.performances.sort(function(a,b){
    return new Date(a.date) - new Date(b.date);
  });

  const locations: any[] = [];

  for (let i = 0; i < event.performances.length; i++) {
    if (!locations.includes(`${event.performances[i].location[0].title}${event.performances[i].location[1]?.title ? `, ${event.performances[i].location[1]?.title}` : ''}`)) {
      locations.push(`${event.performances[i]?.location?.[0]?.title}${event.performances[i].location[1]?.title ? `, ${event.performances[i].location[1]?.title}` : ''}`);
    }
  }

  return (
    <Container back={false}>
			<div className="grid">
        <Spacer number={3} border=""/>
        <div className='item w1 overflow'>
          <div className='float graphic-element'>
            <img src={event.festivalSectionGraphicElements?.[0]?.url}/>
          </div>
        </div>
        <Spacer number={20} border=""/>
        <div className='item w1 overflow'>
          <div className='float'>
            <h2>{event.title}</h2>
            <h2 dangerouslySetInnerHTML={{ __html: event.intro }}></h2>
          </div>
        </div>
        <Spacer number={35} border=""/>
			</div>

      {event.linkednews.length > 0 &&
        <Collapsible trigger="News" open={true} slug={'news'}>
          <News news={event.linkednews} page={`festival`}/>
          <div className="grid">
            <Spacer number={12} border={""}/>
            <a className='show-all-button' href="/festival/news"><h2>Show all</h2></a>
          </div>
        </Collapsible>
      }

      {event.performances.length > 0 &&
        <Collapsible trigger="Line-up" open={false} slug={'line-up'}>
          <div className='line-up'>
            {event.performances.map((item, i) => {
              return(
                <div className='lineup-item'>
                  <a href={`/festival/${slug}/${item.slug}`}>{item.artist[0].title}</a>
                </div>
              )
            })}
          </div>
        </Collapsible>
      }

      {event.performances.length > 0 &&
        <Collapsible trigger="Artists" open={false} slug={'artists'}>
          <div className='artists-section'>
            {event.performances.map((performance, i) => {
              return(
                <Link to={`/festival/${event.slug}/${performance.slug}`} className='artist-item'>
                  {performance.artist[0].featuredImage[0]?.url && <div className='img-wrapper'><img src={performance.artist[0].featuredImage[0]?.url} alt={performance.artist[0].title} /></div>}
                  <div className='info-bar'>
                    <h2>{performance.artist[0].title}</h2>
                    {performance.artist?.[0].artistMeta && <div>{`(${performance.artist?.[0].artistMeta})`}</div>}
                    <br/>
                    <p>{Moment(performance.date).format("ddd D.M.")} {Moment(performance.time).utcOffset('+0100').format("HH:mm")}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </Collapsible>
      }

      {event.program.length > 0 &&
        <Collapsible trigger="Program" open={false} slug={'program'}>
          <div className='program'>
            {event.program.map((item, i) => {
              return(
                <div className='program-day'>
                  {item.date && <h3 className='date'>{Moment(item.date).format("ddd D.M.")}</h3>}
                  {locations.map((location, i) => {
                    const filteredEvents = event.performances.filter(performance => (`${performance.location?.[0]?.title}${performance.location[1]?.title ? `, ${performance.location[1]?.title}` : ''}` == location));
                    const filteredPerformance = filteredEvents.filter(performance => performance.date == item.date);
                    return(
                      <>
                      {filteredPerformance.length > 0 &&
                        <div className='program-location-item'>
                          <>
                            <div>{filteredPerformance[0].location[0].title} {filteredPerformance[0].location[1] && `, ${filteredPerformance[0].location[1]?.title}`}</div>
                          
                            {filteredEvents.map((performance, i) => {
                              return(
                                <>
                                  {item.date == performance.date && 
                                    <a className='flex space-between performance' href={`/festival/${slug}/${performance.slug}`}>
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
              )
            })}
          </div>
        </Collapsible>
      }
      
      {event.tickets.length > 0 &&
        <Collapsible trigger="Billetter" open={false} slug={'billetter'}>
          <div className='flex tickets'>
            {event.tickets.map((ticket, i) => {
              return(
                <a className='ticket' href={`${ticket.ticketLink}`} target="_blank">
                  <h3>{ticket.description}</h3>
                  <p className='price-label'>{ticket.price} Kr</p>
                </a>
              )
            })}
          </div>
        </Collapsible>
      }

      <Collapsible trigger={ekko_festival_info.entry.title} open={false} slug={ekko_festival_info.entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: ekko_festival_info.entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: ekko_festival_info.entry.content }}></div>
        </div>
      </Collapsible>

      {event.sections?.map((item:any, i:any) => {
        return(
          <Collapsible trigger={item.sectionTitle} open={false} slug={item.sectionTitle.toLowerCase()}>
            <div className='content padding' dangerouslySetInnerHTML={{ __html: item.sectionBody }}></div>
          </Collapsible>
        )
      })}

      <Collapsible trigger='Arkiv' open={false} slug={`arkiv`}>
        {event.gallery.length > 0 && <ImageSlider item={event.gallery}/>}
        <div className="grid">
          <Spacer number={12} border={""}/>
          <a className='show-all-button' href="/archive"><h2>Tidligere arrangementer</h2></a>
        </div>
      </Collapsible>



      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
		</Container>
  );
}
