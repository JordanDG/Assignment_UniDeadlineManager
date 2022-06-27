import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import breakpoint from "../Breakpoints.js";
import { useUserAuth } from '../Auth.js';
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

const BodyContainer = styled.body`
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const LoginContainer = styled.div`
    @media ${breakpoint.device.xs} {
        width: 60vw;
        height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        border-radius: 10px;
        background: transparent;
        animation: ${FadeInFromBelow} 1.5s forwards;
    }

    @media ${breakpoint.device.sm} {
        width: 40vw;
        height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        border-radius: 10px;
        background: transparent;
    }

    @media ${breakpoint.device.lg} {
        width: 20vw;
        height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        border-radius: 10px;
        background: transparent;
    }
`;

const ActiveTitle = styled.h2`
    font-weight: 300;
    border-bottom: 2px solid transparent;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
`;

const LoginTabToggleContainer = styled.div`
    width: 100%;
    height: 10vh;
    background: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const TabToggle = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 30px;
    transition: all 0.5s ease-in-out;

    &:hover {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }
`;

const TabToggleInactive = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 30px;
    transition: all 0.5s ease-in-out;
    box-shadow: inset 0 0 10px #000000;

`;

const LoginContentContainer = styled.div`
    width: 100%;
    height: 85%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

const LoginTitle = styled.h1`
    font-weight: 500;
    margin-top: 30px;
`;

const LoginForm = styled.form`
    width: 100%;
    height: 80%;
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const LoginLabel = styled.label`
    margin-left: 100px;
`;

const LoginInput = styled.input`
    width: 80%;
    height: 10%;
    margin-bottom: 25px;
    font-size: 24px;
    padding-left: 10px;
`;

const LoginSubmit = styled.button`
    width: 80%;
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

const ReturnHome = styled.a`
    &:hover {
        border-bottom: 2px solid transparent;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    margin-top: 25px;
    font-size: 18px;
`;

const ForgotPasswordText = styled.label`
    margin-left: 100px;
    margin-top: -20px;
    font-weight: 500;

    &:hover {
        cursor: pointer;
    }
`;

export default function Login(props, { history }) {
    // State //
    const [activeTab, setactiveTab] = useState("login");
    const [loadState, setLoadState] = useState(false);
    const [error, setError] = useState('');
    const { signup, login, forgotPassword } = useUserAuth();
    // Signup
    const signupEmail = useRef();
    const signupPassword = useRef();
    const signupPasswordConfirm = useRef();
    // Login //
    const loginEmail = useRef();
    const loginPassword = useRef();
    // Navigate //
    const navigate = useNavigate();
    // Email //
    // const [accEmail, setAccEmails] = useState([]);

    // // useEffect(() => {
    // //     const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
    // //         setAccEmails(snapshot.docs.map(doc => doc.data()));
    // //     });
    // //     return unsub;
    // // }, []);

    const handleNewUser = async () => {
        const CollectionReference = collection(db, "users");
        const Payload = { Name: "", Year: "", University: "", Email: signupEmail.current.value}
        await addDoc(CollectionReference, Payload);
        navigate('/setup');
        setLoadState(false);
    }

    async function forgotPasswordHandler(e) {
        e.preventDefault();
        setError('');
        if(loginEmail.current.value === "") {
            alert("Please input the email of the account you wish to reset the password for!");
        } else {
            try {
                setLoadState(true);
                await forgotPassword(loginEmail.current.value);
                loginEmail.current.value = "";
                alert("Password reset email has been sent.");
            } catch (err) {
                setError(err.message);
            }
            setLoadState(false);
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        setError('');

        if(signupPassword.current.value !== signupPasswordConfirm.current.value) {
            alert("Passwords do not match - Please correct this and try again!");
        } else {
            try {
                setLoadState(true);
                await signup(signupEmail.current.value, signupPassword.current.value);
                handleNewUser();
            } catch (err) {
                setError(err.message);
            };
            setLoadState(false);
        };
    };

    async function handleLogin(e) {
        e.preventDefault();
        setError('');

        try {
            setLoadState(true);
            await login(loginEmail.current.value, loginPassword.current.value);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        };
        setLoadState(false);
    }

    const HandleToggle = () => {
        setError('');
        if(activeTab === 'login') {
            setactiveTab('signup');
        } else if(activeTab === 'signup') {
            setactiveTab('login');
        };
    };

    return (
        <BodyContainer>
            <LoginContainer>
                <LoginTabToggleContainer>
                    {activeTab === 'login' ?
                    <TabToggle>
                        <ActiveTitle>Login</ActiveTitle>
                    </TabToggle>
                    :
                    <TabToggleInactive>
                        <ActiveTitle darkMode onClick={HandleToggle}>Login</ActiveTitle>
                    </TabToggleInactive>
                    }

                    {activeTab === 'signup' ?
                    <TabToggle>
                        <ActiveTitle>Signup</ActiveTitle>
                    </TabToggle>
                    :
                    <TabToggleInactive>
                        <ActiveTitle darkMode onClick={HandleToggle}>Signup</ActiveTitle>
                    </TabToggleInactive>
                    }
                </LoginTabToggleContainer>
                {activeTab === 'login' ? 
                    <LoginContentContainer>
                        <LoginTitle>Login</LoginTitle>
                        <LoginForm onSubmit={handleLogin}>
                            <LoginLabel>Email:</LoginLabel>
                            <LoginInput ref={loginEmail} type="email" placeholder="Email" required></LoginInput>
                            <LoginLabel>Password:</LoginLabel>
                            <LoginInput ref={loginPassword} type="password" placeholder='Password' required></LoginInput>
                            <ForgotPasswordText onClick={forgotPasswordHandler}>Forgot password</ForgotPasswordText>
                            <LoginSubmit disabled={loadState}>{loadState ? 'Loading...' : 'Login'}</LoginSubmit>
                            <ErrorMessage>{error}</ErrorMessage>
                        </LoginForm>
                        <ReturnHome><Link to="/">Return to homepage</Link></ReturnHome>
                    </LoginContentContainer>
                    :
                    <LoginContentContainer>
                        <LoginTitle>Signup</LoginTitle>
                        <LoginForm onSubmit={handleSignup}>
                            <LoginLabel>Email:</LoginLabel>
                            <LoginInput ref={signupEmail} type="email" placeholder="Email" required></LoginInput>
                            <LoginLabel>Password:</LoginLabel>
                            <LoginInput ref={signupPassword} type="password" placeholder='Password' required></LoginInput>
                            <LoginLabel>Password Confirm:</LoginLabel>
                            <LoginInput ref={signupPasswordConfirm} type="password" placeholder='Confirm Password' required></LoginInput>
                            <LoginSubmit type="submit" disabled={loadState}>{loadState ? 'Loading...' : 'Signup'}</LoginSubmit>
                            <ErrorMessage>{error}</ErrorMessage>
                        </LoginForm>
                        <ReturnHome><Link to="/">Return to homepage</Link></ReturnHome>
                    </LoginContentContainer>
                }
            </LoginContainer>
        </BodyContainer>
    );
};