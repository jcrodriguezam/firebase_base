import React from 'react';
import { useFormatMessage } from 'hooks';
import PageTitle from '../../../components/PageTitle/index';

const Submenu = () => (
  <>
    <PageTitle title={useFormatMessage('Page.Title.Documents')} preTitle={useFormatMessage('Page.Data')}/>
    <section className="section is-main-section">
      {useFormatMessage('Submenu.content')}
    </section>
  </>
);

export default Submenu;
