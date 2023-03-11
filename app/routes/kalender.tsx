import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';

export const loader: LoaderFunction = () => {
  return fetchAllEvents();
};

export default function Index() {
  let { events } = useLoaderData<AllEvents>();

  let filteredEvents = [];
  var currentTime = new Date();

  filteredEvents = events.filter((item: any) => {
    var itemDate = new Date(item.date);
    return itemDate.getTime() >= currentTime.getTime();
  });

  return (
    <Container>
      <div className="kalender">
        <div className="grid">
          {filteredEvents.reverse().map((item, i) => {
            return (
              <>
                <Link to={`/${item.type}/${item.slug}`} key={`event-${i}`} className="item w3">
                  <div className="img">
                    {item.featuredImage && (
                      <img src={item.featuredImage[0]?.url} alt={item.title} />
                    )}
                  </div>
                  <div className="text">
                    <p>{Moment(item.date).format("D/M/yy")}</p>
                    <br/>
                    <h3>{item.title}</h3>
                     <p>
                        {item.location?.[1] && item.location[1].fullTitle}
                    </p>
                    {item.openingTime &&
                      <p>{Moment(item.openingTime).format("HH:mm")}  {item.closingTime && <>- {Moment(item.closingTime).format("HH:mm")} </>}</p>
                    }
                  </div>
                </Link>
                {item.performances.map((performance, j) => {
                  return(
                    <Link to={`/${item.type}/${item.slug}/${performance.slug}`} key={`performance-${j}`} className="item w3">
                      <div className="img artist">
                        {performance.artist[0].featuredImage[0] ? 
                          <img src={performance.artist[0].featuredImage[0]?.url} alt={item.title} />
                          : <img src={item.featuredImage[0]?.url} alt={item.title} />
                        }
                      </div>
                      <div className="text">
                        <p>{Moment(performance.date).format("D/M/yy")} </p>
                        <br/>
                        <h3>
                          {performance.artist[0].title ? 
                            performance.artist[0].title
                          : performance.title
                          }
                        </h3>
                        {performance.location?.[1] &&
                          <p>
                              {performance.location[1].fullTitle}
                          </p>
                        }
                        {performance.time &&
                          <p>
                            {performance.time}  {performance.timeEnd && <>- {performance.timeEnd} </>}
                          </p>
                        }
                      </div>
                    </Link>
                  )
                })}
              </>
            );
          })}
          <Spacer number={6} border="" />
        </div>
      </div>
    </Container>
  );
}
