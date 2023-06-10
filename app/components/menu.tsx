import type { Navigation } from '~/service/data/global';
import Nav from './nav';
import Modal from 'react-modal';
import React from 'react';

export default function Menu({ navigation, slug, fullSlug}: { navigation: Navigation, slug: String, fullSlug:String }) {

	const customStyles = {
		content: {
			top: '0',
			left: '0',
			// right: 'auto',
			// bottom: 'auto',
			width: '100%',
			height: '300px',
			// marginRight: '-50%',
			// transform: 'translate(-50%, -50%)',
			backgroundColor: 'inherit',
			padding: 0,
		},
	};

	const [modalIsOpen, setIsOpen] = React.useState(false);

	const filtered = navigation.nodes?.filter(nav => nav.navHandle == slug);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
		<div className='menu hide-for-desktop'>
			<div className='navbar'>
				{filtered?.[0] ?
          <a href={``} className="homebutton">{filtered[0].navName}</a>
        :
         <div></div>
        }
				<div className='open-menu' onClick={openModal}></div>
			</div>
			<Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					style={customStyles}
			>
				<div className='close-menu' onClick={closeModal}>X</div>
				<div onClick={closeModal}>
					<Nav navigation={navigation} slug={slug} fullSlug={fullSlug}/>
				</div>
			</Modal>
		</div>
  );
}
