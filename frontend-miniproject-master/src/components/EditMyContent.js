import { FormControl, FormLabel, Input, Image, Button, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from '@chakra-ui/icons'


const EditMyContent = () => {

    // const [idContent, setIdCpntent] = useState('')
    const [content, setContent] = useState([])
    const [caption, setCaption] = useState('')
    // const [value, setValue] = useState(content)

    const navigation = useNavigate()

    useEffect(() => {

        if (!localStorage.getItem('idContent')) {
            return navigation("/my-content")
        }

        // setIdCpntent(JSON.parse(localStorage.getItem('idContent')))
        if (!caption) {
            handleMyContent(JSON.parse(localStorage.getItem('idContent')))
        }
    }, [])

    // useEffect(() => {

    //     setCaption(content.caption)

    // },[content])

    const handleMyContent = async (value) => {
        const id = value

        await axios.post("http://localhost:5000/content/my-one-content", {
            id
        })
            .then((result) => {
                console.log(result);
                setContent(`http://localhost:5000/${result.data.result.content_pic}`)
                setCaption(result.data.result.caption)
            }).catch((err) => {
                console.log(err);
            });
    }

    const handleEditCaption = async (id, caption) => {

        // console.log(caption);
        await axios.post("http://localhost:5000/content/update-caption", {
            caption,
            id
        })
            .then((result) => {
                console.log(result);
                window.location.reload()
            }).catch((err) => {
                console.log(err);
            });

    }

    const handleDeleteContent = async (content) => {
        console.log('pressed');
        await axios.delete(`http://localhost:5000/content/delete/${content}`)
        .then((result) => {
            console.log(result);
            console.log('done');
            window.location.reload()
            localStorage.removeItem('idContent')
        }).catch((err) => {
            console.log(err);
        });
    } 

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '94vh', justifyContent: 'center' }}>
            <Image src={content} style={{ borderRadius: '20px', maxWidth: '600px' }} />
            <FormControl>
                <FormLabel>Edit Caption</FormLabel>
                <Input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </FormControl>
            <Stack>
                <Button onClick={() => handleEditCaption(JSON.parse(localStorage.getItem('idContent')), caption)}>Save Edit Caption</Button>
                <Button onClick={() => handleDeleteContent(JSON.parse(localStorage.getItem('idContent')))}>Delete Content</Button>
                <Button leftIcon={<ArrowBackIcon />} onClick={() => navigation('/my-content')}>Back</Button>
            </Stack>
        </div>
    )
}


export default EditMyContent;