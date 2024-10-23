import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import type { Navigation } from '~/service/data/global';
import { getNavigation } from '~/service/data/global';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import News from '~/components/news';
import ImageSlider from '~/components/imageSlider';
import SEO from '~/components/seo';


export const loader: LoaderFunction = async ({params}) => {
  const [event, ekko_festival_info, navigation] = await Promise.all([
    fetchEvent(params.festivalSlug!),
    fetchContentPage('ekko_festival_info'),
    getNavigation()
  ]);

  const slug = params.festivalSlug;

  return { event, ekko_festival_info, slug, navigation };
};

export default function Index() {
  var Moment = require('moment');
  require('moment/locale/nb');

  const { event, ekko_festival_info, slug, navigation } = useLoaderData<{ event: Event, ekko_festival_info: PageEntry, slug: String, navigation: Navigation }>();

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

  return (
    <>
    <SEO
      title={`${event.title}`}
      description={event.intro ? event.intro.replace(/<[^>]+>/g, '') : ''}
      imageUrl={event.festivalSectionGraphicElements?.[0]?.url}
    />

    <div className='radio-player'>
      <iframe id="embed_player" frameBorder="0" width="280" height="216" src="https://ekko.airtime.pro/embed/player?stream=auto&skin=1"/>
    </div>
    
    <Container back={false}>
			<div className={`grid festival-page-grid ${event.slug} ${event.festivalSectionGraphicElements?.[0]?.url ? '' : 'no-img'}`}>
        <div className='item w1 overflow'>
          <div className='float graphic-element'>
            <img src={event.festivalSectionGraphicElements?.[0]?.url}/>
            <img src={event.festivalSectionGraphicElements?.[0]?.url}/>
          </div>
          <h2 className='float intro' dangerouslySetInnerHTML={{ __html: event.intro }}></h2>
        </div>
        {!event.festivalSectionGraphicElements?.[0]?.url &&
          <h2 className='intro' dangerouslySetInnerHTML={{ __html: event.intro }}></h2>
        }
        <Spacer number={59} border=""/>
			</div>

      {navigation.nodes.filter(word => word.navHandle == 'festival').map((item, i) => {
        return(
          <Collapsible trigger={item.title} open={false} slug={item.url.replace('#', '')}>
            <>
              {item.url == '#nyheter' && event.linkednews.length > 0 &&
                <>
                  <News news={event.linkednews.slice(0,4)} page={`festival/${slug}`}/>
                  <div className="grid">
                    <Spacer number={12} border={""}/>
                    <a className='show-all-button' href={`/festival/${slug}/news`}><h2>Vis alt</h2></a>
                  </div>
                </>
              }
              {item.url == "#spilleplan" && event.program.length > 0 &&
                <div className='program'>
                  {event.program.map((item, i) => {
                    
                    return(
                      <>
                      <div className='program-day'>
                        {item.date && <h3 className='date cap'>{new Date(item.date).toLocaleDateString("nb", {timeZone: 'Europe/Oslo', weekday: 'long', month: 'numeric', day: 'numeric' })}</h3>}
                       
                        {locations.map((location, i) => {
                          const filteredEvents = mergedEvents.filter(performance => (`${performance.location?.[0]?.title}` == location));
                          const filteredPerformance = filteredEvents.filter(performance => performance.date == item.date);
                          return(
                            <>
                            {filteredPerformance.length > 0 &&
                              <div className='program-location-item'>
                                <>
                                  <div className='location'>{filteredPerformance[0].location[0].title}</div>
                                
                                  {filteredEvents.map((performance, i) => {
                                    return(
                                      <>
                                        {item.date == performance.date && 
                                          <a className='performance' href={`/festival/${slug}/${performance.slug}`}>
                                            <div className='time'>{new Date(performance.time).toLocaleTimeString("nb", {timeZone: 'Europe/Oslo', hour: "2-digit", minute: "2-digit" })}</div> 
                                            <div className='artist'>{performance.fullTitle}</div>
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
                      </>
                    )
                  })}
                </div>
              }
              {item.url == "#artister" && event.performances.length > 0 &&
                <>
                <div className='line-up'>
                  {event.performances.map((item, i) => {
                    return(
                      <div className='lineup-item'>
                        <a href={`/festival/${slug}/${item.slug}`}>
                          {item.artist[0].title} 
                          {/* {item.artist?.[0].artistMeta && <sup>{`(${item.artist?.[0].artistMeta})`}</sup>} */}
                        </a>
                      </div>
                    )
                  })}
                  {event.linkedEvents.map((item, i) => {
                    return(
                      <div className='lineup-item'>
                        <a href={`/festival/${slug}/event/${item.slug}`}>
                          {item.title} 
                        </a>
                      </div>
                    )
                  })}
                  <div className='lineup-text' dangerouslySetInnerHTML={{ __html: event.lineup }}></div>
                </div>
                <div className='artists-section'>
                  {event.performances.map((performance, i) => {
                    return(
                      <Link to={`/festival/${event.slug}/${performance.slug}`} className='artist-item'>
                        {performance.artist[0].featuredImage[0]?.url && 
                          <div className='img-wrapper'>
                            <img src={performance.artist[0].featuredImage[0]?.url} alt={performance.artist[0].title} />
                          </div>
                        }
                        <div className='info-bar'>
                          <h3>{performance.artist[0].title}</h3>
                          {performance.artist?.[0].artistMeta && <div>{`(${performance.artist?.[0].artistMeta})`}</div>}
                        </div>
                      </Link>
                    )
                  })}
                  {event.linkedEvents.map((performance, i) => {
                    return(
                      <Link to={`/festival/${event.slug}/event/${performance.slug}`} className='artist-item'>
                        {performance.featuredImage[0]?.url && <div className='img-wrapper'><img src={performance.featuredImage[0]?.url} alt={performance.title} /></div>}
                        <div className='info-bar'>
                          <h3>{performance.title}</h3>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                </>
              }
              {item.url == "#billetter" && event.tickets.length > 0 &&
                <div className='tickets'>
                  <div className='content' dangerouslySetInnerHTML={{ __html: event.tickets.filter(el => el.textContent?.length > 0)?.[0]?.textContent }}></div>
                  <div className='flex'>
                    {event.tickets.map((ticket, i) => {
                      return(
                        <>
                        {ticket.ticketLink &&
                          <a className='ticket' href={`${ticket.ticketLink}`} target="_blank">
                            <h3>{ticket.description} <br/>
                              <p>{ticket.subdescription}</p>
                            </h3>

                            <p className='price-label'>{ticket.price} Kr</p>
                          </a>
                        }
                        </>
                      )
                    })}
                  </div>
                </div>
              }
              {item.url == "#info" && 
                <div className='flex'>
                  {ekko_festival_info?.entry?.contact && <div className='contact' dangerouslySetInnerHTML={{ __html: ekko_festival_info?.entry?.contact }}></div>}
                  {ekko_festival_info?.entry?.content && <div className='content' dangerouslySetInnerHTML={{ __html: ekko_festival_info?.entry?.content }}></div>}
                </div>
              }
              {item.url == "#arena" && 
                <div className='arena-flex'>
                  <div className='content' dangerouslySetInnerHTML={{ __html: event.sections.filter(el => el.sectionTitle == item.title)?.[0]?.sectionBody }}></div>
                  <div className='images'>
                    {event.sections.filter(el => el.sectionTitle == item.title)?.[0]?.images.map((item, i) => {
                      return(
                        <img src={item.url}/>
                      )
                    })}
                  </div>
                </div>
              }
              {item.url == "#intro" && 
                <div className='intro-flex'>
                  <div className='content' dangerouslySetInnerHTML={{ __html: event.sections.filter(el => el.sectionTitle == item.title)?.[0]?.sectionBody }}></div>
                  <div className='images'>
                    {event.sections.filter(el => el.sectionTitle == item.title)?.[0]?.images.map((item, i) => {
                      return(
                        <img src={item.url}/>
                      )
                    })}
                  </div>
                </div>
              }
              {item.url == "#frivillig" && 
                <div className='content flex' dangerouslySetInnerHTML={{ __html: event.sections.filter(el => el.sectionTitle == item.title)?.[0]?.sectionBody }}></div>
              }
              {item.url == "#bilder" && 
                <>
                  <div className='content' dangerouslySetInnerHTML={{ __html: event.sections.filter(el => el.sectionTitle == item.title)?.[0]?.sectionBody }}></div>
                  {ekko_festival_info.entry.gallery.length > 0 && <ImageSlider item={ekko_festival_info.entry.gallery}/>}
                </>
              }
              {item.url == "#arkiv" && 
                <>
                 <div className='content' dangerouslySetInnerHTML={{ __html: event.sections.filter(el => el.sectionTitle == item.title)?.[0]?.sectionBody }}></div>
                  <div className="grid">
                    <Spacer number={12} border={""}/>
                    <a className='show-all-button' href="/festival/archive"><h2>Vis fullt arkiv</h2></a>
                  </div>
                </>
              }
            </>
          </Collapsible>
        )
      })}
      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
		</Container>
    </>
  );
}
