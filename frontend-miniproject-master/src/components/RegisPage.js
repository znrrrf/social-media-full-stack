import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    Stack,
    InputRightElement,
    InputGroup,
    
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisPage = () => {

    const navigation = useNavigate()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [verif, setVerif] = useState('')
    const [emailErr, setEmaillErr] = useState('')
    const [usernameErr, setUserNameErr] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [verifErr, setVerifErr] = useState('')
    const [isLoad, setIsLoad] = useState(true)
    const [hidePass, setHidePass] = useState(true)

    // const [sendAgain, setSendAgain] = useState(false)

    useEffect(() => {


        if ( localStorage.getItem("userLogins") ) {
            navigation("/login")

            

        } 
        
    },[email, username, password,verif])

    useEffect(() => {
        if (password.length === 0) {
            setPasswordErr('')
        } else if (password.length >= 1 && password.length < 8 && password) {
            setPasswordErr("password need minimal 8 character length")
        } else if (password.length >= 8 && password.length <= 10) {
            setPasswordErr("password strength: weak")
        } else if (password.length >= 11 && password.length <= 13) {
            setPasswordErr("password strengt: ok")
        } else if (password.length > 13) {
            setPasswordErr("password strengt: high")
        }

        // console.log(password.length);

    }, [password])

    const isEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    function validatePassword(password) {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
        return regex.test(password);
    }

    // button regis / enter
    const handleRegis = async () => {
        console.log("regis is checking");
        setIsLoad(false)

        if (email == null) {
            setIsLoad(true)
            return setEmaillErr("Please input your Email")
        }
        else {
            setEmaillErr('')
            setUserNameErr('')
            setPasswordErr('')
            setEmaillErr('')
            setVerifErr('')
            setPasswordErr('')
        }
        if (username == null) {
            setIsLoad(true)
            return setUserNameErr("Please input your username")
        }
        else {
            setUserNameErr('')
            setEmaillErr('')
            setPasswordErr('')
            setEmaillErr('')
            setVerifErr('')
            setPasswordErr('')
        }
        if (password == null) {
            setIsLoad(true)
            return setPasswordErr("Please input your password")
        }
        else {
            setEmaillErr('')
            setUserNameErr('')
            setPasswordErr('')
            setEmaillErr('')
            setVerifErr('')
            setPasswordErr('')
        }
        if (isEmail(email) === false) {
            setIsLoad(true)
            return setEmaillErr("Please enter a valid Email")
        }
        else {
            setEmaillErr('')
            setUserNameErr('')
            setPasswordErr('')
            setEmaillErr('')
            setVerifErr('')
            setPasswordErr('')
        }
        if (password !== verif) {
            setIsLoad(true)
            return setVerifErr("Password doesn't match")
        }
        else {
            setEmaillErr('')
            setUserNameErr('')
            setPasswordErr('')
            setEmaillErr('')
            setVerifErr('')
            setPasswordErr('')
        }
        if (validatePassword(password) === false) {
            setIsLoad(true)
            return setPasswordErr("Passwords should contain at least 8 characters including an uppercase letter, a symbol, and a number")
        }
        else {
            setEmaillErr('')
            setUserNameErr('')
            setPasswordErr('')
            setEmaillErr('')
            setVerifErr('')
            setPasswordErr('')
        }

        console.log("all correct");


        await axios.post("http://localhost:5000/auth/register", {
            email,
            username,
            password
        })
            .then((result) => {
                console.log("regis sended");
                console.log(result);
                setIsLoad(true)
                // setSendAgain(true)
            }).catch((err) => {
                console.log(err);
                setIsLoad(true)

                if (err.response.data.status === "both") {
                    setEmaillErr(err.response.data.message)
                    setUserNameErr(err.response.data.message)
                } else if (err.response.data.status === "email") {
                    setEmaillErr(err.response.data.message)
                } else if (err.response.data.status === "username") {
                    setUserNameErr(err.response.data.message)
                }

            });

    }

    const handleHidePass = () => {

        if (hidePass === true) {
            setHidePass(false)
        } else if (hidePass === false) {
            setHidePass(true)
        }

    }


    return (
        <div style={{minHeight:'80vh', display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input type='email' value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleRegis()
                        }
                    }}
                />
                {emailErr}
                <FormLabel>username</FormLabel>
                <Input type='text' value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleRegis()
                        }
                    }}
                />
                {usernameErr}
                <FormLabel>password</FormLabel>
                <InputGroup size='md'>
                    <Input type={hidePass ? (
                        "password"
                    ) : (
                        "text"
                    )}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleRegis()
                            }
                        }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => handleHidePass()}>
                            {hidePass ? ('Show') : ('Hide')}
                        </Button>
                    </InputRightElement>
                </InputGroup>

                {passwordErr}

                <FormLabel>write again your password</FormLabel>
                <InputGroup size='md'>
                    <Input type={hidePass ? (
                        "password"
                    ) : (
                        "text"
                    )}
                        value={verif}
                        onChange={(e) => setVerif(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleRegis()
                            }
                        }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => handleHidePass()}>
                            {hidePass ? ('Show') : ('Hide')}
                        </Button>
                    </InputRightElement>
                </InputGroup>

                {/* <FormLabel>write again your password</FormLabel>
                <Input type='text' value={verif}
                    onChange={(e) => setVerif(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleRegis()
                        }
                    }}
                /> */}
                {verifErr}
            </FormControl>
            <Stack>
                {isLoad ? (
                    <Button onClick={() => handleRegis()}>Sign Up</Button>
                ) : (
                    <Button isLoading >
                        Sign Up
                    </Button>
                )}
                {/* {sendAgain ? (
                    <Button>send verif again</Button>
                ) : (
                    null
                )} */}
            </Stack>


        </div>
    )
}

export default RegisPage