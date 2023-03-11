import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';

export const loader: LoaderFunction = ({ params }) => {
  return fetchEvent(params.festivalSlug!);
};

export default function Index() {
  const event = useLoaderData<Event>();

  return (
    <Container>
			<div className="grid">
				<Link to={`${event.performances[0].slug}`} className='item w4 l4'>
					<div className='w6 w-smaller'>
						<div className='img-wrapper'><img src={event.performances[0].artist[0].featuredImage[0].url}/></div>
						<div className="flex space-between white-bg">
							<div className="info">
								<h4>{event.performances[0].artist[0].title}</h4>
								<p>{event.performances[0].time}, {event.performances[0].location[0].title}</p>
							</div>
							<div className="times big">{Moment(event.performances[0].date).format('D/MM')}</div>
						</div>
					</div>
				</Link>
				<div className='w2 l4 mobile-w6'>
					<div className='item w2'>
            {event.relatedLinks.map((link, i) => {
              return(
                <div className='big times'><a href={`${link.linkUrl}`}>{link.linkTitle}</a></div>
              )
            })}
					</div>
					<div className='item w2 no-border'>
						<h3>{event.title}</h3>
						<div dangerouslySetInnerHTML={{ __html: event.intro }}></div>
						<div dangerouslySetInnerHTML={{ __html: event.lineup }}></div>
					</div>
				</div>
				<div className='item w4 l4'>
					{event.performances.slice(1,5).map((item, i) => {
						return(
							<Link to={`${item.slug}`} className='w3 l2'>
								<div className='img-wrapper'><img src={item.artist[0].featuredImage[0].url}/></div>
								<div className="flex space-between white-bg">
									<div className="info">
										<h4>{item.artist[0].title}</h4>
										<p>{item.time}, {item.location[0].title}</p>
									</div>
									<div className="times big">{Moment(item.date).format('D/MM')}</div>
								</div>
							</Link>
						)
					})}
				</div>
				<Spacer number={8} border=""/>
        <div className='item w2 white-bg align-bottom offset'>
          <div className='times big'>{event.relatedLinks[0].linkTitle}</div>
        </div>
        <Spacer number={4} border=""/>
        <div className='item w4 l2' id={event.relatedLinks[0].linkUrl.replace('#', '')}>
          <div className='columns w6'>
            {event.performances.map((item, i) => {
              return(
                <Link to={`${item.slug}`}>
                  <p>{item.artist[0].title}</p>
                </Link>
              )
            })}
          </div>
        </div>
        <Spacer number={4} border=""/>
        <div className='item w2 white-bg align-bottom offset' id={event.relatedLinks[1].linkUrl.replace('#', '')}>
          <div className='times big'>{event.relatedLinks[1].linkTitle}</div>
        </div>
        <Spacer number={4} border=""/>
        {event.program.map((item, i) => {
          return(
            <div className='item w3'>
              <div className='white-bg no-padding'>
                <h4>{Moment(item.date).format('ddd D. MMMM')}</h4>
              </div>
              <br/>
              {event.performances.map((performance, i) => {
                return(
                  <>
                    {item.date == performance.date &&
                      <Link to={`${performance.slug}`} className='program-day'>
                        <p>{performance.location[0].title}</p>
                        <h4>{performance.time} {performance.artist[0].title}</h4>
                      </Link>
                    }
                  </>
                )
              })}
            </div>
          )
        })}
        {event.program.length % 2 != 0 &&
          <Spacer number={3} border=""/>
        }
        <Spacer number={6} border=""/>
        <Spacer number={2} border=""/>
        <div className='item w4 offset' id={event.relatedLinks[2].linkUrl.replace('#', '')}>
          <div className='w2'>
            <div className='times big'>{event.relatedLinks[2].linkTitle}</div>
            <div><br/></div>
          </div>
         
          {event.tickets.map((ticket, i) => {
            return(
              <a className='item w6 white-bg ticket' href={`${ticket.ticketLink}`} target="_blank">
                <h4>{ticket.description}</h4>
                <p>{ticket.price} Kr</p>
              </a>
            )
          })}
        </div>
        <Spacer number={6} border=""/>
			</div>
		</Container>
  );
}
