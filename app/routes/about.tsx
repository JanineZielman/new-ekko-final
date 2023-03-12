import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Container from '~/components/container';
import Spacer from '~/components/spacer';
import { fetchContentPage } from '~/service/data/contentPage';
import type { PageEntry } from '~/service/data/contentPage';
import Collapsible from '~/components/collapsible';

export const loader: LoaderFunction = () => {
  return fetchContentPage('about');
};

export const meta: MetaFunction = ({ data }) => ({
  title: (data as PageEntry).entry?.title,
});

export default function About() {
  const { entry } = useLoaderData<PageEntry>();

  return (
    <Container>
      <div className="grid">
        <Spacer number={60} border=""/>
      </div>
      <Collapsible trigger={`EKKO`} open={false}>
        Ekko presenterer konserter og klubb gjennom hele året og en festival hver høst. Vi arbeider for og med eksperimentell elektronisk musikk. I 2022 arrangerer vi Ekko festival nr. 19. 

        Ekko har siden 2003 gjestet over 700 ulike artister fra hele verden. Her er noen navn som har spilt på festivalen: Nils Frahm, Jon Hopkins, James Holden, Holly Herndon, Planningtorock, Pantha Du Prince & The Bell Laboratory, Laurel Halo, Andrew Weatherall, DJ Harvey, Todd Terje (bestillingsverk), rRoxymore, Mykki Blanco, Suzanne Ciani, Matias Aguayo, El Perro Del Mar, Optimo DJs, C.A.R., Jenny Hval, Ata Kak, Aïsha Devi, Molly Nilsson, Stiletti-Ana, Caterina Barbieri mfl.
      </Collapsible>
      <div className="grid">
        <Spacer number={12} border=""/>
      </div>
    </Container>
  );
}
