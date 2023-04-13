import Moment from 'moment';

export default function ArchiveItem({ item }: { item: any }) {
  return (
    <div className='agenda-item'>
      <p className='time'>{Moment(item.date).format("dddd D.M.Y")}</p>
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
    </div>
  );
}
