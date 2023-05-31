import Spacer from './spacer';

export default function News({news, page} : {news:any, page:any}) {
  return (
    <>
      <div className='flex space-between'>
        {news.map((item:any, i:any) => {
          return(
            <a className='news-item' key={`news${i}`} href={`/${page}/news/${item.slug}`}>
              <img src={item.newsPhoto[0].url} alt="" />
              <div className='info-box'>
                <h2>{item.title}</h2>
                <p style={{margin: '5px 0'}}>Les mer...</p>
                {/* <div dangerouslySetInnerHTML={{__html: item.newsIntro}}></div> */}
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
