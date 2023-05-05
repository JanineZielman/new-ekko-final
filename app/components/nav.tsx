import type { Navigation } from '~/service/data/global';
import { Link } from '@remix-run/react';
import Modal from 'react-modal';
import React, {useEffect} from 'react';

export default function Nav({ navigation, slug, fullSlug }: { navigation: Navigation, slug: String, fullSlug: String }) {
  const filtered = navigation.nodes?.filter(nav => nav.navHandle == slug);

  const toggle = navigation.nodes?.filter(nav => nav.navHandle == 'toggle');

  const customStyles = {
		content: {
			top: '50px',
			left: '0',
			right: 'auto',
			bottom: 'auto',
			width: 'auto',
			height: 'auto',
      padding: '0',
      border: 'none',
      backgroundColor: 'inherit',
		},
	};

  console.log(toggle)

  useEffect(() => {
    var navItems = document.getElementById("nav-items");
    var btns = navItems?.getElementsByClassName("nav-link");
    if (btns) {
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function(e) {
          
          var allActive = document.getElementsByClassName("active");
          for (var i = 0; i < allActive.length; ++i) {
            allActive[i].classList.remove('active') 
          }
          e.target.classList.add('active');
        });
      }
    }
  })

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <div className='toggle-menu hide-for-desktop' onClick={openModal}></div>
      <div className="navbar hide-for-mobile">
        <div className='toggle-menu hide-for-mobile' onClick={openModal}></div>
        <Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
          style={customStyles}
			  >
          <div className='toggle-menu-content'>
            <div className='links'>
              {toggle.map((item, i) => {
                return(
                  <a href={`${item.url}`}>{item.title}</a>
                )
              })}
            </div>
          </div>
        </Modal>
        {filtered?.[0] ?
          <a href={``} className="homebutton">{filtered[0].navName}</a>
        :
          <a href={`/`} className="homebutton">{navigation.nodes[0].title}</a>
        }
        <div className="nav-items" id="nav-items">
          {navigation &&
            filtered.map((item, i) => {
   
              return (
                item.title && (
                  <>
                    {item.navHandle == 'festival' ?
                      <a key={`navlink-${i}`} href={`${toggle[2].url}${item.url}`} id={`${item.title.toLowerCase()}-nav`} className='nav-link'>
                        <span>{item.title}</span>
                      </a>
                    :
                      <a key={`navlink-${i}`} href={`/${item.navHandle}${item.url}`} id={`${item.title.toLowerCase()}-nav`} className='nav-link'>
                        <span>{item.title}</span>
                      </a>
                    }
                  </>
                )
              );
            })}
        </div>
         {filtered?.[0] ?
          <Link className='search-link' to={`/${filtered[0].navHandle}/search`}>
            Søk
          </Link>
        :
          <Link className='search-link' to="/search">
            Søk
          </Link>
        }
        
      </div>
    </>
  );
}
