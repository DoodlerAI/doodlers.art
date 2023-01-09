import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import SuccessMsg from 'common/components/message/SuccessMsg';
import ErrorMsg from 'common/components/message/ErrorMsg';
import {
  getLoginAction,
  getSaveProfileAction,
} from '../../actions/actionsTypes';
import { postLoginData } from '../../actions';
import { signUpWithGmail } from '../../services/firebase';
import './index.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    password: '',
    success: '',
    error: '',
  });
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const data = await postLoginData({
        email: formData.email,
        password: formData.password,
      });
      setFormData({ ...formData, error: '', success: data.msg });

      dispatch(getLoginAction());
      dispatch(
        getSaveProfileAction({
          email: formData.email,
          password: formData.password,
          accessType: 0,
          id: data.id,
          role: data.role,
        })
      );
      navigate('/home');
    } catch (error: any) {
      console.log('error', error);
      error && setFormData({ ...formData, error, success: '' });
      // setLoading(false);
    }
  };

  const handleSignInWithGmail = async () => {
    const res: any = await signUpWithGmail();
    const { email, emailVerified }: { email: string; emailVerified: any } =
      res.user;

    if (emailVerified) {
      setIsVerified(emailVerified);
      try {
        const data = await postLoginData({ email, password: '1234' });
        setFormData({ ...formData, email, error: '', success: data.msg });
        dispatch(
          getSaveProfileAction({
            email,
            accessType: 0,
            id: data.id,
            role: data.role,
          })
        );
        dispatch(getLoginAction());
        navigate('/home');
      } catch (error: any) {
        error && setFormData({ ...formData, error, success: '' });
      }
    }
  };

  return (
    <div className="login" style={{ overflow: 'auto' }}>
      <Stack w={'30%'} spacing={'20px'} margin={'auto'} paddingTop={'80px'}>
        {/* <SuccessMsg message={'success msg'} /> */}
        {formData.error ? <ErrorMsg message={formData.error} /> : ''}
        <Heading size={'xl'} paddingBottom={'30px'}>
          Login
        </Heading>
        <Input
          onChange={handleChange}
          focusBorderColor="none"
          _placeholder={{ opacity: 1, color: 'gray.500' }}
          type={'email'}
          name="email"
          placeholder="Email"
        />
        <Input
          onChange={handleChange}
          focusBorderColor="none"
          _placeholder={{ opacity: 1, color: 'gray.500' }}
          type={'password'}
          name="password"
          placeholder="Password"
        />
        <p>
          <Link
            to="/forgot-password"
            style={{ color: 'grey', textDecoration: 'underline' }}
          >
            Forgot your password?
          </Link>
        </p>
        <Button onClick={handleSubmit} colorScheme="green" fontSize="md">
          Login
        </Button>
        <Text marginTop={'6px !important'} style={{ color: 'grey' }}>
          or
        </Text>
        <Button
          onClick={handleSignInWithGmail}
          colorScheme="red"
          fontSize="md"
          marginTop={'6px !important'}
        >
          Log in with Gmail
        </Button>
        <p style={{ color: 'grey' }}>
          {' '}
          New User?
          <Link
            style={{ textDecoration: 'underline', marginLeft: '10px' }}
            to="/register"
          >
            Register
          </Link>{' '}
        </p>
      </Stack>
    </div>
  );
};

export default Login;
