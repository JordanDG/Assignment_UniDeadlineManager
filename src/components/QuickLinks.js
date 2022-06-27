import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserAuth } from '../Auth.js';
import { db } from '../firebase.js';
import breakpoint from "../Breakpoints.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { collection, onSnapshot, query, where, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';

const QuickLinksContainer = styled.div`
@media ${breakpoint.device.xs} {
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
}

@media ${breakpoint.device.sm} {
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
}

@media ${breakpoint.device.lg} {
    height: 87.5vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
}
`;

const QuickLinksHeader = styled.h1`
    margin-left: 35px;
    margin-bottom: 10px;
`;

const QuickLinksUnits = styled.button`
    margin-left: 35px;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 50px;
`;

const AddUnitContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    z-index: 100;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const AddNewContainer = styled.div`
    width: 30vw;
    height: 40vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const AddNewForm = styled.form`
    width: 100%;
    height: 80%;
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const LoginLabel = styled.label`
    margin-left: 150px;
`;

const LoginInput = styled.input`
    width: 80%;
    height: 20%;
    margin-bottom: 25px;
    font-size: 24px;
    padding-left: 10px;
    overflow-y: scroll;
    resize: none;
`;

const LoginSubmit = styled.button`
    width: 80%;
    height: 20%;
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

const CloseMessage = styled.h4`
    margin-top: 20px;
`;

const AddNewHeader = styled.h1`

