import type { Navigation } from '~/service/data/global';
import Nav from './nav';
import Modal from 'react-modal';
import React from 'react';

export default function Menu({ navigation, slug }: { navigation: Navigation, slug: String }) {

	const customStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			width: '100vw',
			height: '100vh',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
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
		<div className='menu hide-for-desktop'>
			<div className='navbar'>
				<a href="/" className="homebutton"></a>
				<div className='open-menu' onClick={openModal}></div>
			</div>
			<Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					style={customStyles}
			>
				<div className='close-menu' onClick={closeModal}>X</div>
				<Nav navigation={navigation} slug={slug}/>
			</Modal>
		</div>
  );
}
