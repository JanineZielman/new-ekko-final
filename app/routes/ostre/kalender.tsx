import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import KalenderItem from '~/components/kalenderItem';

export const loader: LoaderFunction = () => {
  return fetchAllEvents(25);
};

export default function Index() {
  let { events } = useLoaderData<AllEvents>();

  let filteredEvents: any[] = [];
  var currentTime = new Date();
  let months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  filteredEvents = events.reverse().filter((item: any) => {
    var itemDate = new Date(item.date);
    return itemDate.getTime() >= currentTime.getTime();
  });


  return (
    <Container>

      {months.map((item, i) => {
        let content;
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
                        <KalenderItem item={event}/>
                      }
                    </>
                  )
                })}
              </Collapsible>
            }
          </>
        )
      })}

      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
  );
}