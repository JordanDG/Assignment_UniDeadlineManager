import React from 'react';
import styled, { keyframes } from 'styled-components';

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

const BodyContainer = styled.body`
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const HomeBodyMainSplash = styled.h1`
    animation: ${FadeInFromBelow} 1.5s forwards;
    font-weight: 300;
    letter-spacing: 0.75px;
    font-size: 54px;
    margin-left: 25px;
`;

const HomeBodyMainSubSplash = styled.p`
    opacity: 0;
    font-weight: 300;
    letter-spacing: 0.75px;
    font-size: 32px;
    margin-left: 25px;
    animation-delay: 0.5s;
    width: 60vw;
    text-align: center;
    animation: ${FadeInFromBelow} 1.5s forwards;
    animation-delay: 0.5s;
`;

export default function About(props) {
    return (
    <BodyContainer>
        <HomeBodyMainSplash>About UniDeadlineManager</HomeBodyMainSplash>
        <HomeBodyMainSubSplash>With the use of our application, you are able to track your submission deadlines on our interactive calendar. You can also make pages to make notes in for each of your teaching units, allowing you to keep notes in a secure location.</HomeBodyMainSubSplash>
    </BodyContainer>
  );
};