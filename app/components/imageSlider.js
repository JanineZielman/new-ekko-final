import React, { useEffect, useState } from "react";
import FsLightbox from "fslightbox-react";

export default function ImageSlider({ item }) {
  const [lightboxController, setLightboxController] = useState({
		toggler: false,
		slide: 1
	});

	function openLightboxOnSlide(number) {
		setLightboxController({
			toggler: !lightboxController.toggler,
			slide: number
		});
	}


  const [urls, setUrls] = useState([]);


  useEffect(() => {
    for (let i = 0; i < item.length; i++) {
      urls.push(item[i].url)
    }
  }, [])
  
  return (
    <div className='grid gallery'>
      {item.map((slide, i) => {
        return(
          <div className="img-wrapper" onClick={() => openLightboxOnSlide(Number(i + 1))}>
            <img src={slide.url}/>
          </div>
        )
      })}

      <FsLightbox
        toggler={lightboxController.toggler}
        sources={urls}
        type={'image'}
        slide={lightboxController.slide}
      />

    </div>
  );
}