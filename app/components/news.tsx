import Spacer from './spacer';

export default function News({news} : {news:any}) {
  return (
    <>
      <div className='flex space-between'>
        {news.events.map((item:any, i:any) => {
          return(
            <a className='news-item' key={`news${i}`} href={`/news/${item.slug}`}>
              <img src={item.newsPhoto[0].url} alt="" />
              <div className='info-box'>
                <h2>{item.title}</h2>
                <div dangerouslySetInnerHTML={{__html: item.newsIntro}}></div>
              </div>
              
            </a>
          )
        })}
      </div>
      <div className='grid minus-margin'>
        <Spacer number={12} border=""/>
      </div>
    </>
  );
}
