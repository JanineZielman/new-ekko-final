export default function KalenderItem({ item }: { item: any }) {
  return (
    <div className='agenda-item'>
      <div className='time'>
        <div className='indicator'>Dato</div>
        <p className="cap">
        {new Date(item.date).toLocaleDateString("nb", {timeZone: 'Europe/Oslo', weekday: 'long', month: 'numeric', day: 'numeric' })} {item.dateEnd && `- ${new Date(item.dateEnd).toLocaleDateString("nb", {timeZone: 'Europe/Oslo', weekday: 'long', month: 'numeric', day: 'numeric' })} `}
          { item.openingTime && new Date(item.openingTime).toLocaleTimeString("nb", {timeZone: 'Europe/Oslo', hour: "2-digit", minute: "2-digit" })}
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
      <div className="event-title">
        <div className='indicator'>Tittel</div>
        <p>{item.title}</p>
      </div>

      <div className='artists'>
        {item.performances.length > 0 &&
          <>
            <div className='indicator'>Artister</div>
            <h3>
              {item.performances?.map((performance:any,j:any) => {
                return(
                  <>
                  {item.performances[j - 1]?.artist[0].title != performance.artist[0].title &&
                    <span>
                      {performance.artist[0].title}
                    </span>
                  }
                  </>
                )
              })}
              {item.linkedEvents?.map((item:any, i:any) => {
                return(
                  <span>
                    {item.title}
                  </span>
                )
              })}
            </h3>
          </>
        }
      </div>
      {item.ticketLink?.includes('https') ?
        <div className='ticket-button'>
          <a className='ticket-link button' href={item.ticketLink} target="_blank">Kjøp billetter</a>
        </div>
        :
        <div className='ticket-button'>
          <div className='ticket-link button'>Kjøp billetter</div>
        </div>
      }
    </div>
  );
}