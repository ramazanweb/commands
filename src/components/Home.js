import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import './Home.css';
import albert from './../albert-4.png';
import albertResult from './../albert.png';
import {addDoc, getDocs, collection, query, orderBy, limit} from "firebase/firestore";
import db from "./database/firebase";
import FormControl from "@mui/material/FormControl";
import {createTheme} from "@mui/material/styles";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

function Home() {

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [commandName, setCommandName] = useState('');
    const [commandNumber, setCommandNumber] = useState(0);
    const [loading, setLoading] = useState(false);


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
        return <div className="home">
            <div className="card">
                <div className="image">
                    <img src={albert} alt="Logo"/>
                </div>
                <h1>???????????????? ????????????</h1>
                <FormControl fullWidth sx={{m: 1}}>
                    <ThemeProvider theme={theme}>
                        <TextField
                            className="text-field"
                            id="outlined-adornment-amount"
                            label="??????"
                            size="small"
                            value={name}
                            onChange={nameOnChange}
                            required
                            error={!Boolean(name)}
                            helperText={!Boolean(name) ? "???????? '??????' ???????????????????? ??????????????????" : ""}
                        />
                    </ThemeProvider>
                </FormControl>
                <FormControl fullWidth sx={{m: 1}}>
                    <ThemeProvider theme={theme}>
                        <TextField
                            className="text-field"
                            id="outlined-adornment-amount"
                            label="??????????????"
                            size="small"
                            required
                            type="number"
                            placeholder="87759844789"
                            value={phone}
                            onChange={phoneOnChange}
                            error={!Boolean(phone)}
                            helperText={!Boolean(phone) ? "???????? '??????????????' ???????????????????? ??????????????????" : ""}
                        />
                    </ThemeProvider>
                </FormControl>
                <FormControl fullWidth sx={{m: 1}}>
                    <ThemeProvider theme={theme}>
                        <TextField
                            className="text-field"
                            required
                            id="outlined-adornment-amount"
                            label="??????????????"
                            value={commandName}
                            size="small"
                            error={!Boolean(commandName)}
                            onChange={commandNameOnChange}
                            helperText={!Boolean(commandName) ? "???????? '??????????????' ???????????????????? ??????????????????" : ""}
                        />
                    </ThemeProvider>
                </FormControl>
                <button disabled={!Boolean(name) || !Boolean(phone) || !Boolean(commandName) || loading}
                        onClick={addCommands}>
                    {loading ? '????????????????...' : "??????????????????"}
                </button>
                <sup>?????????????? ???? ????????????, ???? ???????????????????????? ???? ?????????????????? ???????????????????????? ????????????</sup>
            </div>
        </div>
    } else {
        return <div className="home">
            <div className="card">
                <div className="image">
                    <img src={albert} alt="Logo"/>
                </div>
                <div className="text-center">
                    <h1>?????? ??????????: <span className="red-text">
                        {commandNumber}
                    </span></h1>
                    <h3 className="red-text">????????????????????, ???????????????? ?????????? ????????????.</h3>
                    <img src={albertResult} alt="" className="albert-image"/>
                </div>
                <button onClick={comeBack}>
                    ?????????????????? ??????????
                </button>
            </div>
        </div>
    }
}

export default Home;
