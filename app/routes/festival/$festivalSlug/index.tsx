import type { LoaderFunction } from '@remix-run/node';
import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import { fetchRecentNews } from '~/service/data/news';
import type { RecentNews } from '~/service/data/news';
import Moment from 'moment';
import $ from 'jquery'; 

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import News from '~/components/news';


export const loader: LoaderFunction = async ({params}) => {
  const [event, ekko_festival_info, news] = await Promise.all([
    fetchEvent(params.festivalSlug!),
    fetchContentPage('ekko_festival_info'),
    fetchRecentNews(2),
  ]);

  return { event, ekko_festival_info, news };
};

export default function Index() {
  const { event, ekko_festival_info, news } = useLoaderData<{ event: Event, ekko_festival_info: PageEntry, news: RecentNews }>();


  event.performances.sort(({ time: a }, { time: b }) => parseInt(Moment(a).utcOffset('+0700').format("HH:mm").replace(/:/g, '')) - parseInt(Moment(b).utcOffset('+0700').format("HH:mm").replace(/:/g, '')))

  const locations: any[] = [];

  for (let i = 0; i < event.performances.length; i++) {
    if (!locations.includes(`${event.performances[i].location[0].title}${event.performances[i].location[1]?.title ? `, ${event.performances[i].location[1]?.title}` : ''}`)) {
      locations.push(`${event.performances[i]?.location?.[0]?.title}${event.performances[i].location[1]?.title ? `, ${event.performances[i].location[1]?.title}` : ''}`);
    }
  }




  return (
    <Container>
			<div className="grid">
        <Spacer number={3} border=""/>
        <div className='item w1'>
          <div className='float graphic-element'>
            <img src={event.festivalSectionGraphicElements?.[0]?.url}/>
          </div>
        </div>
        <Spacer number={20} border=""/>
        <div className='item w1'>
          <div className='float'>
            <h2>{event.title}</h2>
            <h2 dangerouslySetInnerHTML={{ __html: event.intro }}></h2>
          </div>
        </div>
        <Spacer number={35} border=""/>
			</div>

      <Collapsible trigger="News" open={true} slug={'news'}>
        <News news={news}/>
      </Collapsible>

      <Collapsible trigger="Line-up" open={false} slug={'line-up'}>
        <div className='line-up'>
          {event.performances.map((item, i) => {
            return(
              <div>
                {item.artist[0].title}
              </div>
            )
          })}
        </div>
      </Collapsible>

      <Collapsible trigger="Program" open={false} slug={'program'}>
        <div className='program'>
          {event.program.map((item, i) => {
            return(
              <div className='program-day'>
                <h3 className='date'>{Moment(item.date).format("ddd D.M.")}</h3>
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
                                  <p className='flex space-between performance'>
                                    <div className='time'>{performance.time}</div> 
                                    <div className='artist'>{performance.artist[0].title}</div>
                                  </p>
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

      <Collapsible trigger={ekko_festival_info.entry.title} open={false} slug={ekko_festival_info.entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: ekko_festival_info.entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: ekko_festival_info.entry.content }}></div>
        </div>
      </Collapsible>

      <div className='grid'>
        <Spacer number={12} border=""/>
      </div>
		</Container>
  );
}
