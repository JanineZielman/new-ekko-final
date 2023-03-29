import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';

export const loader: LoaderFunction = () => {
  return fetchAllEvents(25);
};

export default function Index() {
  let { events } = useLoaderData<AllEvents>();

  let filteredEvents = [];
  var currentTime = new Date();

  filteredEvents = events.reverse().filter((item: any) => {
    var itemDate = new Date(item.date);
    return itemDate.getTime() >= currentTime.getTime();
  });

  return (
    <Container>

      <Collapsible trigger="March" open={true} slug={'march'}>
        {filteredEvents.map((item,i) => {
          return(
            <div className='agenda-item'>
              <p className='time'>{Moment(item.date).format("D.M.  dddd")} {Moment(item.openingTime).format("HH:mm")}</p>
            
                
                <p className='title'>{item.title}</p>
                <h3 className='artists'>
                  {item.performances.map((performance,j) => {
                    return(
                      <span>
                        {performance.artist[0].title}
                      </span>
                    )
                  })}
                </h3>
                <a className='tickets' href="#">Billetter</a>
        
            </div>
          )
        })}
      </Collapsible>
      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
  );
}
