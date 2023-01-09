import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { Link, useNavigate } from "react-router-dom";
import SuccessMsg from "common/components/message/SuccessMsg";
import ErrorMsg from "common/components/message/ErrorMsg";
import { getLoginAction } from "../../actions/actionsTypes";
import { resetPassword } from "../../actions";
import { isEmpty, isMatch, isValidPassword } from "../../utils/validation";

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: "",
        passwordConfirm: "",
        success: "",
        error: ""
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!isValidPassword(formData.password)) {
            return setFormData({ ...formData, error: "Password length should be atleast 4", success: "" });
        }

        if (!isMatch(formData.password, formData.passwordConfirm)) {
            return setFormData({ ...formData, error: "Passwords are not matching", success: "" });
        }

        try {
            const email = localStorage.getItem('oldEmail')
            const data = await resetPassword(formData.password, email);
            return setFormData({ ...formData, error: "", success: data.msg });
        }
        catch (error: any) {
            error && setFormData({ ...formData, error: error, success: "" });
        }
    }

    return (
        <div className="reset-password">
            <Stack w={'30%'} spacing={'20px'} margin={'auto'} paddingTop={'80px'}>
                {formData.success ? <SuccessMsg message={formData.success} /> : ''}
                {formData.error ? <ErrorMsg message={formData.error} /> : ''}
                <Heading size={'xl'} paddingBottom={'30px'} textAlign={"center"}>Enter New Password</Heading>
                <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'password'} name='password' placeholder='Password' />
                <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'password'} name='passwordConfirm' placeholder='Password Confirm' />
                <Button onClick={handleSubmit} colorScheme='green' fontSize='md'>Reset Password</Button>
            </Stack>
        </div>
    )
}

export default ResetPassword