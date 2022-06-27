import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useUserAuth } from '../Auth.js';
import { db } from '../firebase.js';
import breakpoint from "../Breakpoints.js";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
// Components //
import Calendar from './Calendar.js';
import QuickLinks from './QuickLinks.js';

const BodyContainer = styled.body`
@media ${breakpoint.device.xs} {
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}
@media ${breakpoint.device.sm} {
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}
@media ${breakpoint.device.lg} {
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
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

const WelcomeText = styled.h1` 
@media ${breakpoint.device.xs} {
    text-align: center;
    font-weight: 500;
    font-size: 64px;
    opacity: 0;
    padding: 20px 20px;
    width: 100%;
    letter-spacing: 0.25px;
    word-spacing: 5px;
    margin-left: 15px;
    animation: ${FadeInFromLeft} 1.5s forwards;
    animation-delay: 0.5s;
}

@media ${breakpoint.device.sm} {
    text-align: center;
    font-weight: 500;
    font-size: 64px;
    opacity: 0;
    padding: 20px 20px;
    width: 100%;
    letter-spacing: 0.25px;
    word-spacing: 5px;
    margin-left: 15px;
    animation: ${FadeInFromLeft} 1.5s forwards;
    animation-delay: 0.5s;
}

@media ${breakpoint.device.lg} {
    font-weight: 500;
    font-size: 64px;
    opacity: 0;
    padding: 20px 20px;
    width: 100%;
    letter-spacing: 0.25px;
    word-spacing: 5px;
    text-align: left;
    margin-left: 15px;
    animation: ${FadeInFromLeft} 1.5s forwards;
    animation-delay: 0.5s;
}
`;

const WelcomeContainer = styled.div`
@media ${breakpoint.device.xs} {
    background: transparent;
    width: 100%;
    display: flex;
    height: 250px;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
}
@media ${breakpoint.device.sm} {
    background: transparent;
    width: 100%;
    display: flex;
    height: 250px;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
}
@media ${breakpoint.device.lg} {
    background: transparent;
    width: 100%;
    display: flex;
    height: auto;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
}
`;

const ContainerLeft = styled.div`
@media ${breakpoint.device.xs} {
    width: 90vw;
    margin-left: 5vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 160vh;
}

@media ${breakpoint.device.sm} {
    width: 90vw;
    margin-left: 5vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 160vh;
}

@media ${breakpoint.device.lg} {
    width: 40vw;
    display: flex;
    flex-direction: column;
    margin-left: 0vw;
    align-items: center;
    justify-content: flex-start;
    height: 80vh;
}
`;

export default function Dashboard(props) {
    const { user } = useUserAuth();
    const [loadState, setLoadState] = useState(false);
    const [UserInfo, setUserInfo] = useState([]);
    
    const CollectionReference = collection(db, "users");
    const UserQuery = query(CollectionReference, where("Email", "==", user.email));
    onSnapshot(UserQuery, (snapshot) => {
        let UserInfoArray = []
        snapshot.docs.forEach((doc) => {
            UserInfoArray.push({ ...doc.data(), id: doc.id });
        });
        setUserInfo(UserInfoArray);
        setLoadState(true);
    });

    const UserNameInitial = UserInfo[0];
    
    return (
    <BodyContainer>
            {loadState &&
            <WelcomeContainer>
                <WelcomeText>Welcome back {UserNameInitial.Name}</WelcomeText>
            </WelcomeContainer>
            }
            <ContainerLeft>
                <Calendar />
                <QuickLinks />
            </ContainerLeft>
    </BodyContainer>
    );
};