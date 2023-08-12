import { AddIcon, CheckIcon, SmallCloseIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, Image, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const EditProfilePage = () => {

    const navigation = useNavigate()

    const [fullname, setFullname] = useState('')
    const [address, setAddress] = useState('')
    const [userdate, setUserdate] = useState('')
    const [hobby, setHobby] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [pic, setPic] = useState('')
    const [id, setid] = useState(null)
    const [isVerified, setIsverified] = useState(true)
    const [statusUsername, setStatusUsername] = useState(true)
    const [usernameSending, setUsernameSending] = useState(null)
    const [timer, setTimer] = useState(null)
    const [sending, setSending] = useState(false)
    const [profileName, SetProfileName] = useState('')
    const [updating, setUpating] = useState(false)
    const [statusData, setStatusData] = useState('')

    useEffect(() => {

        if (username) {
            setUsernameSending("wait a moment...")

            if (timer) {
                clearTimeout(timer);
            }
            setTimer(setTimeout(() => {
                // console.log(username);
                // setUsernameSending(null)

                checkUsername()
            }, 5000));
        } else if (username.length < 1 || username == null) {
            if (timer) {

                clearTimeout(timer);
                setTimer(null)

            }
            setUsernameSending('')
            setStatusUsername(true)
        }



    }, [username])

    useEffect(() => {
        // console.log(JSON.parse(localStorage.getItem('userLogins')).email);
        if (!localStorage.getItem('userLogins')) {
            return navigation('/login')
        }
        setid(JSON.parse(localStorage.getItem('userLogins')).id)
        setEmail(JSON.parse(localStorage.getItem('userLogins')).email)
        setUsername(JSON.parse(localStorage.getItem('userLogins')).username)
        SetProfileName(JSON.parse(localStorage.getItem("profile")))
        if (JSON.parse(localStorage.getItem('userLogins')).is_verified == false) {
            setIsverified(true)
        } else {
            setIsverified(false)
        }
    }, [])

    // console.log(isVerified);

    const checkUsername = async () => {
        console.log('jalan');

        await axios.post('http://localhost:5000/user/check-username', {
            username,
            profileName
        })
            .then((result) => {
                console.log(result);
                setUsernameSending(false)
                setStatusUsername(false)
                setUsernameSending('username good to go')

            }).catch((err) => {
                console.log(err);
                setUsernameSending(false)
                setStatusUsername(true)
                setUsernameSending("username is already used")
            });
    }

    const sendAgain = async () => {
        setSending(true)
        // console.log(email, id);
        await axios.post(`http://localhost:5000/auth/resend`, {
            id,
            email
        })
            .then((result) => {
                console.log(result);
                setSending(false)
                navigation('/login')
            }).catch((err) => {
                console.log(err);
                setSending(false)
            });

    }

    const handleEditProfile = async () => {
        setUpating(true)
        const formData = new FormData();
        formData.append('pic', pic)
        formData.append('fullname', fullname)
        formData.append('address', address)
        formData.append('userdate', userdate)
        formData.append('hobby', hobby)
        formData.append('username', username)
        formData.append('email', email)

        await axios.post("http://localhost:5000/user/bio",
            formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
        )
            .then((result) => {
                console.log(result);
                setUpating(false)
                setStatusData("biodata saved")
            }).catch((err) => {
                console.log(err);
                setUpating(false)
                setStatusData("something went wrong")
            });
        // console.log(pic);
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            <FormControl>
                <FormLabel> Full name </FormLabel>
                <Input type="text" value={fullname} disabled={isVerified} onChange={(e) => setFullname(e.target.value)} />

                <FormLabel> address </FormLabel>
                <Input type="text" value={address} disabled={isVerified} onChange={(e) => setAddress(e.target.value)} />

                <FormLabel> Date Of Birth </FormLabel>
                <Input type="date" value={userdate} disabled={isVerified} onChange={(e) => setUserdate(e.target.value)} />

                <FormLabel> Hobby </FormLabel>
                <Input type="text" value={hobby} disabled={isVerified} onChange={(e) => setHobby(e.target.value)} />

                <FormLabel> Username </FormLabel>
                <InputGroup>
                    <Input type="text" value={username} disabled={isVerified} onChange={(e) => { setUsername(e.target.value) }} />
                    <InputRightElement>
                        {statusUsername ? (
                            <SmallCloseIcon />
                        ) : (
                            <CheckIcon />
                        )}
                    </InputRightElement>
                </InputGroup>
                {usernameSending}


                <FormLabel> Email </FormLabel>
                <InputGroup>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={true} />
                    <InputRightElement>
                        <Tooltip label='email cant be changed' fontSize='md'>
                            <WarningTwoIcon />
                        </Tooltip>
                    </InputRightElement>
                </InputGroup>
                {/* <p>you can not change your email</p> */}

                <FormLabel> Profile Picture </FormLabel>
                <Input type="file" disabled={isVerified} onChange={(e) => setPic(e.target.files[0])} />
            </FormControl>
            <Stack>
                {updating ? (
                    <Button isLoading>Save Edit</Button>
                ) : (
                    <Stack direction={'column'}>
                        <Button isLoading={isVerified} onClick={() => handleEditProfile()}>Save Edit</Button>
                        <p>{statusData}</p>
                    </Stack>

                )}
                {isVerified ? (
                    <Stack>
                        <h1>please verify your email first to edit your biodata</h1>
                        <p style={{ display: "flex", justifyContent: 'center', alignContent: 'center' }}>click the button belo if your link expired</p>
                        {sending ? (
                            <Button isLoading></Button>
                        ) : (
                            <Button onClick={() => sendAgain()}>Send verify</Button>
                        )}
                    </Stack>
                ) : (
                    null
                )}
            </Stack>
            {/* <Image src="http://localhost:5000/assets\\345665.jpeg" boxSize={'100px'}/> */}
        </div >
    )
}

export default EditProfilePage;