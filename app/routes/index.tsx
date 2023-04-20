import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import React, {useEffect} from 'react';
import type { Navigation } from '~/service/data/global';
import { getNavigation } from '~/service/data/global';
import { Link } from '@remix-run/react';


export const loader: LoaderFunction = async () => {
  const [navigation] = await Promise.all([
    getNavigation()
  ]);

  return { navigation };
};

export default function Index() {
  const { navigation } = useLoaderData<{ navigation: Navigation }>();

  const toggle = navigation.nodes?.filter(nav => nav.navHandle == 'toggle');

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

  console.log(toggle.filter(word => word.url.includes('festival'))[0].url)


  

  return (
    <Container back={false}>
      <div className="grid gravity-grid" id="wrapper">
        {/* <Spacer number={72} border=""/> */}
        <div className='gravity'>
          {navigation.nodes.map((item, i) => {
            return(
              <>
                {item.navName == 'Toggle' ?
                  <div id="gravity" className={`gravity-item ${item.navName} ${item.title}`} 
                  onClick={
                    goTo => {
                      window.location = `${item.url}`;
                    }
                  }>
                    {item.title}
                  </div>
                :
                  <>
                    {item.navHandle == 'festival' ?
                      <div id="gravity" className={`gravity-item ${item.navName} ${item.title}`} 
                        onClick={
                          goTo => {
                            window.location = `${toggle.filter(word => word.url.includes('festival'))[0].url}/${item.url}`;
                          }
                        }>
                          {item.title}
                      </div>
                    :
                      <div id="gravity" className={`gravity-item ${item.navName} ${item.title}`} 
                        onClick={
                          goTo => {
                            window.location = `${item.navHandle}/${item.url}`;
                          }
                        }>
                          {item.title}
                      </div>
                    }
                  </>
                }
              </>
            )
          })}
        </div>
      </div>
    </Container>
  );
}