`;

const UnitNotes = styled.div`
@media ${breakpoint.device.xs} {
    height: 85vh;
    width: 58.5vw;
    width: 90vw;
    margin-left: 0vw;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

@media ${breakpoint.device.sm} {
    height: 85vh;
    width: 58.5vw;
    width: 90vw;
    margin-left: 0vw;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

@media ${breakpoint.device.lg} {
    height: 85vh;
    width: 58.5vw;
    position: absolute;
    top: 15vh;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}
`;

const UnitTitle = styled.h1`
    margin-bottom: 10px;
    margin-top: 10px;
`;

const InactiveUnit = styled.h1`
    margin-top: 10px;
`;

const InactiveSplash = styled.p`
    margin-top: 10px;
    font-size: 18px;
`;

const UnitNoteContainer = styled.div`
    width: 100%;
    height: 55vh;
    overflow-y: scroll;
    box-shadow: inset 0 0 10px #000000;
`;

const ListEntry = styled.div`
    width: 50%;
    background-color: #00ACED;
    min-height: 100px;
    margin: 10px;
    border-radius: 5px;

    &:hover {
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 30px;
    }
`;

const NoteContent = styled.p`
    font-size: 18px;
    width: 80%;
    text-align: left;
    margin-left: 20px;
    margin-top: 10px;
`;

const NoteDeleteBtn = styled.button`
    width: 10%;
    height: 100%;
    background: transparent;
    border: transparent;
`;

const DeleteSubtext = styled.p`
    margin-top: 10px;
`;

const AccountSettings = styled.div`
    width: 40vw;
    height: 5vh;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    position: absolute;
    bottom: 0;
`;

const AccountSettingsHeader = styled.h1`
    margin-left: 35px;
`;

const AccountBtn = styled.button`
    margin-left: 20px;
    width: 100px;
    border-radius: 5px;
    height: 50%;
`;

const LogoutBtn = styled.button`
    margin-left: 20px;
    width: 100px;
    border-radius: 5px;
    height: 50%;
`;

const ReminderBtn = styled.button`
    margin-left: 20px;
    width: 200px;
    border-radius: 5px;
    height: 50%;
`;

const ChangeNoteContainer = styled.div`
    width: 100%;
    height: 25vh;
`;

const NoteSubmitForm = styled.form`
    width: 100%;
    height: 25vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const NoteLabel = styled.label`
    margin-left: 300px;
`;

const NoteInput = styled.textarea`
    width: 80%;
    height: 20%;
    margin-bottom: 25px;
    font-size: 24px;
    padding-left: 10px;
    padding-top: 10px;
    resize: none;
`;

const NoteTitle = styled.h1`
    margin-top: 10px;
    text-align: center;
    width: 100%;
`;

const NoteCheckbox = styled.input`
    margin-left: -1020px;
    margin-top: -20px;
`;

const NoteSubmit = styled.button`
    width: 10%;
    height: 50px;
    margin-top: 10px;
`;

const FooterImportantAndDate = styled.div`
    height: 30px;
    margin-left: 20px;
    background: #00ACED;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
`;

const ListMain = styled.div`
    width: 100%;
    background: #00ACED;
    min-height: 80px;
    display: flex;
    flex-direction: row;
    align-items center;
    justify-content: flex-start;
`;

const FooterTextImportant = styled.p`
    margin-top: 5px;
    font-weight: 700;
    color: red;
`;

const FooterText = styled.p`
    margin-top: 5px;
    font-weight: 700;
`;

const ReminderHistoryContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ReminderHistoryMain = styled.div`
    width: 50vw;
    height: 80vh;
    box-shadow: inset 0 0 10px #000000;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const ReminderTitle = styled.h1`
    font-size: 32px;
    margin-top: 20px;
    width: 100%;
`;

const ReminderHistoryPost = styled.div`
    width: 100%;
    height: 100px;
    margin-left: 20px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`;

const ReminderText = styled.p`
    font-size: 28px;
`;

const ReminderInfo = styled.p`
    font-weight: 700;
`;

const AccountOverlayContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const AccountDetailContainer = styled.div`
    width: 30vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const AccountProfilePictureContainer = styled.div`
    width: 100%;
    background: transparent;
    height: 20vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
`;


const AccountDetailContainerMain = styled.form`
    width: 100%;
    height: 60vh;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const AccountLabel = styled.label`
    margin-left: 300px;
`;

const AccountInput = styled.input`
    width: 60%;
    height: 8%;
    margin-bottom: 25px;
    font-size: 24px;
    padding-left: 10px;
`;

const AccountUpdateBtn = styled.button`
    width: 60%;
    height: 8%;
    font-size: 24px;
`;

export default function QuickLinks(props) {
    const { user, logout } = useUserAuth();
    const unitRef = useRef();
    const UnitNoteRef = useRef();
    const [activeUnit, setActiveUnit] = useState(0);
    const [loadState, setLoadState] = useState(false);
    const [AddVisibility, setAddVisibility] = useState(false);
    const [dayNotes, setDayNotes] = useState([]);
    const [unitNotes, setUnitNotes] = useState([]);
    const [allReminders, setAllReminders] = useState([]);
    const [AccountInfo, setAccountInfo] = useState([]);
    const [entriesLoaded, setEntriesLoaded] = useState(0);
    const [action, setAction] = useState('');
    const [checkboxChecked, setcheckboxChecked] = useState(false);
    const [ReminderHistoryOpen, setReminderHistoryOpen] = useState(false);
    const [AccountVisibility, setAccountVisibility] = useState(false);
    const AccountNameRef = useRef();
    const AccountYearRef = useRef();
    const AccountUniversityRef = useRef();
    // User Details //
    const [AccountName, setAccountName] = useState("");
    const [AccountYear, setAccountYear] = useState("");
    const [AccountUniversity, setAccountUniversity] = useState("");
    const [AccountID, setAccountID] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
        } catch(err) {
            console.log(err.message);
        }
    }

    async function LoadProfile() {
        setLoadState(true);
        const ProfileColRef = collection(db, "users");
        const queryProfile = query(ProfileColRef, where("Email", "==", user.email));
        onSnapshot(queryProfile, (snapshot) => {
            let accountArray = []
            snapshot.docs.forEach((doc) => {
                accountArray.push({ ...doc.data(), id: doc.id });
            });
            setAccountInfo(accountArray);
        });
        setLoadState(false);
    }

    useEffect(() => {
        setLoadState(true);
        const notesColRef = collection(db, "units");
        const queryNotes = query(notesColRef, where("email", "==", user.email));
        onSnapshot(queryNotes, (snapshot) => {
            let datesarray = []
            snapshot.docs.forEach((doc) => {
                datesarray.push({ ...doc.data(), id: doc.id });
            });
            setDayNotes(datesarray);
            setEntriesLoaded(snapshot.docs.length);
            setLoadState(false);
        });
    }, [user.email]);

    async function NewUnitAddition(e) {
        e.preventDefault();
        const NewUnitcollectionRef = collection(db, "units");
        const NewUnitPayload = {email: user.email, unit: unitRef.current.value};
        await addDoc(NewUnitcollectionRef, NewUnitPayload);
        setActiveUnit(unitRef.current.value);
        LoadUnitNotes(unitRef.current.value);
        unitRef.current.value = "";
        setAddVisibility(false);
        alert("Successfully added your new teaching unit!");
    };

    async function handleCheck(e) {
        setcheckboxChecked(!checkboxChecked);
    }

    async function LoadUnitNotes(unit) {
        setLoadState(true);
        const notesColRef = collection(db, "unit_notes");
        const queryNotes = query(notesColRef, where("unit", "==", unit), where("email", "==", user.email));
        onSnapshot(queryNotes, (snapshot) => {
            let notesArray = []
            snapshot.docs.forEach((doc) => {
                notesArray.push({ ...doc.data(), id: doc.id });
            });
            setUnitNotes(notesArray);
        });
        setLoadState(false);
    }

    async function LoadAllReminders(unit) {
        setLoadState(true);
        const ReminderColRef = collection(db, "notes");
        const queryReminders = query(ReminderColRef, where("email", "==", user.email));
        onSnapshot(queryReminders, (snapshot) => {
            let reminderArray = []
            snapshot.docs.forEach((doc) => {
                reminderArray.push({ ...doc.data(), id: doc.id });
            });
            setAllReminders(reminderArray);
        });
        setLoadState(false);
    }

    async function addImportantNote(e) {
        setLoadState(true);
        e.preventDefault();
        const newUnitNoteCollectionRef = collection(db, "unit_notes");
        const NewUnitNotePayload = {email: user.email, unit: activeUnit, important: "true", note: UnitNoteRef.current.value};
        await addDoc(newUnitNoteCollectionRef, NewUnitNotePayload);
        UnitNoteRef.current.value = "";
        setAddVisibility(false);
        setLoadState(false);
        alert("Successfully added a new note for this unit.");
    }
    
    async function AddUnimportantNote(e) {
        setLoadState(true);
        e.preventDefault();
        const newUnitNoteCollectionRef = collection(db, "unit_notes");
        const NewUnitNotePayload = {email: user.email, unit: activeUnit, important: "false", note: UnitNoteRef.current.value};
        await addDoc(newUnitNoteCollectionRef, NewUnitNotePayload);
        UnitNoteRef.current.value = "";
        setAddVisibility(false);
        setLoadState(false);
        alert("Successfully added a new note for this unit.");
    }

    async function handleDelete(NoteID) {
        const DeleteRef = doc(db, 'unit_notes', NoteID);
        await deleteDoc(DeleteRef);
        alert("Successfully Deleted Note");
    }

    async function handleReminderOpen() {
        setReminderHistoryOpen(!ReminderHistoryOpen);
    }

    async function handleAccountOpen() {
        setAccountVisibility(!AccountVisibility);
    }

    async function updateInformation(e) {
        e.preventDefault();
        setLoadState(true);
        if(AccountNameRef.current.value === "") {
            AccountNameRef.current.value = AccountName;
        }
        if(AccountYearRef.current.value === "") {
            AccountYearRef.current.value = AccountYear;
        }
        if(AccountUniversityRef.current.value === "") {
            AccountUniversityRef.current.value = AccountUniversity;
        }
        SendInformation();
    }

    async function SendInformation() {
        const ProfileSendColRef = doc(db, "users", AccountID);
        const ProfileSendPayload = {Email: user.email, Name: AccountNameRef.current.value, University: AccountUniversityRef.current.value, Year: AccountYearRef.current.value};
        await setDoc(ProfileSendColRef, ProfileSendPayload);
        alert("Successfully Updated User Profile - Changes will take effect on your next sign-in.");
        setLoadState(false);
        setAccountVisibility(false);
    }

    return (
    <>
    {AddVisibility &&
    <AddUnitContainer>
        <AddNewContainer>
            <AddNewForm onSubmit={NewUnitAddition}>
                <AddNewHeader>{action}</AddNewHeader>
                <LoginLabel>Unit Name:</LoginLabel>
                <LoginInput ref={unitRef} type="textarea" placeholder="New Unit" required></LoginInput>
                <LoginSubmit disabled={loadState}>{loadState ? 'Loading...' : 'Add'}</LoginSubmit>
                <CloseMessage onClick={() => setAddVisibility(false)}>Cancel</CloseMessage>
            </AddNewForm>            
        </AddNewContainer>
    </AddUnitContainer>
    }
    {AccountVisibility &&
    <AccountOverlayContainer>
        <AccountDetailContainer>
            <AccountProfilePictureContainer>
            </AccountProfilePictureContainer>
                {AccountInfo && AccountInfo.map(info => (
                    <AccountDetailContainerMain key={info.id} onSubmit={updateInformation}>
                        <AddNewHeader>Update Profile:</AddNewHeader>
                        <AccountLabel>Name:</AccountLabel>
                        <AccountInput ref={AccountNameRef} type="text" placeholder={info.Name}></AccountInput>
                        <AccountLabel>Year of Study:</AccountLabel>
                        <AccountInput ref={AccountYearRef} type="number" placeholder={info.Year}></AccountInput>
                        <AccountLabel>University:</AccountLabel>
                        <AccountInput ref={AccountUniversityRef} type="text" placeholder={info.University}></AccountInput>
                        <AccountUpdateBtn type="submit" disabled={loadState} onClick={() => {setAccountName(info.Name); setAccountYear(info.Year); setAccountUniversity(info.University); setAccountID(info.id);}}>{loadState ? 'Loading...' : 'Update'}</AccountUpdateBtn>
                        <CloseMessage onClick={() => setAccountVisibility(false)}>Cancel</CloseMessage>
                    </AccountDetailContainerMain>
                ))}
        </AccountDetailContainer>
    </AccountOverlayContainer>
    }
    {ReminderHistoryOpen &&
    <ReminderHistoryContainer>
        <ReminderHistoryMain>
            <ReminderTitle>All Reminders</ReminderTitle>
            {allReminders && allReminders.map(reminder => (
                <ReminderHistoryPost key={reminder.id}>
                    <ReminderText>- {reminder.note}</ReminderText>
                    <ReminderInfo>Reminder Date: {reminder.date_added}</ReminderInfo>
                </ReminderHistoryPost>
            ))}
        </ReminderHistoryMain>
        <CloseMessage onClick={() => setReminderHistoryOpen(false)}>Cancel</CloseMessage>
    </ReminderHistoryContainer>
    }
    <QuickLinksContainer>
        <QuickLinksHeader>Teaching Units:</QuickLinksHeader>
        {dayNotes && !loadState && dayNotes.map(note => (
        <QuickLinksUnits key={note.id} onClick={() => {setActiveUnit(note.unit); LoadUnitNotes(note.unit)}}>
            {note.unit} Notes
        </QuickLinksUnits>
        ))}
        {entriesLoaded > 0 && !loadState && 
            <QuickLinksUnits onClick={() => {setAddVisibility(true); setAction('Add Additional Teaching Unit');}}>
                Add Additional Unit
            </QuickLinksUnits>
        }
        {entriesLoaded === 0 && !loadState &&
            <QuickLinksUnits onClick={() => {setAddVisibility(true); setAction('Add New Teaching Unit');}}>
                Add New Teaching Unit
            </QuickLinksUnits>
        }
        <AccountSettings>
            <AccountSettingsHeader>Account:</AccountSettingsHeader>
            <AccountBtn onClick={() => {handleAccountOpen(); LoadProfile();}}>Account</AccountBtn>
            <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
            <ReminderBtn onClick={() => {handleReminderOpen(); LoadAllReminders();}}>View Reminder History</ReminderBtn>
        </AccountSettings>
    </QuickLinksContainer>
    <UnitNotes>
        {activeUnit === 0 ? 
        <>
            <InactiveUnit>No Unit Notes Are Currently Open</InactiveUnit>
            <InactiveSplash>{entriesLoaded === 0 ? 'Simply add a new teaching unit to begin.' : 'Simply open an existing teaching unit, or add a new one, to begin.'}</InactiveSplash>
        </>
        :
        <>
            <UnitTitle>{activeUnit} Notes</UnitTitle>
            <UnitNoteContainer>
            {unitNotes && unitNotes.map(note => (
                <ListEntry key={note.id}>
                    <ListMain>
                    <NoteContent>{note.note}</NoteContent>
                    <NoteDeleteBtn onClick={() => {handleDelete(note.id);}}>
                        <FontAwesomeIcon icon={faTrash} size="1x"/><br></br>
                        <DeleteSubtext>Delete</DeleteSubtext>
                    </NoteDeleteBtn>
                    </ListMain>
                    <FooterImportantAndDate>
                    {note.important === "true" ?
                        <>
                            <FooterTextImportant>Important!</FooterTextImportant>
                        </>
                    :
                        <>
                            <FooterText>Standard</FooterText>
                        </>
                    }
                    </FooterImportantAndDate>
                </ListEntry>
            ))}
            </UnitNoteContainer>
            <ChangeNoteContainer>
                <NoteSubmitForm onSubmit={checkboxChecked ? addImportantNote : AddUnimportantNote}>
                    <NoteTitle>Notes</NoteTitle>
                    <NoteLabel>Note Text</NoteLabel>
                    <NoteInput ref={UnitNoteRef} type="text" required />
                    <NoteLabel>Important?</NoteLabel>
                    <NoteCheckbox type="checkbox" onClick={handleCheck} />
                    <NoteSubmit type="submit">Add</NoteSubmit>
                </NoteSubmitForm>
            </ChangeNoteContainer>                
        </>
        }
    </UnitNotes>
    </>
    );
};