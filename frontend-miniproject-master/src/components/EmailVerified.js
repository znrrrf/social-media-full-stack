import { Button, Card } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'


const EmailVerified = () => {

    const navigation = useNavigate();

    return (
        <div className="verif-con">
            <div className="verif-box">
                <h1>THANK YOU FOR THE VERIFICATION</h1>
                <Button colorScheme="cyan" onClick={() => navigation('/login')}>Goes to log in</Button>
            </div>
        </div>
    )
}

export default EmailVerified