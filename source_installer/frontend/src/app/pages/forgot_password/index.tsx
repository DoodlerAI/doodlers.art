import { useState } from 'react'
import { Input, Button, Heading, Stack, Text } from '@chakra-ui/react'
import SuccessMsg from "common/components/message/SuccessMsg";
import ErrorMsg from "common/components/message/ErrorMsg";
import { isEmail } from "../../utils/validation";
import { forgotPassword } from "../../actions";
import "./index.scss";

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: "",
        success: "",
        error: ""
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!isEmail(formData.email)) {
            return setFormData({ ...formData, error: "Invalid email", success: "" });
        }

        try {
            const data = await forgotPassword(formData.email);
            localStorage.setItem('oldEmail', formData.email)
            return setFormData({ ...formData, error: "", success: data.msg });
        }
        catch (error: any) {
            error && setFormData({ ...formData, error: error, success: "" });
        }

    }


    return (
        <div className="forgot-password">
            <Stack w={'30%'} spacing={'20px'} margin={'auto'} paddingTop={'100px'}>
                {formData.success ? <SuccessMsg message={formData.success} /> : ''}
                {formData.error ? <ErrorMsg message={formData.error} /> : ''}
                <Heading paddingBottom={'30px'}>Forgot your password?</Heading>
                <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} name="email" type={'email'} placeholder='Enter your email address.' />
                <Button onClick={handleSubmit} colorScheme='green' fontSize='md'>Verify your email</Button>
            </Stack>
        </div>
    )
}

export default ForgotPassword