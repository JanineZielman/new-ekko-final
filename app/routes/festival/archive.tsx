import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import ArchiveItem from '~/components/archiveItem';


export const loader: LoaderFunction = async () => {
  const [events, archive] = await Promise.all([
    fetchAllEvents(999),
    fetchContentPage('archive')
  ]);

  return { events, archive };
};

export default function Archive() {
  const { events, archive } = useLoaderData<{ events: AllEvents; archive: PageEntry}>();

  let filteredEvents: any[] = [];
  var currentTime = new Date();
  currentTime.setDate(currentTime.getDate() - 1);

  filteredEvents = events.events.filter((item: any) => {
    var itemDate = new Date(item.date);
    return itemDate.getTime() <= currentTime.getTime();
  });

  return (
    <Container back={false}>
      <div className='fake-grid yellow'>
        <h1 className='archive-title'>Archive</h1>
        {filteredEvents.map(event => (
          <>
            {event.type == 'festival' &&
              <Link to={`/${event.type}/${event.slug}`} key={`event-${event.slug}`}>
                <ArchiveItem item={event}/>
              </Link>
            }
          </>
        ))}
        {archive.entry.pastEvents.map((item ,i) => {
          return(
            <>
            {item.isFestival &&
              <div className='agenda-item'>
                <div className='time'>
                  <div className='indicator'>Dato</div>
                  <p className="cap">
                    {Moment(item.date).format("dddd D.M.")}{item.dateEnd && ` - ${Moment(item.dateEnd)?.format("dddd D.M.")}`} 
                  </p>
                </div>
                <div className="event-title">
                  <div className='indicator'>Title</div>
                  <p>{item.eventTitle}</p>
                </div>
                <div className='artists'>
                  <div className='indicator'>Artister</div>
                  <h3  dangerouslySetInnerHTML={{ __html: item.artists }}></h3>
                </div>
              </div>
            }
            </>
          )
        })}
      </div>

      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
  );
}
