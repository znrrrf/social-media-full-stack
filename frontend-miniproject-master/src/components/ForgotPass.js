import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react' 
import axios from 'axios';
import { useState } from 'react';


const ForgorPass = () => {

    const [email, setEmail] = useState('')
    const [sending, setSending] = useState(false)
    const [err, setErr] = useState('')

    const isEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    const handleSendLink = async () => {
        setErr('')
        if (!email || email === '') {
            return setErr("enter your registered email first")
        }
        if (isEmail(email) === false) {
            return setErr("!ts not an email!")
        }

        setSending(true)

        await axios.post("http://localhost:5000/auth/forgot-pass", {
            email
        })
        .then((result) => {
            console.log(result);
            setSending(false)
            localStorage.setItem("userData", JSON.stringify(result.data.result))
        }).catch((err) => {
            console.log(err);
            setSending(false)
        });
        // setSending(true)
        console.log(email);


    }

    return (
        <div>
            {/* this is forgot pass */}
            <FormControl>
                <FormLabel>Enter the registered email</FormLabel>
                <Input 
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        // console.log(email);
                        handleSendLink()
                    }
                }}
                />
            </FormControl>
            {err}
            <Stack>
                {sending ? (
                    <Button isLoading></Button>
                ): (
                    <Button onClick={() => handleSendLink()}>send link for edit password</Button>
                )}
            </Stack>
        </div>
    )
}

export default ForgorPass;