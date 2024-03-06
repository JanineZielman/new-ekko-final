export default function ArchiveItem({ item }: { item: any }) {
  var Moment = require('moment');
  require('moment/locale/nb');
  
  return (
    <div className='agenda-item'>
      <div className='time'>
        <div className='indicator'>Dato</div>
        <p className="cap">
          {Moment(item.date).format("dddd D.M.")}{item.dateEnd && ` - ${Moment(item.dateEnd)?.format("dddd D.M.")}`} 
          {Moment(item.date).format("Y")} {item.openingTime && Moment(item.openingTime).utcOffset('+0000').format("HH:mm")}
        </p>
      </div>
     
      <div className="event-title">
        <div className='indicator'>Title</div>
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
    </div>
  );
}
