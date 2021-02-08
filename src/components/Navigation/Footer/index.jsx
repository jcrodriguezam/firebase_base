import React from 'react';
import classNames from 'classnames';
import logo from 'assets/logo/sinapsis_gray.svg';
import classes from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className={classNames('level', classes.level)}>
          <div className="level-left">
            <div className="level-item">
              <span className="footer-vendor">© 2020 <span>&nbsp; SINAPSIS by <b>ROAM</b></span></span>
            </div>
          </div>
          <div className={classNames('level-right', classes.levelRight)}>
            <div className="level-item">
              <div className="logo">
                <a href="#">
                  <img
                    src={logo}
                    alt="sinapsis.com"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
