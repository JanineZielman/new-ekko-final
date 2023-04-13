export default function Container({ children, back }: { children: any, back:any }) {
  return(
    <>
      {back && <a href={back} className="back-button">←</a>}
      <div className="container">
        {children}
      </div>
    </>
  ) 
}
