import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

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
    <Container back={'/ostre/news'}>
      <div className="fake-grid news-page">
        
				<div className='left-wrap'>
					<div className="padding">
							<h1>{news.entry.title}</h1> 
							<h3><div dangerouslySetInnerHTML={{ __html: news.entry.newsIntro }}></div></h3>
					</div>

					<div className='news-page-img'>
						{news.entry.newsPhoto[0] ? 
								<div className='img-wrapper'><img src={news.entry.newsPhoto[0]?.url} alt={news.entry.title} /></div>
								: <div className='img-wrapper'><img src={news.entry.pagePhoto[0]?.url} alt={news.entry.title} /></div>
							}
					</div>
				</div>


				<div className='text-block padding news-text-block'>
					<br/>
					{news.entry.complexContent?.map(block => {
						if (block.blockType === 'text') {
							return (
								<div dangerouslySetInnerHTML={{ __html: block.text }}></div>
							);
						}
					})}
				</div>
      </div>
			<div className='grid'>
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
