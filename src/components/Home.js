import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import breakpoint from "../Breakpoints.js";

const FadeInFromBelow = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0px);
    }
`;

const FadeInFromLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(-30px);
    }

    to {
        opacity: 1;
        transform: translateX(0px);
    }
`;

const FadeInFromRight = keyframes`
    from {
        opacity: 0;
        transform: translateX(30px);
    }

    to {
        opacity: 1;
        transform: translateX(0px);
    }
`;

const BodyContainer = styled.body`
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const HomeBodyMainSplash = styled.h1`
    @media ${breakpoint.device.xs} {
        font-weight: 300;
        letter-spacing: 0.75px;
        font-size: 48px;
        animation: ${FadeInFromBelow} 1.5s forwards;
    }

    @media ${breakpoint.device.lg} {
        font-weight: 300;
        letter-spacing: 0.75px;
        font-size: 54px;
        margin-left: 25px;
        animation: ${FadeInFromBelow} 1.5s forwards;
    }
`;

const HomeBodyMainSubSplash = styled.p`
    @media ${breakpoint.device.xs} {
        font-weight: 300;
        opacity: 0;
        letter-spacing: 0.75px;
        font-size: 32px;
        animation-delay: 0.5s;
        width: 90vw;
        text-align: center;
        animation: ${FadeInFromBelow} 1.5s forwards;
        animation-delay: 0.5s;
    }

    @media ${breakpoint.device.lg} {
        font-weight: 300;
        opacity: 0;
        letter-spacing: 0.75px;
        font-size: 32px;
        margin-left: 25px;
        animation-delay: 0.5s;
        width: 60vw;
        text-align: center;
        animation: ${FadeInFromBelow} 1.5s forwards;
        animation-delay: 0.5s;
    }
`;

const HomeBodyButtonContainer = styled.div`
    @media ${breakpoint.device.xs} {
        width: 90vw;
        height: 5vh;
        margin-top: 2vh;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        background: transparent;
    }

    @media ${breakpoint.device.lg} {
        width: 20vw;
        height: 5vh;
        margin-top: 2vh;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        background: transparent;
    }
`;

const BtnLeft = styled.button`
    @media ${breakpoint.device.xs} {
        opacity: 0;
        width: 25vw;
        height: 100%;
        font-size: 24px;
        font-weight: 300;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        transition: all 0.5s ease-in-out;
        animation: ${FadeInFromLeft} 1.5s forwards;
        animation-delay: 0.5s;
    
        &:hover {
            cursor: pointer;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 30px;
        }
    }

    @media ${breakpoint.device.lg} {
        opacity: 0;
        width: 7vw;
        height: 100%;
        font-size: 24px;
        font-weight: 300;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        transition: all 0.5s ease-in-out;
        animation: ${FadeInFromLeft} 1.5s forwards;
        animation-delay: 0.5s;
    
        &:hover {
            cursor: pointer;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 30px;
        }
    }
`;

const BtnRight = styled.button`
    @media ${breakpoint.device.xs} {
        opacity: 0;
        width: 25vw;
        height: 100%;
        font-size: 24px;
        font-weight: 300;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        transition: all 0.5s ease-in-out;
        animation: ${FadeInFromRight} 1.5s forwards;
        animation-delay: 0.5s;
    
        &:hover {
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 30px;
        }
    }

    @media ${breakpoint.device.lg} {
        opacity: 0;
        width: 7vw;
        height: 100%;
        font-size: 24px;
        font-weight: 300;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        transition: all 0.5s ease-in-out;
        animation: ${FadeInFromRight} 1.5s forwards;
        animation-delay: 0.5s;
    
        &:hover {
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 30px;
        }
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;

    &:hover{
        border-bottom: 2px solid transparent;
    }
`;

export default function Home(props) {
    return (
        <BodyContainer>
            <HomeBodyMainSplash>Welcome To UniDeadlineManager</HomeBodyMainSplash>
            <HomeBodyMainSubSplash>Our app aims to provide students with the tools necessary to track their assignment deadlines.</HomeBodyMainSubSplash>
            <HomeBodyButtonContainer>
                <BtnLeft><StyledLink to="/login">Login</StyledLink></BtnLeft>
                <BtnRight><StyledLink to="/about">About</StyledLink></BtnRight>
            </HomeBodyButtonContainer>
        </BodyContainer>
  );
};