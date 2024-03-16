import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import ArchiveItem from '~/components/archiveItem';
import SEO from '~/components/seo';

export const loader: LoaderFunction = () => {
  return fetchAllEvents(999);
};

export default function Archive() {
  let { events } = useLoaderData<AllEvents>();

  let filteredEvents: any[] = [];
  var currentTime = new Date();
  currentTime.setDate(currentTime.getDate() - 1);

  filteredEvents = events.filter((item: any) => {
    var itemDate = new Date(item.date);
    return itemDate.getTime() <= currentTime.getTime();
  });

  return (
    <>
    <SEO
      title={`Archive`}
      description={''}
      imageUrl={''}
    />
    <Container back={false}>
      <div className='fake-grid black'>
        <h1 className='archive-title'>Archive</h1>
        {filteredEvents.map(event => (
          <>
            {event.type == 'festival' ?
              <Link to={`/${event.type}/${event.slug}`} key={`event-${event.slug}`}>
                <ArchiveItem item={event}/>
              </Link>
            :
              <Link to={`/ostre/${event.slug}`} key={`event-${event.slug}`}>
                <ArchiveItem item={event}/>
              </Link>
            }
          </>
        ))}
      </div>

      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
    </>
  );
}