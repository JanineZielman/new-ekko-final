import Container from './container';
import type { Navigation } from '~/service/data/global';

export default function Footer({ navigation }: { navigation: Navigation }) {
  return (
    <footer>
      <Container>
        <div>
          Where to find us
        </div>
        <div className='social-links'>
          <a href={navigation.globalSets[1].socialFacebook} target="_blank">Facebook</a>
          <a href={navigation.globalSets[1].socialInstagram} target="_blank">Instagram</a>
          <a href={navigation.globalSets[1].socialTwitter} target="_blank">Twitter</a>
        </div>
      </Container>
    </footer>
  );
}
