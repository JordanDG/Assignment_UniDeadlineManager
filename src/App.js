import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
// Routing //
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Styling //
import {LightTheme, DarkTheme, GlobalStyles} from './Themes.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import breakpoint from "./Breakpoints.js";
// Images //
import LogoLight from './assets/LogoLight.png';
import LogoDark from './assets/LogoDark.png';
// Components //
import Home from "./components/Home.js";
import About from "./components/About.js";
import Contact from "./components/Contact.js";
import Login from "./components/Login.js";
import PrivateRoute from "./PrivateRoute.js";
import Dashboard from './components/Dashboard.js'
import ProfileSetup from "./components/ProfileSetup.js";
import { useUserAuth } from './Auth.js';

const NavContainer = styled.nav`
  @media ${breakpoint.device.xs} {
    width: 100vw;
    height: 12.5vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  @media ${breakpoint.device.lg} {
    width: 100vw;
    height: 12.5vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
`;

const Logo = styled.img`
  @media ${breakpoint.device.xs} {
    width: 100px;
    height: 50px;
    margin-left: 25px;
  }

  @media ${breakpoint.device.sm} {
    width: 200px;
    height: 100px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin-left: 50px;
  }

  @media ${breakpoint.device.lg} {
    width: 200px;
    height: 100px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin-left: 50px;
  }
`;

const SiteTitle = styled.h1`
  @media ${breakpoint.device.xs} {
    font-weight: 300;
    font-size: 24px;
    letter-spacing: 0.75px;
    margin-left: 25px;
  }

  @media ${breakpoint.device.sm} {
    font-weight: 300;
    font-size: 54px;
    letter-spacing: 0.75px;
    margin-left: 25px;
  }

  @media ${breakpoint.device.lg} {
    font-weight: 300;
    font-size: 2vw;
    letter-spacing: 0.75px;
    margin-left: 25px;
  }
`;

const NavLinks = styled.ul`
  @media ${breakpoint.device.xs} {
    display: none;
  }

  @media ${breakpoint.device.sm} {
    display: none;
  }

  @media ${breakpoint.device.lg} {
    list-style-type: none;
    width: 60vw;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
  }
`;

const NavLi = styled.li`
  display: inline-block;
  margin-left: 80px;
`;

const NavA = styled.a`
  font-size: 24px;
  text-decoration: none;
`;

const ChangeTheme = styled.button`
  @media ${breakpoint.device.xs} {
    display: none;
  }

  @media ${breakpoint.device.sm} {
    display: none;
    margin-left: 2.5vw;
    height: 5vh;
    background-color: #00ACED;
    cursor: pointer;
    width: 130px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  @media ${breakpoint.device.lg} {
    display: block;
    margin-left: 2.5vw;
    height: 5vh;
    background-color: #00ACED;
    cursor: pointer;
    width: 130px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
`;

const BurgerNav = styled.div`
  @media ${breakpoint.device.xs} {
    display: flex;
    height: 4.5vh;
    background-color: #00ACED;
    margin-left: 20px;
    cursor: pointer;
    width: 60px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border: 2px solid #fff;
    border-radius: 7.5px;
    z-index: 1000;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  @media ${breakpoint.device.sm} {
    display: flex;
    height: 5.5vh;
    background-color: #00ACED;
    margin-left: 260px;
    cursor: pointer;
    width: 80px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border: 2px solid #fff;
    border-radius: 7.5px;
    z-index: 1000;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  @media ${breakpoint.device.lg} {
    display: none;
  }
`;

const OverlayBackground = styled.div`
  @media ${breakpoint.device.xs} {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 50;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  @media ${breakpoint.device.sm} {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 50;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  @media ${breakpoint.device.lg} {
    display: none;
  }
`;

const OverlayDiv = styled.div`
  @media ${breakpoint.device.xs} {
    width: 50vw;
    height: 100vh;
    position: absolute;
    z-index: 100;
    top: 0;
    right: 0;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  @media ${breakpoint.device.sm} {
    width: 30vw;
    height: 100vh;
    position: absolute;
    z-index: 100;
    top: 0;
    right: 0;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  @media ${breakpoint.device.lg} {
    display: none;
  }
`;

const OverlayOptionsContainer = styled.div`
  width: 100%;
  height: 18%;
  margin-top: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
`;

const BurgerNavOption = styled.a`
  font-size: 32px;
  margin-bottom: 5%;
  margin-right: 5%;
`;

const BurgerAccountBtn = styled.button`
  width: 60%;
  margin-left: 20%;
  position: absolute;
  bottom: 5%;
  height: 5%;
  font-size: 24px;
`;

function App() {
  const [theme, setTheme] = useState('dark');
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useUserAuth();

  const themeToggle = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  const handleLogout = async () => {
    try {
        await logout();
    } catch(err) {
        console.log(err.message);
    }
  }

  return (
    <>
    <ThemeProvider theme={theme === 'light' ? LightTheme : DarkTheme}>
      <GlobalStyles />
      <NavContainer>
        <Logo src={theme === 'light' ? LogoDark : LogoLight} alt="Logo" />
        <SiteTitle>UniDeadlineManager</SiteTitle>
        <NavLinks>
          <NavLi><NavA active href="/">Home</NavA></NavLi>
          <NavLi><NavA href="/about">About</NavA></NavLi>
          <NavLi><NavA href="/contact">Contact</NavA></NavLi>
          {user ?
            <NavLi><NavA onClick={handleLogout}>Logout</NavA></NavLi>
          :
          <NavLi><NavA href="/login">Login</NavA></NavLi>
          }
        </NavLinks>
        <ChangeTheme onClick={() => themeToggle()}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</ChangeTheme>
        <BurgerNav onClick={() => setShowMenu(!showMenu)}>
         {showMenu ? <FontAwesomeIcon icon={faXmark} size="3x"/> : <FontAwesomeIcon icon={faBars} size="3x"/>} 
        </BurgerNav>
      </NavContainer>
      {showMenu ?
        <OverlayBackground>
          <OverlayDiv>
            <OverlayOptionsContainer>
              <BurgerNavOption href="/">Home</BurgerNavOption>
              <BurgerNavOption href="/about">About</BurgerNavOption>
              <BurgerNavOption href="/contact">Contact</BurgerNavOption>
              {user ?
              <BurgerNavOption onClick={handleLogout}>Logout</BurgerNavOption>
              :
              <BurgerNavOption href="/login">Login</BurgerNavOption>
              }
            </OverlayOptionsContainer>
            <BurgerAccountBtn onClick={() => themeToggle()}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</BurgerAccountBtn>
          </OverlayDiv>
        </OverlayBackground>
        :
        <></>
      }
      <Router>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route>
            <Route exact path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
          </Route>
          <Route>
            <Route exact path="/setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>}/>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
    </>
  );
}

export default App;
