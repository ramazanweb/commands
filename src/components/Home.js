import React, {useEffect, useState, useRef} from 'react';
import * as p5 from 'p5';
import VANTA from 'vanta/dist/vanta.topology.min';
import TextField from '@mui/material/TextField';
import './Home.css';
import albert from './../albert-4.png';
import albertResult from './../albert.png';
import {addDoc, getDocs, collection, query, orderBy, limit, increment, updateDoc} from "firebase/firestore";
import db from "./database/firebase";
import FormControl from "@mui/material/FormControl";
import {createTheme} from "@mui/material/styles";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

function Home() {

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [commandName, setCommandName] = useState('');
    const [commandNumber, setCommandNumber] = useState(0);
    const [vantaEffect, setVantaEffect] = useState(null)
    const myRef = useRef(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (!vantaEffect) {
            setVantaEffect(VANTA({
                el: myRef.current,
                p5: p5,
                color: "#0A7FB1",
                backgroundColor: "#000000",
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

    const theme = createTheme({
        palette: {
            error: {
                main: "#302d30", // change the error color to pink
            }
        }
    });

    const addCommands = async (e) => {
        if (!Boolean(name) || !Boolean(phone) || !Boolean(commandName)) {
        } else {
            try {
                setLoading(true);
                lastData().then(async (docsSnap) => {
                    let last_number = 0;


                    if (docsSnap.docs.length > 0) {
                        docsSnap.forEach(doc => {
                            last_number = doc.data().command_number;
                        });
                        console.log('asjdkasdj')
                    }

                    setCommandNumber(last_number + 1);

                    await addDoc(collection(db, "commands"), {
                        name: name,
                        phone: phone,
                        command_name: commandName,
                        date: new Date(),
                        command_number: last_number + 1,
                    }).then(() => {
                        setLoading(false);
                    });
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

    const comeBack = () => {
        setCommandNumber(0);
        setName('');
        setPhone('');
        setCommandName('');
    }

    if (commandNumber === 0) {
        return <div className="home" ref={myRef}>
            <div className="card">
                <div className="image">
                    <img src={albert} alt="Logo"/>
                </div>
                <h1>Оставить заявку</h1>
                <FormControl fullWidth sx={{m: 1}}>
                    <ThemeProvider theme={theme}>
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
                    </ThemeProvider>
                </FormControl>
                <FormControl fullWidth sx={{m: 1}}>
                    <ThemeProvider theme={theme}>
                        <TextField
                            className="text-field"
                            id="outlined-adornment-amount"
                            label="Телефон"
                            size="small"
                            required
                            type="number"
                            placeholder="87759844789"
                            value={phone}
                            onChange={phoneOnChange}
                            error={!Boolean(phone)}
                            helperText={!Boolean(phone) ? "Поле 'Телефон' необходимо заполнить" : ""}
                        />
                    </ThemeProvider>
                </FormControl>
                <FormControl fullWidth sx={{m: 1}}>
                    <ThemeProvider theme={theme}>
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
                    </ThemeProvider>
                </FormControl>
                <button disabled={!Boolean(name) || !Boolean(phone) || !Boolean(commandName) || loading}
                        onClick={addCommands}>
                    {loading ? 'Отправка...' : "Отправить"}
                </button>
                <sup>Нажимая на кнопку, вы соглашаетесь на обработку персональных данных</sup>
            </div>
        </div>
    } else {
        return <div className="home" ref={myRef}>
            <div className="card">
                <div className="image">
                    <img src={albert} alt="Logo"/>
                </div>
                <div className="text-center">
                    <h1>Ваш номер: <span className="red-text">
                        {commandNumber}
                    </span></h1>
                    <h3 className="red-text">Пожалуйста, сделайте скрин экрана.</h3>
                    <img src={albertResult} alt="" className="albert-image"/>
                </div>
                <button onClick={comeBack}>
                    Вернуться назад
                </button>
            </div>
        </div>
    }

}

export default Home;
