import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { fetchRecentEvents } from '~/service/data/home';
import type { RecentEvents } from '~/service/data/home';

import Container from '~/components/container';
import Spacer from '~/components/spacer';

export const loader: LoaderFunction = () => {
  return fetchRecentEvents();
};

export default function Index() {
  const { events } = useLoaderData<RecentEvents>();

  return (
    <Container>
      <div className="grid">
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
