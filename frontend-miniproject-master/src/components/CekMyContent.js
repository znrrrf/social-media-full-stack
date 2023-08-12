import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Image,
    Text,
    Button,
    FormControl,
    Input,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'




const CekMyContent = () => {

    const [userData, SetUserData] = useState([])

    const navigation = useNavigate()


    useEffect(() => {

        if (!localStorage.getItem('userLogins')) {
            return navigation('/login')
        }

        getMyContent(JSON.parse(localStorage.getItem('userLogins')).id)
    }, [])

    const getMyContent = async (myId) => {
        // console.log(myId);

        await axios.post("http://localhost:5000/content/my-content", {
            myId
        })
            .then((result) => {
                // console.log(result);
                SetUserData(result.data.result)
            }).catch((err) => {
                console.log(err);
            });

    }

    useEffect(() => {
        console.log(userData);
    }, [userData])

    // let showContent = userData.map((el) => {
    //     const updatedAt = new Date(el.updatedAt).toLocaleString();
    //     return (
    //         <div key={el.id} style={{ backgroundColor: '#EAFDFC', width: '1200px', display: 'flex', flexDirection: 'column', padding: '100px', marginTop: '50px', marginBottom: '50px', borderRadius: '20px' }}>
    //             <Image src={`http://localhost:5000/${el.content_pic}`} style={{ borderRadius: '20px' }} />
    //             <Text>{el.caption}</Text>
    //             <Text style={{ display: 'flex' }}>
    //                 <Button width={'100px'} rightIcon={el.like_point}>Like</Button>
    //                 {/* <Text>{el.like_point}</Text> */}
    //             </Text>
    //             <Text>{updatedAt}</Text>
    //             <FormControl>
    //                 <Input type='Text' />
    //             </FormControl>
    //         </div>
    //     )
    // })

    const handleEditContent = (value) => {

        // console.log(value);
        localStorage.setItem("idContent", JSON.stringify(value))
        navigation('/edit-content')

    }

    let counter = 1

    let showMyCaption = userData.map((el) => {

        return (
                <Tr key={el.id}>
                    <Td>{counter++}</Td>
                    <Td>
                    <Image src={`http://localhost:5000/${el.content_pic}`} width={'200px'}/>
                    </Td>
                    <Td>{el.caption}</Td>
                    <Td>
                        {/* <Button onClick={() => navigation('/detile-content')}>Detile Content</Button> */}
                        <Button onClick={() => handleEditContent(el.id)}>Edit</Button>
                    </Td>
                </Tr>
        
        )
    })

    return (
        <div>
            <h1>My Content</h1>
            {/* {showContent} */}
            <TableContainer>
                <Table variant='striped' colorScheme='teal'>
                    <Thead>
                        <Tr>
                            <Th>No</Th>
                            <Th>Media</Th>
                            <Th>Caption</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {showMyCaption}
                    </Tbody>

                </Table>
            </TableContainer>
        </div>
    )

}


export default CekMyContent;