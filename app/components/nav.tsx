import type { Navigation } from '~/service/data/global';
import { Link } from '@remix-run/react';
import Modal from 'react-modal';
import React from 'react';

export default function Nav({ navigation, slug }: { navigation: Navigation, slug: String }) {
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

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <div className='nav-space'></div>
      <div className="navbar hide-for-mobile">
        <div className='toggle-menu' onClick={openModal}></div>
        <Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
          style={customStyles}
			  >
          <div className='toggle-menu-content'>
            {/* <div className='toggle-menu' onClick={closeModal}></div> */}
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
          <a href={`/${slug}`} className="homebutton">{filtered[0].navName}</a>
        :
          <a href={`/about`} className="homebutton">About</a>
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
