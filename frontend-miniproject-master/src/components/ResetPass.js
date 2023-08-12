import { Button, FormControl, FormLabel, Input, Stack, InputRightElement, InputGroup } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import jwtDecode from 'jwt-decode'
import axios from "axios"



const ResetPass = () => {

    const navigation = useNavigate()

    const [id, setid] = useState('')
    const [hidePass, setHidePass] = useState(true)
    const [hidePass2, setHidePass2] = useState(true)
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [err, setErr] = useState('')
    const [err2, setErr2] = useState('')
    const [sending, setSending] = useState(false)
    // setToken(useParams())
    const { token } = useParams()

    const decodeToken = jwtDecode(token)


    function validatePassword(password) {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
        return regex.test(password);
    }

    useEffect(() => {

        // if (!localStorage.getItem("id")) {
        //     navigation("/login")
        // }
        if (!decodeToken) {
            setid('')
            navigation('/login')
        } else {
            setid(decodeToken.id)
        }
        console.log("useEffect");
    }, [])
    // console.log(id);

    // useEffect(() => {
    //     console.log(token);
    // },[token])



    const handleResetPass = async () => {
        setSending(true)
        setErr('')
        setErr2('')

        if (!password || password === '') {
            setSending(false)
            return setErr("enter your new password")
        }

        if (password !== password2) {
            setSending(false)
            return setErr2("password does not match")
        }

        if (validatePassword(password) === false) {
            setSending(false)
            return setErr("Passwords should contain at least 8 characters including an uppercase letter, a symbol, and a number")
        }

        await axios.post(`http://localhost:5000/user/reset-pass`, {
            id,
            password,
            token
        })
            .then((result) => {
                setSending(false)
                console.log(result);
                // alert("your password was updated")
            }).catch((err) => {
                setSending(false)
                console.log(err);
                navigation("/err-token")
            });

    }

    const handleHidePass = () => {

        if (hidePass === true) {
            setHidePass(false)
        } else if (hidePass === false) {
            setHidePass(true)
        }

    }

    const handleHidePass2 = () => {

        if (hidePass2 === true) {
            setHidePass2(false)
        } else if (hidePass2 === false) {
            setHidePass2(true)
        }

    }

    return (
        <div>
            <FormControl>
                <FormLabel>Inser new password</FormLabel>

                <InputGroup size='md'>
                    <Input type={hidePass ? (
                        "password"
                    ) : (
                        "text"
                    )}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleResetPass()
                            }
                        }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => handleHidePass()}>
                            {hidePass ? ('Show') : ('Hide')}
                        </Button>
                    </InputRightElement>

                </InputGroup>
                {err}

                <FormLabel>Inser your new password again</FormLabel>
                <InputGroup>
                    <Input type={hidePass2 ? (
                        "password"
                    ) : (
                        "text"
                    )}
                        id="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleResetPass()
                            }
                        }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => handleHidePass2()}>
                            {hidePass2 ? ('Show') : ('Hide')}
                        </Button>
                    </InputRightElement>

                </InputGroup>
                {err2}

            </FormControl>
            <Stack>
                {sending ? (
                    <Button isLoading></Button>
                ) : (
                    <Button onClick={() => handleResetPass()}>Change password</Button>
                )}
            </Stack>
        </div>
    )
}


export default ResetPass