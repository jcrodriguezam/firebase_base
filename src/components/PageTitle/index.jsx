import React from 'react';

const PageTitle = ({title, preTitle}) => (
    <section className="hero is-hero-bar">
        <div className="hero-body">
        <h3 className="preTitle">{preTitle}</h3>
        <h1 className="title">{title}</h1>
        </div>
    </section>
);
  
export default PageTitle;