import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { Link, useNavigate } from "react-router-dom";
import SuccessMsg from "common/components/message/SuccessMsg";
import ErrorMsg from "common/components/message/ErrorMsg";
import { getLoginAction } from "../../actions/actionsTypes";
import { postRegisterData, postRegisterDataByGmail } from "../../actions";
import { signUpWithGmail } from "../../services/firebase";
import "./index.scss";
import { isEmail, isEmpty, isMatch, isValidPassword } from "../../utils/validation";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
        success: "",
        error: ""
    });

    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: any) => {
        console.log(formData)
        e.preventDefault();

        if (isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.passwordConfirm)) {
            return setFormData({ ...formData, error: "Please fill in all fields.", success: "" });
        }

        if (!isEmail(formData.email)) {
            return setFormData({ ...formData, error: "Invalid Email..", success: "" });
        }

        if (!isValidPassword(formData.password)) {
            return setFormData({ ...formData, error: "Password must be atleast 4 characters..", success: "" });
        }

        if (!isMatch(formData.password, formData.passwordConfirm)) {
            return setFormData({ ...formData, error: "Passwords are not matching..", success: "" });
        }

        try {
            const { email, password } = formData;
            const data = await postRegisterData({ email, password });
            console.log('data', data)
            setFormData({ ...formData, error: "", success: data.msg });
        }
        catch (error: any) {
            console.log('error', error)
            error && setFormData({ ...formData, error, success: "" });
        }
    }

    const handleSignUpWithGmail = async () => {
        try {
            const res: any = await signUpWithGmail();
            const { email, emailVerified }: { email: string, emailVerified: any } = res.user;
            console.log('data', email, emailVerified)

            if (emailVerified) {
                setIsVerified(emailVerified)
                setFormData({
                    ...formData,
                    email,
                    error: "",
                    success: "Please fill in the form below"
                })

                const data = await postRegisterDataByGmail({ email });
                console.log('handleSignUpWithGmail', data);
                setFormData({ ...formData, error: "", success: data.msg });

                dispatch(getLoginAction());
                navigate("/");
            }
        } catch (error: any) {
            console.log('error', error)
            setFormData({ ...formData, error, success: "" })
        }
    }

    return (
        <div className="register" style={{overflow: 'auto',}}>
            <Stack w={'30%'} spacing={'20px'} margin={'auto'} paddingTop={'80px'}>
                {formData.success ? <SuccessMsg message={formData.success} /> : ''}
                {formData.error ? <ErrorMsg message={formData.error} /> : ''}
                <Heading size={'xl'} paddingBottom={'30px'}>Register</Heading>
                <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'email'} name='email' placeholder='Email' />
                <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'password'} name='password' placeholder='Password' />
                <Input onChange={handleChange} focusBorderColor='none' _placeholder={{ opacity: 1, color: 'gray.500' }} type={'password'} name='passwordConfirm' placeholder='Password Confirm' />
                <Button onClick={handleSubmit} colorScheme='green' fontSize='md'>Register</Button>
                <Text marginTop={'6px !important'} style={{ color: 'grey' }}>
                    or
                </Text>
                <Button onClick={handleSignUpWithGmail} colorScheme='red' fontSize='md' marginTop={'6px !important'}>Sign up with Gmail</Button>
                <p style={{ color: 'grey' }}> <Link style={{ textDecoration: 'underline', marginLeft: '10px' }} to="/login">Already have an account?</Link> </p>
            </Stack>
        </div>
    )
}

export default Register