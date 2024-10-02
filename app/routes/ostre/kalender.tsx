import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import KalenderItem from '~/components/kalenderItem';
import SEO from '~/components/seo';

export const loader: LoaderFunction = () => {
  return fetchAllEvents(25);
};

export default function Index() {
  let { events } = useLoaderData<AllEvents>();

  var Moment = require('moment');
  require('moment/locale/nb');

  let filteredEvents: any[] = [];
  var currentTime = new Date();
  currentTime.setDate(currentTime.getDate() - 1);
  let months = ["januar", "februar", "mars", "april", "mai", "juni",
  "juli", "august", "september", "oktober", "november", "desember"];

  filteredEvents = events.reverse().filter((item: any) => {
    var itemDate;
    if (item.dateEnd) {
      itemDate = new Date(item.dateEnd);
    } else {
      itemDate = new Date(item.date);
    }
    return itemDate.getTime() >= currentTime.getTime();
  });

  return (
    <>
    <SEO
      title={`Kalender`}
      description={''}
      imageUrl={''}
    />
    <Container back="/ostre">

      {months.map((item, i) => {
        let content = false;
        {filteredEvents.map((event,j) => {
          if (Moment(event.date).format("MMMM") == item) {
            content = true;
          }
        })}
        
        return(
          <>
            {content && 
              <Collapsible trigger={item} open={true} slug={item}>
                {filteredEvents.map((event,j) => {
                  return(
                    <>
                      { (Moment(event.date).format("MMMM") == item) && 
                        <div>
                          {event.type == 'festival' ?
                            <a href={`/festival/${event.slug}`}>
                              <KalenderItem item={event}/>
                            </a>
                            :
                            <>
                              {event.linkedFestival.length == 0 &&
                                <a href={`/ostre/${event.slug}`}>
                                  <KalenderItem item={event}/>
                                </a>
                              }
                            </>
                          }
                        </div>
                      }
                    </>
                  )
                })}
              </Collapsible>
           } 
          </>
        )
      })}
    </Container>
    </>
  );
}