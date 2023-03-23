import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import { fetchRecentNews } from '~/service/data/news';
import type { RecentNews } from '~/service/data/news';
import Collapsible from '~/components/collapsible';
import News from '~/components/news';


// export const loader: LoaderFunction = () => {
//   return fetchContentPage('ostre');
// };

export const loader: LoaderFunction = async ({params}) => {
  const [ostre, news] = await Promise.all([
    fetchContentPage('ostre'),
    fetchRecentNews(2),
  ]);

  return { ostre, news };
};

export const meta: MetaFunction = ({ data }) => ({
  title: (data as PageEntry).entry?.title,
});

export default function Oestre() {
  const { ostre, news } = useLoaderData<{ ostre: PageEntry, news: RecentNews }>();

  return (
    <Container>
      <div className="grid">
        <Spacer number={60} border={""}/>
      </div>
      <Collapsible trigger="News" open={false} slug={'news'}>
        <News news={news}/>
      </Collapsible>
      <Collapsible trigger={ostre.entry.title} open={false} slug={ostre.entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: ostre.entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: ostre.entry.content }}></div>
        </div>
      </Collapsible>
      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
  );
}
