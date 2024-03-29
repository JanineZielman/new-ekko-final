import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import type { NewsEntry } from '~/service/data/newsPage';
import { fetchNewsPage } from '~/service/data/newsPage';
import SEO from '~/components/seo';

export const loader: LoaderFunction = async ({ params }) => {
  const [news] = await Promise.all([
    fetchNewsPage(params.newsSlug!),
  ]);

  return { news };
};

export default function Index() {
  const {  news } = useLoaderData<{ news: NewsEntry }>();

  return (
		<>
		<SEO
      title={`${news.entry.title}`}
      description={news.entry.newsIntro ? news.entry.newsIntro.replace(/<[^>]+>/g, '') : ''}
      imageUrl={news.entry.newsPhoto[0]?.url ? news.entry.newsPhoto[0]?.url : news.entry.pagePhoto[0]?.url}
    />
    <Container back={'/ostre/news'}>
      <div className="fake-grid news-page">
        
				<div className='left-wrap'>
					<div className="padding">
							<h1>{news.entry.title}</h1> 
							<p><div dangerouslySetInnerHTML={{ __html: news.entry.newsIntro }}></div></p>
							{news.entry.complexContent?.map(block => {
								if (block.blockType === 'text') {
									return (
										<div dangerouslySetInnerHTML={{ __html: block.text }}></div>
									);
								}
							})}
					</div>
					<br/>
					
				</div>


				<div className='text-block padding news-text-block'>
					<br/>
					<div className='news-page-img'>
						{news.entry.newsPhoto[0] ? 
								<div className='img-wrapper'><img src={news.entry.newsPhoto[0]?.url} alt={news.entry.title} /></div>
								: <div className='img-wrapper'><img src={news.entry.pagePhoto[0]?.url} alt={news.entry.title} /></div>
							}
					</div>
					{news.entry.complexContent?.map(block => {
						if (block.blockType === 'embed') {
							return (
								<div className='embed' dangerouslySetInnerHTML={{ __html: block.code }}></div>
							);
						}
						if (block.blockType === 'video') {
							return (
								<div className='embed'>
									<iframe src={block.videoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/')}/>
								</div>
							);
						}
						if (block.blockType === 'imageBlock') {
							return (
								<div className='img-wrapper'>
									<img  src={block.image[0].url}/>
								</div>
							);
						}
					})}
				</div>
      </div>
			<div className='grid'>
        <Spacer number={12} border=""/>
      </div>
    </Container>
		</>
  );
}
