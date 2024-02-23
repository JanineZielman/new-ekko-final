import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { Form, useLoaderData, useSearchParams, Link } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import ArchiveItem from '~/components/archiveItem';
import type { SearchResults } from '~/service/data/search';
import { fetchSearchResults } from '~/service/data/search';
import SEO from '~/components/seo';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') as string;

  return fetchSearchResults(q);
};

export const meta: MetaFunction = ({ location }) => {
  const params = new URLSearchParams(location.search);
  return {
    title: params.get('q') ?? 'Search',
  };
};

export default function Search() {
  const { events } = useLoaderData<SearchResults>();
  const [searchParams] = useSearchParams();

  return (
    <>
    <SEO
      title={`Search`}
      description={''}
      imageUrl={''}
    />
    <Container back={false}>
      <Form className='search-bar'>
        <input
          type="search"
          name="q"
          id=""
          defaultValue={searchParams.get('q') ?? ''}
          placeholder="Search"
          autoFocus
        />
      </Form>
      
        {events?.length > 0 ? (
          <div className="fake-grid">
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
            <div className='grid no-margin-top'>
              <Spacer number={12} border=""/>
            </div>
          </div>
        )
        :
        <div className='min-height'></div>
      }
    </Container>
    </>
  );
}
