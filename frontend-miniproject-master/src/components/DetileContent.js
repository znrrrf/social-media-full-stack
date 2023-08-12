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
    Avatar
} from "@chakra-ui/react";
// import { AiOutlineUser } from '@chakra-ui/icons'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DetileContent = () => {


    const navigation = useNavigate()

    const [contentData, setContentData] = useState(null)
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
    const [dataContent, setDataContent] = useState([])
    const [dummy, setDummy] = useState(null)
    const [dataComment, setDataComment] = useState([])
    const [dataUsername, setDataUsername] = useState([])
    // const [idCon, setIdCOn] = useState('')




    useEffect(() => {
        getUsername()
        const prosesData = async () => {

            allContentLike()
            if (!localStorage.getItem("idContent")) return navigation("/login")
            setUserData(JSON.parse(localStorage.getItem("userLogins")))
            await getAllContent()
            setContentData(JSON.parse(localStorage.getItem("idContent")))
            getAllComment()

            // localStorage.removeItem('idContent')
        }


        prosesData()
        // console.log(numList);
    }, [])

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
        console.log(contentData);
        if (contentData != 0 && contentData != null) {
            getContent(contentData)
            getUserId(contentData)

        }
    }, [contentData])

    const getContent = async (contentData) => {

        await axios.post('http://localhost:5000/content/detile-content', {
            contentData
        })
            .then((result) => {
                console.log(result);
                setDataContent(result.data.result)
            }).catch((err) => {
                console.log(err);
            });

    }

    // useEffect(() => {

    //     setIstVerified(userData["is_verified"])
    //     console.log(dummy);


    // }, [dummy])

    const getAllComment = async () => {
        // console.log('comment');
        await axios.get('http://localhost:5000/content/all-comment')
            .then((result) => {
                console.log(result.data.result);
                setCommenter(result.data.coba)
                SetAllComm(result.data.result)
                // setDummy(result.data.result)
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
                // console.log(err);
                setSending(false)
            });

    }

    const getAllContent = async () => {

        await axios.get('http://localhost:5000/content/all-content')
            .then((result) => {
                // console.log(result);
                setAllContent(result.data.data)
            }).catch((err) => {
                // console.log(err);
            });

    }
    // useEffect(() => {
    //     // const lastIndex = numList.length - 1;
    //     // if (numList[lastIndex] === 1) {
    //     //     console.log("numList has changed to 1");
    //     // }
    //     console.log(numList);
    // }, [numList]);


    const handleChangeForm = (id, value) => {

        setComm((comment) => ({ ...comment, [id]: value, }))

    }

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
                    window.location.reload()
                }).catch((err) => {
                    console.log(err);
                });
        }

    }

    // const valuebaru = userData.id
    const handleLike = (id) => {
        // setNumList((prevNumList) => {
        //     const newList = [...prevNumList]
        //     console.log(id);
        //     newList[index] = newList[index] === userData.id ? 0 : userData.id
        //     return newList;
        // });

        // setIdContent((prevIdContent) => {
        //     const newId = [...prevIdContent]
        //     newId[index] = newId[index] === id ? 0 : id
        //     return newId
        // })

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

        // console.log(idContent);
        // console.log(numList);
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
                window.location.reload()
            }).catch((err) => {
                console.log(err);
                setLikeIsSend(false)
                setIdContent(0)
                setNumList(0)
            });

    }





    const updatedAt = new Date(dataContent.updatedAt).toLocaleString();

    let arrComments = allComm.filter((data) => data.id_content_tables === dataContent.id)
    console.log(dataContent);
    let uniqueCommenter = commenter.filter((commenter, index, self) => {
        return self.findIndex((c) => c.id === commenter.id) === index;
    });

    let uniqeLike = dataComment.filter((l) => l.id_content_tables === dataContent.id)

    let uniquePic = userPic.filter((userPic, index, self) => {
        return userPic !== null && self.findIndex((c) => c.id_user_logins === userPic.id_user_logins) === index;
    });

    let comments = arrComments.map((elem) => {

        let whoComment = uniqueCommenter.find((nam) => nam.id === elem.id_user_logins);
        let whoPic = uniquePic.find((pic) => pic.id_user_logins === elem.id_user_logins);
        // console.log(whoPic);

        let inputCommenter = whoComment ? (

            <Text margin={'10px'}>{whoComment.username}:</Text>
        ) : null;

        let inputPic = whoPic ? (
            <Avatar bg='red.500' src={`http://localhost:5000/${whoPic.pic}`} />
        ) : <Avatar bg='red.500' />


        return (
            <Td key={elem.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                {inputPic}
                {inputCommenter}
                <Text>{elem.comment}</Text>
            </Td>
        )
    })

    // const handleLike = (id) => {

    //     setIdContent(id)
    //     setNumList(userData.id)
    // };

    const [idForContent, getIdForContent] = useState(null)

    const getUserId = async (id) => {

        await axios.post('http://localhost:5000/content/get-id',{
            id
        })
        .then((result) => {
            console.log(result.data.result.id_user_logins);
            getIdForContent(result.data.result.id_user_logins)
        }).catch((err) => {
            console.log(err);
        });

    }


    const getUsername = async () => {

        await axios.get('http://localhost:5000/user/all-user')
            .then((result) => {
                console.log(result);
                setDataUsername(result.data.data)
            }).catch((err) => {
                console.log(err);
            });

    }

    const [usernameContent, setUsernameContent] = useState(null)
    useEffect(() => {

        // console.log(dataUsername);
        if (dataUsername && dataUsername.length > 0 && contentData != null) {


            for (let i = 0; i < dataUsername.length; i++) {
                if (dataUsername[i].id === idForContent) {
                    // console.log(dataUsername[i].username);
                    setUsernameContent(dataUsername[i].username)
                    break;
                }
            }
        }

    }, [dataUsername])

    console.log(usernameContent);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h1>This is the dile content</h1>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <Stack style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button onClick={() => navigation('/')}>Back</Button>
                    <div style={{ backgroundColor: '#82AAE3', width: '1200px', display: 'flex', flexDirection: 'column', padding: '100px', marginTop: '50px', marginBottom: '50px', borderRadius: '20px' }}>
                        <Text>{usernameContent}</Text>
                        
                        <Image src={`http://localhost:5000/${dataContent.content_pic}`} style={{ borderRadius: '20px' }} />
                        <Text>CAPTION : {dataContent.caption}</Text>

                        <Text style={{ display: 'flex' }}>

                        </Text>
                        <Text>Uploaded at: {updatedAt}</Text>
                        {likeIsSend ? (
                            <Button isLoading></Button>
                        ) : (
                            <Button style={{ marginLeft: '50px', marginRight: '50px', minWidth: '300px' }} onClick={() => handleLike(contentData)}>
                                Like {uniqeLike.length}
                            </Button>
                        )
                        }
                        <InputGroup>
                            <FormControl>
                                <Input value={comm[dataContent.id] || ''} onChange={(e) => handleChangeForm(dataContent.id, e.target.value)} placeholder="type here to comment..." type='Text' />
                            </FormControl>
                            <InputRightElement>
                                <Button rightIcon={<ChevronRightIcon />} onClick={() => sendComment(dataContent.id)} />
                            </InputRightElement>
                        </InputGroup>
                        <TableContainer>
                            <Table variant='simple'>
                                <Tbody>
                                    <Tr>
                                        {comments}
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div >
                </Stack>
            </div>

        </div>
    )
}

export default DetileContent