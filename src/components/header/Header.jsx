import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import Logo from '../../images/logo.png'
import EmailIcon from '../../images/email.png'
import PhoneIcon from '../../images/mobile-phone.png'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const hamburgerClicked = () => {
      const nav = document.getElementById('nav-ul');
      nav.classList.toggle('show'); // Example of toggling a class
      setIsMenuOpen((prevState) => !prevState); // Toggle the state
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
                    <button className="hamburger" id="hamburger" onClick={hamburgerClicked}>
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                    <div className="contact-area">
                        <div className="email-area">
                            <img
                                src={EmailIcon}
                                alt="Email"
                            />
                            <div className="header-content">
                                <h3>Email</h3>
                                <p>info@mysummerbodyclub.nl</p>
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
            <div className="main-menu-area">
                <div className="container">
                    <div className="navigation-area">
                        <nav className="nav-ul" id="nav-ul">
                            <ul id="menu-menu-1">
                                <li className="menu-item">
                                    <Link to="/">Home</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/over-msbc">Over MSBC</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/abonnement">Abonnementen</Link>
                                </li>
                                

                                <li className="menu-item">
                                    <Link to="/bootcamp">Bootcamp</Link>
                                </li>

                                <li className="menu-item">
                                    <Link to="/pt-ruimte-huren">PT Ruimte Huren</Link>
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
