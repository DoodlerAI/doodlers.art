import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Input, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { updateProfile, updatePassword } from '../../actions';
import { getSaveProfileAction } from '../../actions/actionsTypes';
import SuccessMsg from "common/components/message/SuccessMsg";
import ErrorMsg from "common/components/message/ErrorMsg";
import { isEmail, isEmpty, isMatch, isValidPassword } from "../../utils/validation";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const auth: any = useSelector((state: any) => state.authReducer)
    const { user } = auth;
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        console.log('user', user)
    }, [])

    const [formData, setFormData] = useState({
        email: user.email,
        password: "",
        passwordConfirm: "",
        success: "",
        error: "",
        id: user.id
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleProfileUpdate = async () => {
        try {
            const data = await updateProfile(formData);
            console.log('data', data);

            setFormData(formData => ({ ...formData, success: data.msg, error: '' }));
            dispatch(getSaveProfileAction({ ...formData }));
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
        dispatch(getSaveProfileAction({ ...formData }));
    }

    const back = () => {
        navigate('/');
    }

    return (
        <div className="account" style={{overflow: 'auto',}}>
            <Stack w={'30%'} spacing={'20px'} margin={'auto'} paddingTop={'80px'}>
                {formData.success ? <SuccessMsg message={formData.success} /> : ''}
                {formData.error ? <ErrorMsg message={formData.error} /> : ''}
                <Heading textAlign={'center'} size={'xl'} paddingBottom={'30px'}>Update My Account</Heading>
                <Input defaultValue={formData.email} onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'email'} name='email' placeholder='Email' />
                {user.accessType == 1 ? '' : (
                    <>
                        <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'password'} name='password' placeholder='Password' />
                        <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'password'} name='passwordConfirm' placeholder='Password Confirm' />
                    </>
                )}
                <Button onClick={handleSubmit} colorScheme='green' fontSize='md' marginTop={'20px !important'}>Update</Button>
                <Button onClick={back} colorScheme='red' fontSize='md' marginTop={'20px !important'}>Back</Button>
            </Stack>
        </div>
    )
}

export default Account