import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React, {useState, useEffect} from 'react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import { fetchAllVideos } from '~/service/data/arena';
import type { allVideos } from '~/service/data/arena';

export const loader: LoaderFunction = () => {
  return fetchAllVideos();
};

export const meta: MetaFunction = ({ data }) => ({
  title: (data as allVideos).entries[0]?.title,
});

export default function DigitalArena() {
  const { entries } = useLoaderData<allVideos>();

	const [videoList, setVideoList] = useState([]);
	const [titleList, setTitleList] = useState([]);
	const [randomNumber, setrandomNumber] = useState(0);

	useEffect(() => {
    setrandomNumber(Math.floor(Math.random()*videoList.length))
  }, []);

  return (
    <Container>
			{entries.map((item, i) => {
				return(
					<>
						{item.complexContent &&
							item.complexContent.map((video, j) => {
								if (video.videoUrl) {
									videoList.push(video.videoUrl);
									titleList.push(item.title);
								}
							})
						}
					</>
				)
			})}
      <div className="grid">
				<div className='item w3'>
					{titleList[0] && 
						<div className='align-bottom'>
							<h2>{titleList[randomNumber]}</h2>
						</div>
					}
				</div>
				<Spacer number={3} border=""/>
				<div className='item w5 l3'>
					{videoList[0] && 
						<div className='video-wrapper'>
							<iframe src={videoList[randomNumber]} frameBorder="0"></iframe>
						</div>
					}
				</div>
				<Spacer number={3} border=""/>
        <Spacer number={6} border=""/>
      </div>
    </Container>
  );
}
