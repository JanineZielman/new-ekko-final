export default function KalenderItem({ item }: { item: any }) {
  var Moment = require('moment');
  require('moment/locale/nb');
  
  return (
    <div className='agenda-item'>
      <div className='time'>
        <div className='indicator'>Date</div>
        <p>{Moment(item.date).format("dddd D.M.")} {Moment(item.openingTime).utcOffset('+0000').format("HH:mm")}</p>
      </div>
      <div className='title'>
        <div className='indicator'>Host</div>
        <p>{item.title}</p>
      </div>
      <div className='artists'>
        <div className='indicator'>Artists</div>
        <h3>
          {item.performances?.map((performance:any,j:any) => {
            return(
              <span>
                {performance.artist[0].title}
              </span>
            )
          })}
        </h3>
      </div>
      {item.ticketLink?.includes('https') ?
        <div className='ticket-info'>
          <a className='ticket-link' href={item.ticketLink} target="_blank">Billetter</a>
        </div>
        :
        <div className='ticket-info no-ticket'>
          <div dangerouslySetInnerHTML={{__html: item.ticketDescription}}></div>
        </div>
      }
    </div>
  );
}
