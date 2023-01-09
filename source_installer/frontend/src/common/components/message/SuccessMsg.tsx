import {
    Alert,
    AlertIcon
} from '@chakra-ui/react'

type SuccessMsgProps = {
    message: string
}

const SuccessMsg = ({ message }: SuccessMsgProps) => {
    return (
        <Alert color={'rgb(10, 10, 14)'} status='success'>
            <AlertIcon />
            {message}
        </Alert>
    )
}

export default SuccessMsg