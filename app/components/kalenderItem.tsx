import Moment from 'moment';

export default function KalenderItem({ item }: { item: any }) {
  return (
    <div className='agenda-item'>
      <p className='time'>{Moment(item.date).format("D.M.  dddd")} {Moment(item.openingTime).utcOffset('+0000').format("HH:mm")}</p>
      <p className='title'>{item.title}</p>
      <h3 className='artists'>
        {item.performances?.map((performance:any,j:any) => {
          return(
            <span>
              {performance.artist[0].title}
            </span>
          )
        })}
      </h3>
      {item.ticketLink?.includes('https') ?
        <a className='ticket-link' href={item.ticketLink} target="_blank">Billetter</a>
        :
        <div className='no-ticket'></div>
      }
    </div>
  );
}
