import { ChevronRightIcon } from "@chakra-ui/icons";
import {
    Button,
    FormControl,
    Input,
    Stack,
    Image,
    Text,
    InputGroup,
    InputRightElement,
    Th,
    Td,
    Tfoot,
    Tr,
    TableContainer,
    Table,
    TableCaption,
    Thead,
    Tbody,
    Avatar,
    Box
} from "@chakra-ui/react";
// import { AiOutlineUser } from '@chakra-ui/icons'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { dotenv } from 'dotenv'
// dotenv.config()


const HomePage = () => {

    const navigation = useNavigate()

    const [userData, setUserData] = useState([])
    const [isVerified, setIstVerified] = useState(false)
    const [sending, setSending] = useState(false)
    const [allContent, setAllContent] = useState([])
    const [comm, setComm] = useState(allContent.map(() => ''));
    const [allComm, SetAllComm] = useState([])
    const [commenter, setCommenter] = useState([])
    const [userPic, setUserPic] = useState([])
    // const [numList, setNumList] = useState(Array(allContent.length).fill(0));
    // const [idContent, setIdContent] = useState(Array(allContent.length).fill(0));
    const [likeIsSend, setLikeIsSend] = useState(false)
    const [numList, setNumList] = useState(0);
    const [idContent, setIdContent] = useState(0);
    const [dataComment, setDataComment] = useState([])

    // const [idCon, setIdCOn] = useState('')





    useEffect(() => {
        allContentLike()
        const prosesData = async () => {

            if (!localStorage.getItem("userLogins")) return navigation("/login")
            setUserData(JSON.parse(localStorage.getItem("userLogins")))
            localStorage.removeItem('idContent')
            await getAllContent()
            getAllComment()
        }
        prosesData()
        // allContentLike()

        // console.log(numList);
    }, [])

    useEffect(() => {
        console.log(dataComment);
    }, [dataComment])


    const allContentLike = async () => {

        await axios.get("http://localhost:5000/content/data-like")
            .then((result) => {
                console.log(result);
                setDataComment(result.data.data)
            }).catch((err) => {
                console.log(err);
            });

    }

    useEffect(() => {

        setIstVerified(userData["is_verified"])
        // console.log(userData.id);


    }, [userData])

    const getAllComment = async () => {
        // console.log('comment');
        await axios.get('http://localhost:5000/content/all-comment')
            .then((result) => {
                console.log(result);
                setCommenter(result.data.coba)
                SetAllComm(result.data.result)
                setUserPic(result.data.commenterPic)
            }).catch((err) => {
                console.log(err);
            });

    }

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
                // console.log(result);
                setSending(false)
            }).catch((err) => {
                console.log(err);
                setSending(false)
            });

    }

    const getAllContent = async () => {

        await axios.get('http://localhost:5000/content/all-content')
            .then((result) => {
                // console.log(result);
                setAllContent(result.data.data)
            }).catch((err) => {
                console.log(err);
            });

    }
    // useEffect(() => {
    //     // const lastIndex = numList.length - 1;
    //     // if (numList[lastIndex] === 1) {
    //     //     console.log("numList has changed to 1");
    //     // }
    //     console.log(numList);
    // }, [numList]);


    // const handleChangeForm = (id, value) => {

    //     setComm((comment) => ({ ...comment, [id]: value, }))

    // }

    const sendComment = async (value) => {

        const id_user_logins = userData.id
        const id_content_tables = value
        const comment = comm[value]
        if (comment.length > 0) {

            await axios.post('http://localhost:5000/content/add-comment', {
                comment,
                id_content_tables,
                id_user_logins
            })
                .then((result) => {
                    console.log(result);
                }).catch((err) => {
                    console.log(err);
                });
        }

    }



    // const valuebaru = userData.id
    const handleLike = (id) => {

        setIdContent(id)
        setNumList(userData.id)
    };

    // useEffect(() => {
    //     console.log(idContent);
    // },[idContent])

    // useEffect(() => {
    //     console.log(numList);
    // },[numList])

    useEffect(() => {

        if (idContent != 0 || numList != 0) {
            sendLike(idContent, numList)
        }

    }, [idContent, numList])

    const sendLike = async (id_content_tables, id_user_logins) => {

        // console.log(id_content_tables);
        // console.log(id_user_logins);
        setLikeIsSend(true)
        await axios.post('http://localhost:5000/content/like', {
            id_content_tables,
            id_user_logins
        })
            .then((result) => {
                console.log(result);
                setLikeIsSend(false)
                setIdContent(0)
                setNumList(0)
            }).catch((err) => {
                console.log(err);
                setLikeIsSend(false)
                setIdContent(0)
                setNumList(0)
            });

    }

    let showContent = allContent.map((el, index) => {
        const updatedAt = new Date(el.updatedAt).toLocaleString();

        // let arrComments = allComm.filter((data) => data.id_content_tables === el.id)

        // let uniqueCommenter = commenter.filter((commenter, index, self) => {
        //     return self.findIndex((c) => c.id === commenter.id) === index;
        // });

        let uniqeLike = dataComment.filter((l) => l.id_content_tables === el.id)
        // console.log(uniqeLike);

        // let uniquePic = userPic.filter((userPic, index, self) => {
        //     return userPic !== null && self.findIndex((c) => c.id_user_logins === userPic.id_user_logins) === index;
        // });


        const goToContent = (id) => {

            localStorage.setItem('idContent', JSON.parse(id))
            navigation('/detile-content')

        }

        return (
            <div key={el.id} style={{ backgroundColor: '#82AAE3', width: '1200px', display: 'flex', flexDirection: 'column', padding: '100px', marginTop: '50px', marginBottom: '50px', borderRadius: '20px' }}>


                <Text></Text>
                <Box onClick={() => goToContent(el.id)} cursor="pointer">
                    <Image src={`http://localhost:5000/${el.content_pic}`} style={{ borderRadius: '20px', minWidth: '1000px' }} />
                </Box>
                <Text>CAPTION : {el.caption}</Text>
                <Text style={{ display: 'flex' }}>
                </Text>
                <Text>Uploaded at: {updatedAt}</Text>
                <Stack direction={'row'} style={{ display: 'flex', justifyContent: 'center' }}>
                    {likeIsSend ? (
                        <Button isLoading></Button>
                    ) : (
                        <Button style={{ marginLeft: '50px', marginRight: '50px', minWidth: '300px' }} onClick={() => handleLike(el.id)}>
                            Like {uniqeLike.length}
                            {/* <Text>{idUser ? userData.id : null}</Text> */}
                        </Button>
                    )
                    }
                    <Button onClick={() => goToContent(el.id)} style={{ marginLeft: '50px', marginRight: '50px', minWidth: '300px' }}>Comment</Button>
                </Stack>
                <TableContainer>
                    <Table variant='simple'>
                        <Tbody>
                            <Tr>
                                {/* {comments} */}
                                {/* <Td>komen</Td> */}
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </div >
        )
    })
    // useEffect(() => {

    // },[allContent])



    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            {isVerified ? (
                null
            ) : (
                <Stack style={{ backgroundColor: '#82AAE3', width: '100%' }}>
                    <h1 style={{ display: 'flex', justifyContent: 'center', width: '100%', color: 'white' }}>your account is not verified!</h1>
                    <h1 style={{ display: 'flex', justifyContent: 'center', width: '100%', color: 'white' }}>please check your email and click the link for verified, click the button below if your link is expired</h1>

                    {sending ? (
                        <Button
                            isLoading
                            loadingText='email is on sending'
                        >
                        </Button>
                    ) : (
                        <Button onClick={() => handleSendLink()} >Send verification</Button>

                    )}
                </Stack>
            )}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* <FormControl style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Input variant={'outline'} type="text" style={{ width: "80%" }} />
                </FormControl> */}
                <Stack style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {showContent}
                </Stack>
            </div>

        </div>
    )
}

export default HomePage;