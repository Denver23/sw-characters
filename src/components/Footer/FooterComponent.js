import React from 'react';
import s from './FooterComponent.module.scss'

const Footer = () => {
    return <div className={s.footerWrapper}>
        <div className={s.footerData}>
            Made by <a href={'https://github.com/Denver23'} target={'_blank'} rel="noreferrer">Denis Dunaievskiy</a>
        </div>
    </div>
};

export default Footer;
