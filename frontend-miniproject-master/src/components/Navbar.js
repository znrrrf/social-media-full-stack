import {
    Stack,
    Button,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
    Popover,
    PopoverCloseButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    FormControl,
    FormLabel,
    Image,
    Text,
    Avatar
} from '@chakra-ui/react'
import { AtSignIcon, HamburgerIcon, ArrowUpIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react';
import { useNavigate, } from 'react-router-dom'
import axios from 'axios';

const Navbar = () => {

    const navigation = useNavigate();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [profile, setProfile] = useState('Log out')
    const [isLogin, setIsLogin] = useState(false)
    const [userData, setUserData] = useState('')
    const [isVerified, setIsverified] = useState(false)
    const [sending, setSending] = useState(false)
    const [content_pic, setContentPic] = useState(null)
    const [caption, setCaption] = useState('')
    const [imageProfile, setImageProfile] = useState(<Avatar bg='teal.500' />)
    // const [data, setData] = useState([])

    useEffect(() => {

        // localStorage.removeItem("userData");

        if (localStorage.getItem("profile")) {
            // console.log(JSON.parse(localStorage.getItem("userLogin")))
            // setData(JSON.parse(localStorage.getItem("userLogin")))
            setProfile(JSON.parse(localStorage.getItem("profile")))
        }

        if (localStorage.getItem("userLogins")) {
            setUserData(JSON.parse(localStorage.getItem('userLogins')))
            setIsLogin(true)
        }

        if (userData && userData.is_verified === false) {
            setIsverified(true);
        } else {
            setIsverified(false);
        }

        // localStorage.removeItem("userLogin")
    }, [])

    useEffect(() => {

        if (userData.id) {
            getPictureProfile(userData.id)
        }
    }, [userData])
    // console.log(userData.is_verified);


    // useEffect(() => {

    //     if (!data) {
    //         setIsLogin(false)
    //     } else if (data) {
    //         setIsLogin(true)
    //         setProfile(data.username)
    //     }

    // },[data])



    const handleSendLink = async () => {
        setSending(true)
        // console.log(userData["id"]);
        // console.log(userData["email"]);
        const id = userData['id']
        const email = userData['email']

        await axios.post(`http://localhost:5000/auth/resend`, {
            id,
            email
        })
            .then((result) => {
                console.log(result);
                setSending(false)
            }).catch((err) => {
                console.log(err);
                setSending(false)
            });

    }

    const handleLogout = () => {
        setProfile('log in')
        localStorage.removeItem("userLogins")
        localStorage.removeItem("profile")
        setIsLogin(false)
        navigation("/login")
        // isLogin(true)
    }

    const handleUploadContent = async () => {

        // const result = content_pic.split('.')
        // console.log(result);

        let id_user_logins = userData.id

        const formData = new FormData()
        formData.append('id_user_logins', id_user_logins)
        formData.append('content_pic', content_pic)
        formData.append('caption', caption)

        await axios.post('http://localhost:5000/content/upload-content',
            formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((result) => {
                console.log(result);
                window.location.reload()
            }).catch((err) => {
                console.log(err);
            });

    }


    const getPictureProfile = async (id) => {

        await axios.post("http://localhost:5000/user/my-bio", {
            id
        })
            .then((result) => {
                if (result.data.result && result.data.result.pic) {
                    console.log(result);
                    setImageProfile(<Image src={`http://localhost:5000/${result.data.result.pic}`} style={{ borderRadius: '50%', width: '70px', height: '70px' }} />);
                }
            }).catch((err) => {
                console.log(err);
            });

    }

    return (
        <div className='nav-con'>
            <div>
                <Button leftIcon={<AtSignIcon />} colorScheme='cyan' variant="ghost" onClick={() => navigation('/')}>Mini Project</Button>
            </div>
            <Stack direction='row' spacing={4} align='center'>
                {/* <Button colorScheme='teal' variant='outline'>
                    Button
                </Button>
                <Button colorScheme='teal' variant='outline'>
                    Button
                </Button>
                <Button colorScheme='teal' variant='outline'>
                    Button
                </Button> */}
                {isLogin ? (
                    <div>
                        <Button leftIcon={<ArrowUpIcon />} colorScheme='teal' variant={'outline'} onClick={onOpen} isLoading={isVerified}>Upload</Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Upload a Content</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <FormControl>
                                        <FormLabel>Import an image</FormLabel>
                                        <Input type='file' onChange={(e) => setContentPic(e.target.files[0])} />
                                        <FormLabel >Caption</FormLabel>
                                        <Input type='text' value={caption} onChange={(e) => setCaption(e.target.value)} />
                                    </FormControl>
                                </ModalBody>

                                <ModalFooter>
                                    <Button mr={3} onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button onClick={() => handleUploadContent()}>Upload Now</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                ) : (null)}
                {isLogin ? (
                    <div>
                        <Popover>
                            <PopoverTrigger>
                                <Button colorScheme='teal' variant='outline' rightIcon={<HamburgerIcon />}>Profile</Button>
                            </PopoverTrigger>
                            <PopoverContent className='pop-profile' width={'250px'}>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader style={{ display: "flex", flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        {imageProfile}
                                    </div>
                                    <h1 style={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', justifyContent: 'center' }}>{profile}</h1>
                                    <p>{userData.email}</p>

                                </PopoverHeader>
                                <PopoverBody>
                                    <Stack width={'220px'}>
                                        <Button variant={'ghost'} onClick={() => navigation('/edit')}>Edit Profile</Button>
                                        <Button variant={'ghost'} onClick={() => navigation('/my-content')}>My Content</Button>
                                    </Stack>
                                </PopoverBody>
                                <Button onClick={() => handleLogout()}>Log out</Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Button colorScheme='teal' variant='outline' onClick={() => handleLogout()}>
                        {profile}
                    </Button>
                )}

            </Stack>
        </div>
    )
}

export default Navbar;