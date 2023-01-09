import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { updateProfile, updateProfileByAdmin, updatePassword } from '../../actions';
import SuccessMsg from "common/components/message/SuccessMsg";
import ErrorMsg from "common/components/message/ErrorMsg";
import { isEmail, isEmpty, isMatch, isValidPassword } from "../../utils/validation";

const EditUser = () => {
    const location: any = useLocation();
    const navigate = useNavigate();
    console.log('location', location.state)
    const authState = useSelector((state: any) => state.authReducer);
    const tokenState = useSelector((state: any) => state.tokenReducer);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    console.log('authState.user', authState.user)
    const [formData, setFormData] = useState({
        email: location.state.email,
        id: location.state.id,
        accessType: location.state.accessType,
        success: "",
        error: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleProfileUpdate = async () => {
        try {
            const data = await updateProfile(formData);
            console.log('data', data);

            setFormData(formData => ({ ...formData, success: data.msg, error: '' }));
        }
        catch (error: any) {
            error && setFormData({ ...formData, error, success: '' });

        }
    }

    const handlePasswordUpdate = async () => {
        if (!isValidPassword(formData.password)) {
            return setFormData(formData => ({ ...formData, error: "Password must be at least 4 characters.." }));
        }
        if (!isMatch(formData.password, formData.passwordConfirm)) {
            return setFormData(formData => ({ ...formData, error: "Passwords are not matching.." }));
        }

        try {
            const data = await updatePassword(formData.password, formData.id);
            setFormData(formData => ({ ...formData, success: data.msg, error: '' }));
        }
        catch (error: any) {
            error && setFormData({ ...formData, error, success: '' });
        }
    }

    const handleSubmit = async () => {
        console.log('formData', formData)
        if (formData.password) handlePasswordUpdate();
        handleProfileUpdate();
    }

    const back = () => {
        navigate('/member');
    }

    return (
        <div className="account" style={{overflow: 'auto',}}>
            <Stack w={'30%'} spacing={'20px'} margin={'auto'} paddingTop={'80px'}>
                {formData.success ? <SuccessMsg message={formData.success} /> : ''}
                {formData.error ? <ErrorMsg message={formData.error} /> : ''}
                <Heading textAlign={'center'} size={'xl'} paddingBottom={'30px'}>Update User Account</Heading>
                <Input defaultValue={formData.email} onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'email'} name='email' placeholder='Email' />
               {formData.accessType  == 0 ? [
                 <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'password'} name='password' placeholder='Password' />,
                 <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'password'} name='passwordConfirm' placeholder='Password Confirm' />
               ]: ''}
                <Button onClick={handleSubmit} colorScheme='green' fontSize='md' marginTop={'20px !important'}>Update</Button>
                <Button onClick={back} colorScheme='red' fontSize='md' marginTop={'20px !important'}>Back</Button>
            </Stack>
        </div>
    )
}

export default EditUser