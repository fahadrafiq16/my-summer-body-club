import React from 'react';
import { Link } from 'react-router-dom'

const Header = () => {
    const hamburgerClicked = () => {
        const nav = document.getElementById('nav-ul');
        nav.classList.toggle('show'); // Example of toggling a class
    };

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
                        <a
                            href="https://mysummerbodyclub.nl/"
                            className="custom-logo-link"
                            rel="home"
                            aria-current="page"
                        >
                            <img
                                width="246"
                                height="227"
                                src="https://mysummerbodyclub.nl/wp-content/uploads/2023/06/Image20230617095400.png"
                                className="custom-logo"
                                alt="My Summer Body Club"
                                decoding="async"
                            />
                        </a>
                    </div>
                    <button
                        className="hamburger"
                        id="hamburger"
                        onClick={hamburgerClicked}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="contact-area">
                        <div className="email-area">
                            <img
                                src="https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/img-23.png"
                                alt="Email"
                            />
                            <div className="header-content">
                                <h3>Email</h3>
                                <p>info@mysummerbodyclub.nl</p>
                            </div>
                        </div>

                        <div className="email-area">
                            <img
                                src="https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/img-2.png"
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
            <div className="main-menu-area">
                <div className="container">
                    <div className="navigation-area">
                        <nav className="nav-ul" id="nav-ul">
                            <ul id="menu-menu-1">
                                <li className="menu-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/abonnement">Abonnementen</Link>
                                </li>


                            </ul>
                        </nav>
                    </div>
                    <div className="right-icons"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;
