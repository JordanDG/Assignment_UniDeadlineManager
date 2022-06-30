import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useUserAuth } from '../Auth.js';
import { db } from '../firebase.js';
import { collection, onSnapshot, query, setDoc, where, doc } from 'firebase/firestore';
import breakpoint from "../Breakpoints.js";

const BodyContainer = styled.body`
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

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

const NewUserInfo = styled.div`
    height: 55vh;
    margin-top: 5vh;
    width: 30vw;
    opacity: 0;
    animation: ${FadeInFromBelow} 1.5s forwards;
    animation-delay: 1s;
    background: transparent;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

const NewInput = styled.input`
    width: 40%;
    height: 7%;
    margin-bottom: 25px;
    font-size: 24px;
    padding-left: 10px;
`;

const NewLabel = styled.label`
    margin-left: 460px;
`;

const SubmitNewUserInfo = styled.button`
    width: 40%;
    height: 10%;
    margin-top: 10px;
    font-size: 24px;
    font-weight: 300;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    transition: all 0.5s ease-in-out;

    &:hover {
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 30px;
    }
`;

export default function ProfileSetup(props) {
    // UseRefs //
    const NewUserName = useRef();
    const NewUserUniversity = useRef();
    const NewUserYear = useRef();
    const { user } = useUserAuth();
    const [UserInfo, setUserInfo] = useState([]);
    const [loadState, setLoadState] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoadState(true);
        const CollectionReference = collection(db, "users");
        const UserQuery = query(CollectionReference, where("Email", "==", user.email));
        onSnapshot(UserQuery, (snapshot) => {
            let UserInfoArray = []
            snapshot.docs.forEach((doc) => {
                UserInfoArray.push({ ...doc.data(), id: doc.id });
            });
            setUserInfo(UserInfoArray);
        });
        setLoadState(false);
    }, [user.email, UserInfo]);

    const handleUserInfo = async () => {
        setLoadState(true);
        const UserNameInitial = UserInfo[0];
        const EditID = UserNameInitial.id;
        const docRef = doc(db, "users", EditID);
        const payload = {Email: user.email, Name: NewUserName.current.value, University: NewUserUniversity.current.value, Year: NewUserYear.current.value};
        await setDoc(docRef, payload);
        navigate('/dashboard');
        setLoadState(false);
    }

    return (
        <BodyContainer>
            <HomeBodyMainSplash>Welcome to UniDeadlineManager</HomeBodyMainSplash>
            <HomeBodyMainSubSplash>Just a few more things before we get started!</HomeBodyMainSubSplash>
            <NewUserInfo>
                <NewLabel>User Name:</NewLabel>
                <NewInput ref={NewUserName} type="text" placeholder="What do we call you?" required></NewInput>
                <NewLabel>University:</NewLabel>
                <NewInput ref={NewUserUniversity} type="text" placeholder="Where do you study?" required></NewInput>
                <NewLabel>Year of study:</NewLabel>
                <NewInput ref={NewUserYear} type="number" placeholder="What year are you in?" min="1" required></NewInput>
                <SubmitNewUserInfo type="submit" onClick={handleUserInfo} disabled={loadState}>Start</SubmitNewUserInfo>
            </NewUserInfo>
        </BodyContainer>
    );
};
