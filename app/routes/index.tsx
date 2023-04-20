import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import Collapsible from '~/components/collapsible';
import React, {useEffect} from 'react';
import type { Navigation } from '~/service/data/global';
import { getNavigation } from '~/service/data/global';


export const loader: LoaderFunction = async () => {
  const [navigation] = await Promise.all([
    getNavigation()
  ]);

  return { navigation };
};

export default function Index() {
  const { navigation } = useLoaderData<{ navigation: Navigation }>();

  console.log(navigation)

  useEffect(() => {
    $(document).ready(() => {
      $('.gravity').jGravity({ // jGravity works best when targeting the body
        target: 'div#gravity', // Enter your target critera e.g. 'div, p, span', 'h2' or 'div#specificDiv', or even 'everything' to target everything in the body
        ignoreClass: 'ignoreMe', // Specify if you would like to use an ignore class, and then specify the class
        weight: 25, // Enter any number 1-100 ideally (25 is default), you can also use 'heavy' or 'light'
        depth: 1, // Enter a value between 1-10 ideally (1 is default), this is used to prevent targeting structural divs or other items which may break layout in jGravity
        drag: true // Decide if users can drag elements which have been effected by jGravity
      });
    });
  }, [])

  return (
    <Container back={false}>
      <div className="grid gravity-grid" id="wrapper">
        {/* <Spacer number={72} border=""/> */}
        <div className='gravity'>
          {navigation.nodes.map((item, i) => {
            return(
              <div id="gravity" className={`gravity-item ${item.navName} ${item.title}`}>
                {item.title}
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  );
}
