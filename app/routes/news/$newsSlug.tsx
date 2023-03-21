import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import Moment from 'moment';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import type { NewsEntry } from '~/service/data/newsPage';
import { fetchNewsPage } from '~/service/data/newsPage';

export const loader: LoaderFunction = async ({ params }) => {
  const [news] = await Promise.all([
    fetchNewsPage(params.newsSlug!),
  ]);

  return { news };
};

export default function Index() {
  const {  news } = useLoaderData<{ news: NewsEntry }>();

  return (
    <Container>
      <div className="grid">
        <div className="item w5 l2 padding">
						<h1 className='big'>{news.entry.title}</h1> 
						<h3><div dangerouslySetInnerHTML={{ __html: news.entry.newsIntro }}></div></h3>
				</div>

				<Spacer number={2} border=""/>

				<div className='item w5 l3'>
					{news.entry.newsPhoto[0] ? 
							<div className='img-wrapper'><img src={news.entry.newsPhoto[0]?.url} alt={news.entry.title} /></div>
							: <div className='img-wrapper'><img src={news.entry.pagePhoto[0]?.url} alt={news.entry.title} /></div>
						}
				</div>

				<Spacer number={3} border=""/>

				<div className='item w5 l6 text-block padding'>
					{news.entry.complexContent?.map(block => {
						if (block.blockType === 'text') {
							return (
								<div dangerouslySetInnerHTML={{ __html: block.text }}></div>
							);
						}
					})}
				</div>

        <Spacer number={6} border=""/>
      </div>
    </Container>
  );
}
