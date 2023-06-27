export default function KalenderItem({ item }: { item: any }) {
  var Moment = require('moment');
  require('moment/locale/nb');

  return (
    <div className='agenda-item'>
      <div className='time'>
        <div className='indicator'>Dato</div>
        <p className="cap">
          {Moment(item.date).format("dddd D.M.")} {item.dateEnd && `- ${Moment(item.dateEnd)?.format("dddd D.M.")} `}
          { item.openingTime && Moment(item.openingTime).utcOffset('+0000').format("HH:mm")}
        </p>
      </div>
      {item.organizer?.[0]?.title ?
        <div className='title'>
          <div className='indicator'>Arrangør</div>
          <p>{item.organizer[0].title}</p>
        </div>
        :
        <div className='title'></div>
      }
      <div className='artists'>
        <div className='indicator'>Artister</div>
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
      <div className="ticket-info">
        <div dangerouslySetInnerHTML={{__html: item.ticketDescription}}></div>
      </div>
      {item.ticketLink?.includes('https') ?
        <div className='ticket-button'>
          <a className='ticket-link button' href={item.ticketLink} target="_blank">Kjøp billetter</a>
        </div>
        :
        <div className='ticket-button no-ticket'>
          <div className='ticket-link button'>Ingen forsalg</div>
        </div>
      }
    </div>
  );
}
