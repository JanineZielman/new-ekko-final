export default function ArchiveItem({ item }: { item: any }) {
  var Moment = require('moment');
  require('moment/locale/nb');
  
  return (
    <div className='agenda-item'>
      <p className="time cap">
        {Moment(item.date).format("dddd D.M.")}{item.dateEnd && ` - ${Moment(item.dateEnd)?.format("dddd D.M.")}`} 
        {Moment(item.date).format("Y")} {item.openingTime && Moment(item.openingTime).utcOffset('+0000').format("HH:mm")}
      </p>
      <p className='title'>{item.title}</p>
      <h3 className='artists'>
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
      </h3>
    </div>
  );
}
