import Container from './container';
import type { Navigation } from '~/service/data/global';

export default function Footer({ navigation }: { navigation: Navigation }) {
  return (
    <footer>
      <Container back={false}>
        <div>
          <a href="#">Meld på nyhetsbrev</a>
        </div>
        <div className='social-links'>
          {navigation.globalSets[1].socialFacebook && <a href={navigation.globalSets[1].socialFacebook} target="_blank">Facebook</a>}
          {navigation.globalSets[1].socialInstagram && <a href={navigation.globalSets[1].socialInstagram} target="_blank">Instagram</a>}
          {navigation.globalSets[1].socialTwitter && <a href={navigation.globalSets[1].socialTwitter} target="_blank">Twitter</a>}
        </div>
      </Container>
    </footer>
  );
}
