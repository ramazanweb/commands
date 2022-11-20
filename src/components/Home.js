import React, {useEffect, useState, useRef} from 'react';
import * as p5 from 'p5';
import * as THREE from 'three';
import VANTA from 'vanta/dist/vanta.rings.min';
import TextField from '@mui/material/TextField';

import './Home.css';
import albert from './../albert.png'

import {addDoc, getDocs, collection, query, orderBy, limit, increment, updateDoc} from "firebase/firestore";
import db from "./database/firebase";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FilledInput from "@mui/material/FilledInput";
import Button from "@mui/material/Button";
import AccountCircle from '@mui/icons-material/AccountCircle';


function Home() {

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorText, setNameErrorText] = useState('');

    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorText, setPhoneErrorText] = useState('');

    const [commandName, setCommandName] = useState('');
    const [commandNameError, setCommandNameError] = useState(false);
    const [commandNameErrorText, setCommandNameErrorText] = useState('');

    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [commandNumber, setCommandNumber] = useState(0);
    const [commands, setCommands] = useState([]);
    const [vantaEffect, setVantaEffect] = useState(null)
    const myRef = useRef(null)

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const doFetch = async () => {
            const querySnapshot = await getDocs(collection(db, "commands"));
            const arr = [];
            querySnapshot.forEach((doc) => {
                arr.push({
                    ...doc.data(),
                    id: doc.id,
                });
                if (isMounted) setCommands(arr);
            });

        };

        doFetch() // start the async work
            .catch((err) => {
                if (!isMounted) return; // unmounted, ignore.
                // TODO: Handle errors in your component
                console.error("failed to fetch data", err);
            });

        if (!vantaEffect) {
            setVantaEffect(VANTA({
                el: myRef.current,
                THREE: THREE //
            }))
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy()
            isMounted = false;
        };
    }, [vantaEffect]);

    const lastData = async () => {
        const q = query(collection(db, "commands"), orderBy("date", "desc"), limit(1));
        const docsSnap = await getDocs(q);
        return docsSnap;
    }


    const addCommands = async (e) => {
        if (!Boolean(name) || !Boolean(phone) || !Boolean(commandName)) {

        } else {
            try {
                setLoading(true);
                lastData().then(async (docsSnap) => {
                    let last_number = 0;

                    docsSnap.forEach(doc => {
                        last_number = doc.data().command_number;
                    })

                    const docRef = await addDoc(collection(db, "commands"), {
                        name: name,
                        phone: phone,
                        command_name: commandName,
                        date: new Date(),
                        command_number: last_number + 1,
                    }).then(() => {
                        setLoading(false);

                    });

                    // console.log("Document written with ID: ", docRef.id);
                })

            } catch (e) {
                console.error("Error adding document: ", e);
            }

        }


    };

    const nameOnChange = (e) => {
        let value = e.target.value.trim();
        setName(value);
    }

    const phoneOnChange = (e) => {
        let value = e.target.value.trim();
        setPhone(value);
    }

    const commandNameOnChange = (e) => {
        let value = e.target.value.trim();
        setCommandName(value);
    }

    return <div className="home" ref={myRef}>
        <div className="card">
            <div className="image">
                <img src={albert} alt="Logo"/>
            </div>
            <h1>Оставить заявку</h1>
            <FormControl fullWidth sx={{m: 1}}>
                <TextField
                    className="text-field"
                    id="outlined-adornment-amount"
                    label="Имя"
                    size="small"
                    value={name}
                    onChange={nameOnChange}
                    required
                    error={!Boolean(name)}
                    helperText={!Boolean(name) ? "Поле 'Имя' необходимо заполнить" : ""}
                />
            </FormControl>
            <FormControl fullWidth sx={{m: 1}}>
                <TextField
                    className="text-field"
                    id="outlined-adornment-amount"
                    label="Телефон"
                    size="small"
                    required
                    value={phone}
                    onChange={phoneOnChange}
                    error={!Boolean(phone)}
                    helperText={!Boolean(phone) ? "Поле 'Телефон' необходимо заполнить" : ""}
                />
            </FormControl>
            <FormControl fullWidth sx={{m: 1}}>
                <TextField
                    className="text-field"
                    required
                    id="outlined-adornment-amount"
                    label="Команда"
                    value={commandName}
                    size="small"
                    error={!Boolean(commandName)}
                    onChange={commandNameOnChange}
                    helperText={!Boolean(commandName) ? "Поле 'Команда' необходимо заполнить" : ""}
                />
            </FormControl>
            <button disabled={!Boolean(name) || !Boolean(phone) || !Boolean(commandName) || loading}
                    onClick={addCommands}>
                {loading ? 'Отправка...' : "Отправить"}
            </button>
            <sup>Нажимая на кнопку, вы соглашаетесь на обработку персональных данных</sup>
            {/*<ul className="todo-list">*/}
            {/*    {commands.map((todo) => (*/}
            {/*        <li key={todo.id}>{todo.name}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    </div>
}

export default Home;
