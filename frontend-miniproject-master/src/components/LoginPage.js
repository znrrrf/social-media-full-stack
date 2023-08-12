import { Button, FormControl, FormLabel, Input, InputRightElement, InputGroup, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {

    const navigation = useNavigate()

    useEffect(() => {

        localStorage.removeItem("userLogins")
        localStorage.removeItem("profile")
        localStorage.removeItem("userData")
        localStorage.removeItem('idContent')

    },[])

    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [hidePass, setHidePass] = useState(true)
    const [passErr, setPassErr] = useState('')
    const [credErr, setCretErr] = useState('')
    const [isSended, setIsSended] = useState(true)

    const handleHidePass = () => {

        if (hidePass === true) {
            setHidePass(false)
        } else if (hidePass === false) {
            setHidePass(true)
        }

    }

    const isEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    useEffect(() => {

        console.log(credential);
        console.log(password);

    },[credential, password])

    const handleLogin = async () => {

        setIsSended(false)
        setPassErr('')
        setCretErr('')

        if (!credential && !password) {
            setCretErr("Insert your email/password please")
            setPassErr("Insert your password please")
            return setIsSended(true)
        } else if (!credential) {
            setCretErr("Insert your email/password please")
            return setIsSended(true)
        } else if (!password) {
            setPassErr("Insert your password please")
            return setIsSended(true)
        }

        let value = null;

        if (isEmail(credential)) {
            value = "email"
        } else {
            value = "username"
        }

        // console.log(isEmail(credential));

        await axios.post("http://localhost:5000/auth/login", {
            credential,
            password,
            value
        })
            .then((result) => {
                console.log(result);
                localStorage.setItem("userLogins", JSON.stringify(result.data.result))
                localStorage.setItem("profile", JSON.stringify(result.data.profile.username))
                localStorage.removeItem("userData");
                setIsSended(true)
                navigation("/")
                window.location.reload()
            }).catch((err) => {
                console.log(err);
                setIsSended(true)
                if (err.response.data.type === "credential") {
                    setCretErr(err.response.data.message)
                } else if (err.response.data.type === "pass") {
                    setPassErr(err.response.data.message)
                }

            });

    }

    return (
        <div style={{minHeight:'80vh', display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <FormControl>
                <FormLabel>Username/Email</FormLabel>
                <Input type='email' value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleLogin()
                        }
                    }}
                />
                {credErr}
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
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
                                handleLogin()
                            }
                        }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => handleHidePass()}>
                            {hidePass ? ('Show') : ('Hide')}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                {passErr}
            </FormControl>
            <Stack>
                {isSended ? (
                    <Button onClick={() => handleLogin()}>Log in</Button>
                ) : (
                    <Button isLoading></Button>
                )}
                <Button onClick={() => navigation('/regis')}>Sign Up here</Button>
                <Button onClick={() => navigation("/forgot-pass")} variant='link'>forgot your password?</Button>
            </Stack>

        </div>
    )
}

export default LoginPage;