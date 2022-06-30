import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import breakpoint from "../Breakpoints.js";
import { useUserAuth } from '../Auth.js';
import { db } from '../firebase.js';
import { collection, onSnapshot, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';

const FadeIn = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`;

const CalendarContainer = styled.div`
@media ${breakpoint.device.xs} {
    width: 100%;
    background: red;
    height: 38vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
@media ${breakpoint.device.sm} {
    width: 100%;
    height: 38vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
@media ${breakpoint.device.lg} {
    width: 100%;
    height: 26vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
`;

const CalendarContentsContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const CalendarTile = styled.div`
    height: 80%;
    opacity: 0;
    width: 10%;
    background: #00ACED;
    margin: 0px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    animation: ${FadeIn} 1.5s forwards;
    animation-delay: 0.5s;

    &:hover {
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 30px;
    }
`;

const CalendarTileDate = styled.h1`
    width: 100%;
    font-size: 48px;
`;

const CalendarTileMonth = styled.h3`

`;

const CalendarTileYear = styled.h3`

`;

const CalendarTodayIndicator = styled.h3`
    display: block;
    height: 80px;
    margin-bottom: 10px;
`;

const CalendarNotesContainer = styled.div`
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const CalendarDateContainer = styled.h1`
    margin-left: 35px;
    height: 50px;
`;

const CalendarNotesContent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const LoadingButton = styled.button`
    width: 100px;
    height: 50px;
`;

const NotesLine = styled.div`
    width: 100%;
    height: 25vh;
`;

const ListEntry = styled.p`
    font-size: 22px;
    margin-left: 35px;
    text-align: left;
    font-weight: 300;
`;

const AddNoteBtn = styled.button`
    margin-left: 35px;
    border-radius: 5px;
    width: 100px;
    height: 40px;
    margin-top: 10px;
`;

const AddNewPopupBackground = styled.div`
    width: 100vw;
    top: 0;
    left: 0;
    height: 100vh;
    position: absolute;
    z-index: 100;
    display: flex;
    flex-direction: row;
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

const LoginInput = styled.textarea`
    width: 80%;
    height: 50%;
    margin-bottom: 25px;
    padding-top: 10px;
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

const RemoveListButton = styled.p`
    text-align: left;
    margin-left: 35px;
    font-weight: 700;

    &:hover{
        cursor: pointer;
    }
`;

export default function Calendar(props) {
    const { user } = useUserAuth();
    const [dayNotes, setDayNotes] = useState([]);
    const [page, setPage] = useState(4);
    const [loadState, setLoadState] = useState(false);
    const [nothingLoaded, setNothingLoaded] = useState(true);
    const [entriesLoaded, setEntriesLoaded] = useState(0);
    const [addingNew, setAddingNew] = useState(false);
    // const [TargetDate, setTargetDate] = useState(`${CalculatedDate}/${[month]}/${year}`);
    const noteRef = useRef();
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthDays = [
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    ]

    let CalculatedDate = monthDays[month][date-1];
    const newMonthCrossOver = [monthDays[month+1][0], monthDays[month+1][1], monthDays[month+1][2]];
    const previousMonthCrossOver = [monthDays[month-1].length-1, monthDays[month-1].length-2, monthDays[month-1].length-3,];
    const [activeDate, setActiveDate] = useState(`${CalculatedDate}/${[month]}/${year}`);

    console.log(previousMonthCrossOver);

    async function LoadNotes() {
        try {
            setNothingLoaded(false);
            setLoadState(true);
            if(page === 1) {
                let FinalDate = CalculatedDate-3 < 1 ? `${previousMonthCrossOver[2]}/${month}/${year}` : `${CalculatedDate-3}/${[month]}/${year}`;
                setActiveDate(CalculatedDate-3 > monthDays[month][monthDays.length-1] ? `${previousMonthCrossOver[2]}/${month}/${year}` : `${CalculatedDate-3}/${[month]}/${year}`);
                console.log(FinalDate);
                LoadData(FinalDate);
            } else if(page === 2) {
                let FinalDate = CalculatedDate-2 < 1 ? `${previousMonthCrossOver[2]}/${month}/${year}` : `${CalculatedDate-2}/${[month]}/${year}`;
                setActiveDate(CalculatedDate-3 > monthDays[month][monthDays.length-1] ? `${previousMonthCrossOver[2]}/${month}/${year}` : `${CalculatedDate-3}/${[month]}/${year}`);
                console.log(FinalDate);
                LoadData(FinalDate)
            } else if(page === 3) {
                let FinalDate = CalculatedDate-1 < 1 ? `${previousMonthCrossOver[2]}/${month}/${year}` : `${CalculatedDate-1}/${[month]}/${year}`;
                setActiveDate(CalculatedDate-3 > monthDays[month][monthDays.length-1] ? `${previousMonthCrossOver[2]}/${month}/${year}` : `${CalculatedDate-3}/${[month]}/${year}`);
                console.log(FinalDate);
                LoadData(FinalDate);
            } else if(page === 4) {
                let FinalDate = `${CalculatedDate}/${[month]}/${year}`;
                setActiveDate(`${CalculatedDate}/${[month]}/${year}`);
                console.log(FinalDate);
                LoadData(FinalDate);
            } else if(page === 5) {
                let FinalDate = CalculatedDate+1 > monthDays[month][monthDays.length-1] ? `${newMonthCrossOver[2]}/${month+1}/${year}` : `${CalculatedDate+1}/${[month]}/${year}`;
                setActiveDate(CalculatedDate+1 > monthDays[month][monthDays.length-1] ? `${newMonthCrossOver[2]}/${month+1}/${year}` : `${CalculatedDate+1}/${[month]}/${year}`);
                console.log(FinalDate);
                LoadData(FinalDate);
            } else if(page === 6) {
                let FinalDate = CalculatedDate+2 > monthDays[month][monthDays.length-1] ? `${newMonthCrossOver[2]}/${month+1}/${year}` : `${CalculatedDate+2}/${[month]}/${year}`;
                setActiveDate(CalculatedDate+2 > monthDays[month][monthDays.length-1] ? `${newMonthCrossOver[2]}/${month+1}/${year}` : `${CalculatedDate+2}/${[month]}/${year}`);
                console.log(FinalDate);
                LoadData();
            } else if(page === 7) {
                let FinalDate = CalculatedDate+3 > monthDays[month][monthDays.length-1] ? `${newMonthCrossOver[2]}/${month+1}/${year}` : `${CalculatedDate+3}/${[month]}/${year}`;
                setActiveDate(CalculatedDate+3 > monthDays[month][monthDays.length-1] ? `${newMonthCrossOver[2]}/${month+1}/${year}` : `${CalculatedDate+3}/${[month]}/${year}`);
                console.log(FinalDate);
                LoadData(FinalDate);
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    async function LoadData(FinalDate) {
        console.log('Final Date is ' + FinalDate);
        const notesColRef = collection(db, "notes");
        const queryNotes = query(notesColRef, where("date_added", "==", FinalDate), where("email", "==", user.email));
        onSnapshot(queryNotes, (snapshot) => {
            let notesArray = []
            snapshot.docs.forEach((doc) => {
                notesArray.push({ ...doc.data(), id: doc.id });
            });
            setDayNotes(notesArray);
            setEntriesLoaded(snapshot.docs.length);
        });
        setNothingLoaded(false);
        setAddingNew(false);
        setLoadState(false);
    }

    async function NewNoteAddition(e) {
        e.preventDefault();
        const NewNotecollectionRef = collection(db, "notes");
        const NewNotePayload = {date_added: activeDate, email: user.email, note: noteRef.current.value}
        await addDoc(NewNotecollectionRef, NewNotePayload);
        noteRef.current.value = "";
        alert("Successfully added your new note!");
    }

    async function handleDelete(NoteID) {
        const DeleteRef = doc(db, 'notes', NoteID);
        await deleteDoc(DeleteRef);
        alert("Successfully Deleted Note");
    }

    return (
    <>
        {addingNew &&
            <AddNewPopupBackground>
                <AddNewContainer>
                    <AddNewForm onSubmit={NewNoteAddition}>
                        <AddNewHeader>Add New Note For {activeDate}</AddNewHeader>
                        <LoginLabel>Note:</LoginLabel>
                        <LoginInput ref={noteRef} type="textarea" placeholder="New Note" required></LoginInput>
                        <LoginSubmit disabled={loadState}>{loadState ? 'Loading...' : 'Add'}</LoginSubmit>
                        <CloseMessage onClick={() => setAddingNew(false)}>Cancel</CloseMessage>
                    </AddNewForm>            
                </AddNewContainer>
            </AddNewPopupBackground>
        }
        <CalendarContainer>
            <CalendarContentsContainer>
                <CalendarTile onClick={() => {setPage(1); setNothingLoaded(true);}}>
                    <CalendarTileDate>{CalculatedDate-3}</CalendarTileDate>
                    <CalendarTileMonth>{monthNames[month-1]}</CalendarTileMonth>
                    <CalendarTileYear>{year}</CalendarTileYear>
                </CalendarTile>
                <CalendarTile onClick={() => {setPage(2); setNothingLoaded(true);}}>
                    <CalendarTileDate>{CalculatedDate-2}</CalendarTileDate>
                    <CalendarTileMonth>{monthNames[month-1]}</CalendarTileMonth>
                    <CalendarTileYear>{year}</CalendarTileYear>
                </CalendarTile>
                <CalendarTile onClick={() => {setPage(3); setNothingLoaded(true);}}>
                    <CalendarTileDate>{CalculatedDate-1}</CalendarTileDate>
                    <CalendarTileMonth>{monthNames[month-1]}</CalendarTileMonth>
                    <CalendarTileYear>{year}</CalendarTileYear>
                </CalendarTile>
                <CalendarTile onClick={() => {setPage(4); setNothingLoaded(true);}}>
                    <CalendarTileDate>{CalculatedDate}</CalendarTileDate>
                    <CalendarTileMonth>{monthNames[month-1]}</CalendarTileMonth>
                    <CalendarTileYear>{year}</CalendarTileYear>
                </CalendarTile>
                <CalendarTile onClick={() => {setPage(5); setNothingLoaded(true);}}>
                    <CalendarTileDate>{CalculatedDate+1 > monthDays[month][monthDays.length-1] ? newMonthCrossOver[0] : CalculatedDate+1}</CalendarTileDate>
                    <CalendarTileMonth>{CalculatedDate+1 > monthDays[month][monthDays.length-1] ? monthNames[month] : monthNames[month-1]}</CalendarTileMonth>
                    <CalendarTileYear>{year}</CalendarTileYear>
                </CalendarTile>
                <CalendarTile onClick={() => {setPage(6); setNothingLoaded(true);}}>
                    <CalendarTileDate>{CalculatedDate+2 > monthDays[month][monthDays.length-1] ? newMonthCrossOver[1] : CalculatedDate+2}</CalendarTileDate>
                    <CalendarTileMonth>{CalculatedDate+2 > monthDays[month][monthDays.length-1] ? monthNames[month] : monthNames[month-1]}</CalendarTileMonth>
                    <CalendarTileYear>{year}</CalendarTileYear>
                </CalendarTile>
                <CalendarTile onClick={() => {setPage(7); setNothingLoaded(true);}}>
                    <CalendarTileDate>{CalculatedDate+3 > monthDays[month][monthDays.length-1] ? newMonthCrossOver[2] : CalculatedDate+3}</CalendarTileDate>
                    <CalendarTileMonth>{CalculatedDate+3 > monthDays[month][monthDays.length-1] ? monthNames[month] : monthNames[month-1]}</CalendarTileMonth>
                    <CalendarTileYear>{year}</CalendarTileYear>
                </CalendarTile>
            </CalendarContentsContainer>
        </CalendarContainer>
        <CalendarTodayIndicator>Today</CalendarTodayIndicator>
        <CalendarNotesContainer>
            <CalendarDateContainer>
                {page === 1 && `Reminders for ${monthNames[month-1]} ${CalculatedDate-3}:`}
                {page === 2 && `Reminders for ${monthNames[month-1]} ${CalculatedDate-2}:`}
                {page === 3 && `Reminders for yesterday, ${monthNames[month-1]} ${CalculatedDate-1}:`}
                {page === 4 && `Reminders for today, ${monthNames[month-1]} ${CalculatedDate}:`}
                {page === 5 && `Reminders for tomorrow, ${CalculatedDate+1 > monthDays[month][monthDays.length-1] ? newMonthCrossOver[0] + " " + monthNames[month] : CalculatedDate+1 + " " + monthNames[month-1]}:`}
                {page === 6 && `Reminders for ${CalculatedDate+2 > monthDays[month][monthDays.length-1] ? newMonthCrossOver[1] + " " + monthNames[month] : CalculatedDate+2 + " " + monthNames[month-1]}:`}
                {page === 7 && `Reminders for ${CalculatedDate+3 > monthDays[month][monthDays.length-1] ? newMonthCrossOver[2] + " " + monthNames[month] : CalculatedDate+3 + " " + monthNames[month-1]}:`}
            </CalendarDateContainer>
            <CalendarNotesContent>
                {(page > 0) && nothingLoaded === true && <LoadingButton onClick={() => {LoadData(); LoadNotes();}}>Load Notes</LoadingButton>}
                {nothingLoaded === false && 
                <NotesLine>
                {dayNotes && dayNotes.map(note => (
                    <>
                        <ListEntry key={note.id}>- {note.note}</ListEntry>
                        <RemoveListButton onClick={() => {handleDelete(note.id)}}>Remove</RemoveListButton>
                    </>
                ))}
                {entriesLoaded === 0 && <p>No Reminders for this date.</p>}
                {entriesLoaded >= 0 && 
                    <AddNoteBtn onClick={() => setAddingNew(true)}>Add New</AddNoteBtn>
                }
                </NotesLine> }
            </CalendarNotesContent>
        </CalendarNotesContainer>
    </>
    );
};
