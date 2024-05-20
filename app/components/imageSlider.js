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
   
    setTimeout(() => {
      for (let i = 0; i < item.length; i++) {
        const caption = document.createElement("p");
        caption.classList.add('caption-img')
        caption.innerHTML = document.getElementById('slide-img' + (i + 1)).alt;
        document.getElementById('slide-img' + (i + 1)).parentElement.appendChild(caption);
      }
    }, 1000);

	}


  const [urls, setUrls] = useState([]);
  const [captions, setCaptions] = useState([]);


  useEffect(() => {
    for (let i = 0; i < item.length; i++) {
      urls.push(item[i].url)
      captions.push({
        alt: item[i].artistName + ', ' + item[i].ekstraInfo,
        id: 'slide-img' + (i + 1)
      })
    }
  }, [])
  
  return (
    <div className='grid gallery'>
      {item.map((slide, i) => {
        return(
          <div id={`slide${i+1}`} className="img-wrapper" onClick={() => openLightboxOnSlide(Number(i + 1))}>
            <img src={slide.url}/>
          </div>
        )
      })}

      <FsLightbox
        toggler={lightboxController.toggler}
        sources={urls}
        type={'image'}
        slide={lightboxController.slide}
        customAttributes={captions}
      />

    </div>
  );
}