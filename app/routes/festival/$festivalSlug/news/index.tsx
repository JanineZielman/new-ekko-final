import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { fetchRecentNews } from '~/service/data/news';
import type { RecentNews } from '~/service/data/news';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import SEO from '~/components/seo';

import { fetchEvent } from '~/service/data/festival';
import type { Event } from '~/service/data/festival';

export const loader: LoaderFunction = async ({params}) => {
  const [event] = await Promise.all([
    fetchEvent(params.festivalSlug!),
  ]);

  const slug = params.festivalSlug;

  return { event, slug };
};

export default function Index() {
  const { event, slug } = useLoaderData<{ event: Event,  slug: String }>();

  return (
    <>
    <SEO
      title={`News`}
      description={''}
      imageUrl={''}
    />
    <Container back={false}>
      <div className="fake-grid news-section">
        {event.linkednews?.map((item, i) => {
          return (
            <Link to={`/festival/${slug}/news/${item.slug}`} key={`news-${i}`} className="news-grid-item">
              <div className='img-wrapper'><img src={item.pagePhoto[0]?.url} alt={item.title} /></div>
              <div className="flex space-between padding">
                 <h3>{item.title}</h3>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
    </>
  );
}
