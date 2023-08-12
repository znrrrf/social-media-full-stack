import { Button, Card } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'


const ErrorToken = () => {

    const navigation = useNavigate();

    return (
        <div className="verif-con">
            <div className="verif-box">
                <h1>Error link expired or something, please send verification again</h1>
                <p>You can send request verification link in our home page</p>
                <Button colorScheme="cyan" onClick={() => navigation('/')}>Goes to home page</Button>
            </div>
        </div>
    )
}

export default ErrorToken