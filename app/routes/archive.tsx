import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import ArchiveItem from '~/components/archiveItem';

export const loader: LoaderFunction = () => {
  return fetchAllEvents(999);
};

export default function Archive() {
  let { events } = useLoaderData<AllEvents>();

  return (
    <Container back={false}>
      <div className='fake-grid'>
        {events.map(event => (
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
  );
}
