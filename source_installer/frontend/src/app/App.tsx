import { useState, useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { useDispatch, useSelector } from 'react-redux';

import { keepGUIAlive } from './utils';
import useToastWatcher from 'features/system/hooks/useToastWatcher';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Doodler from './pages/doodler';
import Profile from './pages/profile';
import FAQ from './pages/faq';
import Gallery from './pages/gallery';
import Home from './pages/home';
import Member from './pages/member';
import Report from './pages/report';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot_password';
import Account from './pages/account';
import EditUser from './pages/edit-user';
import AccountActivation from './pages/account_activation';
import ResetPassword from './pages/reset_password';
import ImageDetail from './pages/image_detail';
import Layout from './pages/layout';
import {
  getSaveTokenAction,
  getLoginAction,
  getSaveProfileAction,
} from './actions/actionsTypes';
import { renewAccessToken, getProfile } from './actions';
import { useColorMode, VStack } from '@chakra-ui/react';
import { setCurrentTheme } from 'features/options/store/optionsSlice';

keepGUIAlive();

const App = () => {
  useToastWatcher();

  const [adBlock, setAdBlock] = useState(false);
  const dispatch = useDispatch();

  const authState = useAppSelector((state: any) => state.authReducer);
  const tokenState = useAppSelector((state: any) => state.tokenReducer);

  const disableAdBlock = () => {
    location.reload();
  };

  const { setColorMode } = useColorMode();
  const appDispatch = useAppDispatch();
  const currentTheme = useAppSelector(
    (state: RootState) => state.options.currentTheme
  );

  useEffect(() => {
    setColorMode(currentTheme);
    appDispatch(setCurrentTheme(currentTheme));
  }, []);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      console.log('authState.isLoggedIn', authState.isLoggedIn);
      if (!authState.isLoggedIn) {
        console.log('log out');
      }
    };
    checkUserLoggedIn();
  }, [authState.isLoggedIn]);

  useEffect(() => {
    const saveToken = async () => {
      if (authState.isLoggedIn) {
        // const data = await renewAccessToken();
        // console.log('data.accessToken', data.accessToken)
        // dispatch(getSaveTokenAction(data.accessToken));
      }
    };
    saveToken();
  }, [authState.isLoggedIn]);

  useEffect(() => {
    const saveProfile = async () => {
      if (tokenState) {
        dispatch(getLoginAction());
        const data = await getProfile(tokenState);
        dispatch(getSaveProfileAction(data.user));
      }
    };
    saveProfile();
  }, [tokenState]);

  useEffect(() => {
    const fakeAd = document.createElement('div');
    fakeAd.className =
      'textads banner-ads banner_ads ad-unit ad-zone ad-space adsbox';

    fakeAd.style.height = '1px';

    document.body.appendChild(fakeAd);

    const x_width = fakeAd.offsetHeight;

    if (x_width) {
      setAdBlock(false);
      console.log('No AdBlocker Detected');
    } else {
      setAdBlock(true);
      console.log('AdBlocker detected');
    }
  }, [adBlock]);

  return (
    <>
      {!adBlock ? (
        <div className="App">
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/home" element={<Home />} />
                {authState.user.role == 'admin' ? (
                  <>
                    <Route path="/member" element={<Member />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/editUser/:id" element={<EditUser />} />
                  </>
                ) : (
                  ''
                )}
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/image-detail" element={<ImageDetail />} />
                <Route path="/profile/:email" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route
                  path="/activate-account/:activationToken"
                  element={<AccountActivation />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:accessToken"
                  element={<ResetPassword />}
                />
                <Route path="/" element={<Doodler />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </div>
      ) : (
        <>
          <div className="adblock-wrapper center" id="ads-blocked">
            <div className="adblock-content-wrapper">
              {/* <span className='adblock-close'>&times;</span> */}
              <div className="adblock-content">
                <div className="center mb-4">
                  <div className="image-container">
                    <div className="image">
                      <i className="fas fa-exclamation-circle"></i>
                      <h3>Ads</h3>
                    </div>
                  </div>
                </div>
                <div className="adblock-text">
                  <h3>Please disable your ad blocker!</h3>
                  <p>
                    We know ads are annoying but please bear with us here &
                    disable your ad blocker!
                  </p>
                </div>
                <div className="adblock-button">
                  <button className="btn" onClick={disableAdBlock}>
                    I've disabled my ad blocker!
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="example-page center">
            <h2>Please Disable Adblocker to use this service.</h2>
          </div>
        </>
      )}
    </>
  );
};

export default App;
