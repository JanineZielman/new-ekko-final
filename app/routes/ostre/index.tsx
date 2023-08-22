import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import { fetchRecentNews } from '~/service/data/news';
import type { RecentNews } from '~/service/data/news';
import { fetchAllEvents } from '~/service/data/events';
import type { AllEvents } from '~/service/data/events';
import type { Navigation } from '~/service/data/global';
import { getNavigation } from '~/service/data/global';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import Collapsible from '~/components/collapsible';
import News from '~/components/news';
import KalenderItem from '~/components/kalenderItem';
import ImageSlider from '~/components/imageSlider';
import SEO from '~/components/seo';

export const loader: LoaderFunction = async ({params}) => {
  const [ostre, news, events, navigation] = await Promise.all([
    fetchContentPage('ostre'),
    fetchRecentNews(2),
    fetchAllEvents(25),
    getNavigation()
  ]);

  return { ostre, news, events, navigation };
};

export const meta: MetaFunction = ({ data }) => ({
  title: (data as PageEntry).entry?.title,
});

export default function Oestre() {
  var Moment = require('moment');
  require('moment/locale/nb');

  const { ostre, news, events, navigation } = useLoaderData<{ ostre: PageEntry, news: RecentNews, events: AllEvents, navigation: Navigation }>();

  let filteredEvents = [];
  var currentTime = new Date();
  currentTime.setDate(currentTime.getDate() - 1);

  filteredEvents = events.events.filter((item: any) => {
    var itemDate = new Date(item.date);
    return itemDate.getTime() >= currentTime.getTime();
  });

  console.log(ostre)


  return (
    <>
    <SEO
      title={`EKKO | ${ostre.entry.title}`}
      description={ostre.entry.content ? ostre.entry.content.replace(/<[^>]+>/g, '') : ''}
      imageUrl={''}
    />
    <Container back={false}>
      <div className="grid">
        
        {filteredEvents.filter(item => item.type == 'event').slice(-1).map((item,i) => {
          return(
            <>
              <Spacer number={72} border={""}/>
              <a className='event-highlight' href={`/ostre/${item.slug}`}>
                <img src={item.featuredImage?.[0]?.url} alt="" />
                <div className='info-box'>
                  <p className='time cap'>{Moment(item.date).format("dddd D.M.")} {item.openingTime && Moment(item.openingTime).utcOffset('+0100').format("HH:mm")}</p>
                  <h2>{item.title}:</h2>
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
            </>
          )
        })}
      </div>
      {navigation.nodes.filter(word => word.navHandle == 'ostre').map((item, i) => {
        return(
          <Collapsible trigger={item.title} open={false} slug={item.url?.replace('#', '')}>
            <>
              {item.url == '#nyheter' && 
                <>
                  <News news={news.events} page={`ostre`}/>
                  <div className="grid">
                    <Spacer number={12} border={""}/>
                    <a className='show-all-button' href="/ostre/news"><h2>Show all</h2></a>
                  </div>
                </>
              }
              {item.url == '#kalender' && 
                <>
                  {filteredEvents.filter(item => item.type == 'event').slice(-5).reverse().map((item,i) => {
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
                    <a className='show-all-button' href="/ostre/kalender"><h2>Full kalender</h2></a>
                  </div>
                </>
              }
              {item.url == "#intro" && 
                <div className='arena-flex'>
                  <div className='content' dangerouslySetInnerHTML={{ __html: ostre.entry.sections.filter(el => el.sectionTitle == item.title)?.[0]?.sectionBody }}></div>
                  <div className='images'>
                    {ostre.entry.sections.filter(el => el.sectionTitle == item.title)?.[0]?.images.map((item, i) => {
                      return(
                        <img src={item.url}/>
                      )
                    })}
                  </div>
                </div>
              }
              {item.url == '#info' && 
                <div className='flex'>
                  {ostre.entry.contact && <div className='contact' dangerouslySetInnerHTML={{ __html: ostre.entry.contact }}></div>}
                  {ostre.entry.content && <div className='content' dangerouslySetInnerHTML={{ __html: ostre.entry.content }}></div>}
                </div>
              }
              {item.url == '#arkiv' && 
                <>
                  {ostre.entry.linkedEvents.length > 0 && <ImageSlider item={ostre.entry.linkedEvents}/>}
                  <div className="grid">
                    <Spacer number={12} border={""}/>
                    <a className='show-all-button' href="/ostre/archive"><h2>Vis fullt arkiv</h2></a>
                  </div>
                </>
              }
              {item.url == "#frivillig" && 
                <div className='content padding flex' dangerouslySetInnerHTML={{ __html: ostre.entry.sections.filter(el => el.sectionTitle == item.title)?.[0]?.sectionBody }}></div>
              }
            </>
          </Collapsible>
        )
      })}

      <div className="grid">
        <Spacer number={12} border={""}/>
      </div>
    </Container>
    </>
  );
}
