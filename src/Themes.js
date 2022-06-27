import { createGlobalStyle } from "styled-components";
import BackgroundOverlay from './assets/HomeWallpaper.jpg';
import breakpoint from "./Breakpoints.js";

export const LightTheme = {
    body: "#fafafa",
    bodytint: "#c8c8c8",
    fontColor: "#292929",
    underlineColor: '2px solid #292929',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${BackgroundOverlay})`
};

export const DarkTheme = {
  body: "#292929",
  bodytint: "#1d1d1d",
  fontColor: "#fafafa",
  underlineColor: '2px solid #fafafa',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${BackgroundOverlay})`
};

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        overflow: hidden;
        padding: 0;
        // outline: 1px solid green !important;
        transition: all 0.25s ease-in-out;
    }

    nav {
        background-color: ${(props) => props.theme.body};
        color: ${(props) => props.theme.fontColor};
    }

    a {
        color: ${(props) => props.theme.fontColor};
        font-weight: 500;
        border-bottom: 2px solid transparent;
        cursor: pointer;

        &:hover {
            border-bottom: ${(props) => props.theme.underlineColor};
        }
    }

    p {
        color: ${(props) => props.theme.fontColor};
        text-align: center;
    }

    h1 {
        color: ${(props) => props.theme.fontColor};
        text-align: center;
    }

    h2 {
        color: ${(props) => props.theme.fontColor};
        text-align: center;
        font-size: 32px;

        &:hover {
            border-bottom: ${(props) => props.theme.underlineColor};
        }
    }

    h3 {
        color: ${(props) => props.theme.fontColor};
        font-size: 18px;
    }

    h4 {
        border-bottom: 2px solid transparent;
        color: ${(props) => props.theme.fontColor};

        &:hover {
            border-bottom: ${(props) => props.theme.underlineColor};
            cursor: pointer;
        }
    }

    button {
        color: ${(props) => props.theme.fontColor};
        border: ${(props) => props.theme.underlineColor};
        background-color: #00ACED;
        border-radius: 10px;
        font-size: 16px;
        cursor: pointer;

        &:hover {
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 30px;
        }
    }

    body {
        background-color: ${(props) => props.theme.body};
        text-rendering: optimize-legibility;
        font-family: 'Lato', sans-serif;
        background-image: ${(props) => props.theme.backgroundImage};
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        @media ${breakpoint.device.xs} {
            width: 100vw;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
          }
    }
    
    label {
        color: ${(props) => props.theme.fontColor};
        font-weight: 300;
        font-size: 16px;
        width: 100%;
        margin-bottom: 5px;
    }

    input {
        color: ${(props) => props.theme.fontColor};
        background-color: ${(props) => props.theme.body};
        border: ${(props) => props.theme.underlineColor};
        border-radius: 5px;
        outline: 0;
        transition: all 0.5s ease-in-out;

        &::placeholder {
            color: ${(props) => props.theme.fontColor};
        }

        &:focus {
            background-color: ${(props) => props.theme.bodytint};
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }
    }

    textarea {
        &:focus {
            background-color: ${(props) => props.theme.bodytint};
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        }
    }

    textarea {
        color: ${(props) => props.theme.fontColor};
        background-color: ${(props) => props.theme.body};
        border: ${(props) => props.theme.underlineColor};
        border-radius: 5px;
        outline: 0;

        &::placeholder {
            color: ${(props) => props.theme.fontColor};
        }
    }

    div {
        background-color: ${(props) => props.theme.body};
    }

    FontAwesomeIcon {
        color: ${(props) => props.theme.fontColor};
    }
`;