import type { Navigation } from '~/service/data/global';
import { Link } from '@remix-run/react';

export default function Nav({ navigation, slug }: { navigation: Navigation, slug: String }) {
  const filtered = navigation.nodes?.filter(nav => nav.navHandle == slug);
  console.log(filtered)
  console.log(navigation)
  return (
    <>
      <div className='nav-space'></div>
      <div className="navbar hide-for-mobile">
        {filtered?.[0] ?
          <a href={`/${slug}`} className="homebutton">{filtered[0].navName}</a>
        :
          <a href={`/${slug}`} className="homebutton">About</a>
        }
        <div className="nav-items">
          {navigation &&
            filtered.map((item, i) => {
              return (
                item.title && (
                  <a key={`navlink-${i}`} href={item.url}>
                    <span>{item.title}</span>
                  </a>
                )
              );
            })}
        </div>
        <Link className='search-link' to="/search">
          Søk
        </Link>
      </div>
    </>
  );
}
