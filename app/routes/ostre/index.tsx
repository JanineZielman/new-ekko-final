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
import SEO from '~/components/seo';
import ImageSlider from '~/components/imageSlider';

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
    var itemDate;
    if (item.dateEnd) {
      itemDate = new Date(item.dateEnd);
    } else {
      itemDate = new Date(item.date);
    }
    return itemDate.getTime() >= currentTime.getTime();
  });

  console.log(ostre.entry.gallery)

  return (
    <>
    <SEO
      title={`${ostre.entry.title}`}
      description={ostre.entry.content ? ostre.entry.content.replace(/<[^>]+>/g, '') : ''}
      imageUrl={''}
    />
    <Container back={false}>
      <div className="grid">
        <Spacer number={60} border={""}/>
        <div className='event-highlight'>
          <img src="/main-pic-festival-2016_web_160701_122022.jpg" alt="" />
          {/* {ostre.entry.linkedEvents.length > 0 && <SimpleImageSlider item={ostre.entry.linkedEvents}/>} */}
        </div>
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
                  {filteredEvents.filter(item => item.type == 'event').slice(-20).reverse().map((item,i) => {
                    return(
                      <>
                      {item.linkedFestival.length == 0 &&
                        <div>
                          <a href={`/ostre/${item.slug}`}>
                            <KalenderItem item={item}/>
                          </a>
                        </div>
                      }
                      </>
                    )
                  })}
                  
                  {/* <div className="grid">
                    <Spacer number={12} border={""}/>
                    <a className='show-all-button' href="/ostre/kalender"><h2>Full kalender</h2></a>
                  </div> */}
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
                  {ostre.entry.gallery?.length > 0 && <ImageSlider item={ostre.entry.gallery}/>}
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