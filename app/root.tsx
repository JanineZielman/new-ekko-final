import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { useLocation } from 'react-router-dom';

import styles from '~/styles/global.css';
import kalender from '~/styles/kalender.css';
import Footer from './components/footer';
import Nav from './components/nav';
import Menu from './components/menu';
import breakpoints from '~/styles/breakpoints.css';
import type { Navigation } from './service/data/global';
import { getNavigation } from './service/data/global';

export function links() {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: breakpoints},
    {rel: 'stylesheet', href: kalender}
  ];
}

export const loader: LoaderFunction = () => {
  return getNavigation();
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Ekko',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  const navigation = useLoaderData<Navigation>();
   let location = useLocation();

   var slug = location.pathname.slice(1).split("/")?.[0];
   var fullSlug = location.pathname;


  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossOrigin="anonymous"></script>
        <script src="/jGravity.js"></script>
      </head>
      <body className={slug}>
        <Nav navigation={navigation} slug={slug} fullSlug={fullSlug}/>
        <Menu navigation={navigation} slug={slug} fullSlug={fullSlug}/>
        <main>
          <Outlet />
        </main>
        <Footer navigation={navigation} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
