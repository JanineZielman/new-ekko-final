import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { fetchRecentNews } from '~/service/data/news';
import type { RecentNews } from '~/service/data/news';

import Container from '~/components/container';
import Spacer from '~/components/spacer';

export const loader: LoaderFunction = async () => {
  const [news] = await Promise.all([
    fetchRecentNews(),
  ]);

  return { news };
};

export default function Index() {
  const { news } = useLoaderData<{ news: RecentNews }>();

  return (
    <Container>
      <div className="grid">

        {news?.events?.map((item, i) => {
          return (
            <Link to={`/news/${item.slug}`} key={`news-${i}`} className="item w3 artist">
              {item.newsPhoto[0] ? 
                <div className='img-wrapper'><img src={item.newsPhoto[0]?.url} alt={item.title} /></div>
                : <div className='img-wrapper'><img src={item.pagePhoto[0]?.url} alt={item.title} /></div>
              }
              <div className="flex space-between padding">
                 <h3>{item.title}</h3>
              </div>
            </Link>
          );
        })}

				{news?.events?.length % 2 != 0 &&
          <Spacer number={3} border=""/>
        }

        <Spacer number={6} border=""/>
      </div>
    </Container>
  );
}
