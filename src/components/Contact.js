import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import breakpoint from "../Breakpoints.js";
import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';

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
        animation: ${FadeInFromLeft} 1.5s forwards;
    }

    @media ${breakpoint.device.lg} {
        font-weight: 300;
        letter-spacing: 0.75px;
        font-size: 54px;
        margin-left: 25px;
        animation: ${FadeInFromLeft} 1.5s forwards;
    }
`;

const HomeBodyMainSubSplash = styled.p`
    @media ${breakpoint.device.xs} {
        font-weight: 300;
        letter-spacing: 0.75px;
        font-size: 32px;
        width: 90vw;
        text-align: center;
        animation: ${FadeInFromRight} 1.5s forwards;
    }

    @media ${breakpoint.device.lg} {
        font-weight: 300;
        letter-spacing: 0.75px;
        font-size: 32px;
        margin-left: 25px;
        width: 60vw;
        text-align: center;
        animation: ${FadeInFromRight} 1.5s forwards;
    }
`;

const ContactFormContainer = styled.div`
    width: 100vw;
    height: 50vh;
    display: flex;
    margin-top: 5vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    animation: ${FadeInFromBelow} 1.5s forwards;
`;

const ContactForm = styled.form`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const ContactLabel = styled.label`

`;

const ContactInput = styled.input`
    width: 300px;
    height: 5%;
    padding: 10px;
    font-size: 20px;
    margin-bottom: 10px;
`;

const ContactInputTextArea = styled.textarea`
    width: 92%;
    padding: 10px;
    font-size: 20px;
    resize: none;
`;

const ContactSubmitBtn = styled.button`
    width: 100%;
    height: 10%;
    margin-top: 40px;
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

export default function Home(props) {
    const NameRef = useRef();
    const EmailRef = useRef();
    const SubjectRef = useRef();
    const MessageRef = useRef();
    const [loadState, setLoadState] = useState(false);

    async function handleContact(e) {
        e.preventDefault();
        setLoadState(true);
        const CollectionReference = collection(db, "ContactForms");
        const Payload = { email: EmailRef.current.value, message: MessageRef.current.value, name: NameRef.current.value, subject: SubjectRef.current.value}
        await addDoc(CollectionReference, Payload);
        setLoadState(false);
        NameRef.current.value = "";
        EmailRef.current.value = "";
        SubjectRef.current.value = "";
        MessageRef.current.value = "";
        alert("Contact form successful - We'll get back to you as soon as possible!");
    }

    return (
        <BodyContainer>
            <HomeBodyMainSplash>Contact Us</HomeBodyMainSplash>
            <HomeBodyMainSubSplash>We're always looking for ways to improve - good, bad, no matter the subject, contact us here!</HomeBodyMainSubSplash>
            <ContactFormContainer>
                <ContactForm onSubmit={handleContact}>
                    <ContactLabel>Name:</ContactLabel>
                    <ContactInput placeholder="Name" required ref={NameRef}></ContactInput>
                    <ContactLabel>Email:</ContactLabel>
                    <ContactInput placeholder="Email" required ref={EmailRef}></ContactInput>
                    <ContactLabel>Subject:</ContactLabel>
                    <ContactInput placeholder="Subject" ref={SubjectRef}></ContactInput>
                    <ContactLabel>Message:</ContactLabel>
                    <ContactInputTextArea placeholder="message" required ref={MessageRef}></ContactInputTextArea>
                    <ContactSubmitBtn type="submit" disabled={loadState}>{loadState ? 'Loading...' : 'Send!'}</ContactSubmitBtn>
                </ContactForm>
            </ContactFormContainer>
        </BodyContainer>
    );
};