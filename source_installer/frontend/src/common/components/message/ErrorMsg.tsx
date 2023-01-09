import {
    Alert,
    AlertIcon
} from '@chakra-ui/react'

type ErrorMsgProps = {
    message: string
}

const ErrorMsg = ({ message }: ErrorMsgProps) => {
    return (
        <Alert color={'rgb(10, 10, 14)'} status='warning'>
            <AlertIcon />
            {message}
        </Alert>
    )
}

export default ErrorMsg