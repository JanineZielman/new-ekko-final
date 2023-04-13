import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Moment from 'moment';

import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import { fetchRecentNews } from '~/service/data/news';
import type { RecentNews } from '~/service/data/news';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import News from '~/components/news';
import KalenderItem from '~/components/kalenderItem';
import ImageSlider from '~/components/imageSlider';


export const loader: LoaderFunction = async ({params}) => {
  const [ostre, news, events] = await Promise.all([
    fetchContentPage('ostre'),
    fetchRecentNews(2),
    fetchAllEvents(25),
  ]);

  return { ostre, news, events };
};

export const meta: MetaFunction = ({ data }) => ({
  title: (data as PageEntry).entry?.title,
});

export default function Oestre() {
  const { ostre, news, events } = useLoaderData<{ ostre: PageEntry, news: RecentNews, events: AllEvents }>();

  let filteredEvents = [];
  var currentTime = new Date();

  filteredEvents = events.events.filter((item: any) => {
    var itemDate = new Date(item.date);
    return itemDate.getTime() >= currentTime.getTime();
  });

  return (
    <Container back={false}>
      <div className="grid">
        <Spacer number={72} border={""}/>
        {filteredEvents.slice(-1).map((item,i) => {
          return(
            <a className='event-highlight' href={`/ostre/${item.slug}`}>
              <img src={item.featuredImage?.[0]?.url} alt="" />
              <div className='info-box'>
                <p className='time'>{Moment(item.date).format("D.M.  dddd")} {Moment(item.openingTime).utcOffset('+0000').format("HH:mm")}</p>
                <h2>{item.title}</h2>
                <h2 className='artists'>
                  {item.performances.map((performance,j) => {
                    return(
                      <span>
                        {performance.artist[0].title}
                      </span>
                    )
                  })}
                </h2>
              </div>
            </a>
          )
        })}
      </div>
      <Collapsible trigger="News" open={false} slug={'news'}>
        <News news={news.events} page={`ostre`}/>
        <div className="grid">
          <Spacer number={12} border={""}/>
          <a className='show-all-button' href="/ostre/news"><h2>Show all</h2></a>
        </div>
      </Collapsible>
      <Collapsible trigger="Calendar" open={false} slug={'calendar'}>
        {filteredEvents.slice(-5).reverse().map((item,i) => {
            return(
              <div>
                <a href={`/ostre/${item.slug}`}>
                  <KalenderItem item={item}/>
                </a>
              </div>
            )
          })}
          
          <div className="grid">
            <Spacer number={12} border={""}/>
            <a className='show-all-button' href="/ostre/kalender"><h2>Full kalendar</h2></a>
          </div>
          
      </Collapsible>

      <Collapsible trigger={ostre.entry.title} open={false} slug={ostre.entry.slug}>
        <div className='flex'>
          <div className='contact' dangerouslySetInnerHTML={{ __html: ostre.entry.contact }}></div>
          <div className='content' dangerouslySetInnerHTML={{ __html: ostre.entry.content }}></div>
        </div>
      </Collapsible>

      <Collapsible trigger='Arkiv' open={false} slug={`arkiv`}>
        {ostre.entry.gallery.length > 0 && <ImageSlider item={ostre.entry.gallery}/>}
        <div className="grid">
          <Spacer number={12} border={""}/>
          <a className='show-all-button' href="/archive"><h2>Tidligere arrangementer</h2></a>
        </div>
      </Collapsible>

      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
  );
}
