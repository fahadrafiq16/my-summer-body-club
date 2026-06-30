import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Logo from '../../images/logo.png'
import EmailIcon from '../../images/email.png'
import PhoneIcon from '../../images/mobile-phone.png'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <header id="global-header">
            {/* Top Menu Bar */}
            <div className="top-menu-bar">
                <div className="container site-inner">
                    <div className="icon-list">
                        <i className="fas fa-map-marker-alt"></i>
                        <p>Locatie: volgt</p>
                    </div>
                    <div className="icon-list">
                        <i className="far fa-clock"></i>
                        <p>Maandag - Vrijdag: 10:00 - 22:00</p>
                    </div>
                </div>
            </div>

            {/* Middle Area */}
            <div className="middle-area">
                <div className="container">
                    <div className="logo-area">
                        <Link
                            to="/"
                            className="custom-logo-link"
                            rel="home"
                            aria-current="page"
                        >
                            <img
                                width="246"
                                height="227"
                                src={Logo}
                                className="custom-logo"
                                alt="My Summer Body Club"
                            
                            />
                        </Link>
                    </div>
                    <button
                        type="button"
                        className={`hamburger ${isMenuOpen ? 'hamburger--active' : ''}`}
                        id="hamburger"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-controls="nav-ul"
                        aria-label={isMenuOpen ? 'Menu sluiten' : 'Menu openen'}
                    >
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </button>
                    <div className="contact-area">
                        <div className="email-area">
                            <img
                                src={EmailIcon}
                                alt="Email"
                            />
                            <div className="header-content">
                                <h3>Email</h3>
                                <Link to="/contact" className="header-email-link">info@mysummerbodyclub.nl</Link>
                            </div>
                        </div>

                        <div className="email-area">
                            <img
                                src={PhoneIcon}
                                alt="Mobile"
                            />
                            <div className="header-content">
                                <h3>Mobile Nummer</h3>
                                <p>(+31) 6 27 28 28 56</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Menu Area */}
            <div className={`main-menu-area ${isMenuOpen ? 'main-menu-area--open' : ''}`}>
                <div className="container main-menu-area__container">
                    <div className="navigation-area">
                        <nav
                            className={`nav-ul ${isMenuOpen ? 'nav-ul--open' : ''}`}
                            id="nav-ul"
                        >
                            <ul id="menu-menu-1">
                                <li className="menu-item">
                                    <Link to="/" onClick={closeMenu}>Home</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/over-msbc" onClick={closeMenu}>Over MSBC</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/abonnement" onClick={closeMenu}>Abonnementen</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/bootcamp" onClick={closeMenu}>Bootcamp</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/pt-ruimte-huren" onClick={closeMenu}>PT Ruimte Huren</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/testimonial-uploader" onClick={closeMenu}>Plaats Review</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/fotos" onClick={closeMenu}>Gallery</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/contact" onClick={closeMenu}>Contact</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="right-icons"></div>
                </div>
                {isMenuOpen && (
                    <button
                        type="button"
                        className="mobile-nav-backdrop"
                        aria-label="Menu sluiten"
                        onClick={closeMenu}
                    />
                )}
            </div>
        </header>
    );
};

export default Header;
