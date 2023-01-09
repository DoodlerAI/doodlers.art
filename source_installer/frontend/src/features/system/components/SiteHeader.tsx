import { useEffect, useState } from 'react';
import { Link, Button } from '@chakra-ui/react';
import { Link as ReactLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'app/store';

import {
  FaGithub,
  FaDiscord,
  FaBug,
  FaKeyboard,
  FaWrench,
} from 'react-icons/fa';

import InvokeAILogo from 'assets/images/small_logo.png';
import IAIIconButton from 'common/components/IAIIconButton';

import HotkeysModal from './HotkeysModal/HotkeysModal';

import SettingsModal from './SettingsModal/SettingsModal';
import StatusIndicator from './StatusIndicator';
import ThemeChanger from './ThemeChanger';
import ModelSelect from './ModelSelect';
import { getLogoutAction } from 'app/actions/actionsTypes';
import { setPrompt } from 'features/options/store/optionsSlice';

/**
 * Header, includes color mode toggle, settings button, status message.
 */
const SiteHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector((state: any) => state.authReducer);
  const { user, isLoggedIn } = auth;
  const [showTools, setShowTools] = useState(false);
  const { requested, requests } = useSelector(
    (state: any) => state.generationReducer
  );

  const handleLogout = async () => {
    // const res = await logoutUser();
    localStorage.removeItem('isLoggedIn');
    dispatch(getLogoutAction());
    navigate('/');
    // window.location.href = "/login";
  };

  useEffect(() => {
    // console.log(`You changed the page to: ${location.pathname}`);

    if (location.pathname == '/') {
      // console.log(localStorage.getItem("old_route"));
      // if (localStorage.getItem("old_route") != location.pathname) {
      //   window.location.reload();
      //   setShowTools(true);
      // }
      // alert(auth.isLoggedIn)
      if (!auth.isLoggedIn) {
        navigate('/home');
      } else {
        setShowTools(true);
      }

      const isFromGenerate = localStorage.getItem('fromGenerate');
      const promptTxt = localStorage.getItem('promptTxt') || '';

      if (isFromGenerate == 'yes') {
        dispatch(setPrompt(promptTxt));
      }
    } else {
      setShowTools(false);
      localStorage.removeItem('fromGenerate');
      localStorage.removeItem('promptTxt');
    }
    localStorage.setItem('old_route', location.pathname);
  }, [location]);

  // useEffect(() => {
  //   console.log("isLoggedIn && showTools ", isLoggedIn, showTools);
  //   const saveToken = async () => {
  //     if (!auth.isLoggedIn) {
  //       navigate("/home");
  //     } else {
  //       setShowTools(true);
  //     }
  //   };
  //   saveToken();
  // }, [auth.isLoggedIn]);

  const gotoHome = () => {
    navigate('/home');
  };

  return (
    <div className="site-header">
      <div className="site-header-left-side">
        <img
          src={InvokeAILogo}
          alt="logo"
          onClick={gotoHome}
          className="logo"
        />

        {isLoggedIn ? (
          <>
            <Link as={ReactLink} to={'/home'}>
              Home
            </Link>
            {user.role == 'admin' ? (
              <>
                <Link as={ReactLink} to={'/member'}>
                  Member
                </Link>
                <Link as={ReactLink} to={'/report'}>
                  Report
                </Link>
              </>
            ) : (
              ''
            )}
            <Link as={ReactLink} to={'/gallery'}>
              Gallery
            </Link>
            <Link as={ReactLink} to={'/'}>
              Doodle
            </Link>
            <Link as={ReactLink} to={'/faq'}>
              FAQ
            </Link>
          </>
        ) : (
          ''
        )}
      </div>

      <div className="site-header-right-side">
        {/* <IAIIconButton
          aria-label="Report Bug"
          tooltip="Report Bug"
          variant="link"
          data-variant="link"
          fontSize={20}
          size={'sm'}
          icon={
            <Link isExternal href="http://github.com/invoke-ai/InvokeAI/issues">
              <FaBug />
            </Link>
          }
        /> */}

        {/* <IAIIconButton
          aria-label="Link to Github Repo"
          tooltip="Github"
          variant="link"
          data-variant="link"
          fontSize={20}
          size={'sm'}
          icon={
            <Link isExternal href="http://github.com/invoke-ai/InvokeAI">
              <FaGithub />
            </Link>
          }
        /> */}

        {/* <IAIIconButton
          aria-label="Link to Discord Server"
          tooltip="Discord"
          variant="link"
          data-variant="link"
          fontSize={20}
          size={'sm'}
          icon={
            <Link isExternal href="https://discord.gg/ZmtBAhwWhy">
              <FaDiscord />
            </Link>
          }
        /> */}
        {isLoggedIn && showTools ? (
          <>
            <StatusIndicator />
            <ThemeChanger />
            <ModelSelect />

            <HotkeysModal>
              <IAIIconButton
                aria-label="Hotkeys"
                tooltip="Hotkeys"
                size={'sm'}
                variant="link"
                data-variant="link"
                fontSize={20}
                icon={<FaKeyboard />}
              />
            </HotkeysModal>

            <SettingsModal>
              <IAIIconButton
                aria-label="Settings"
                tooltip="Settings"
                variant="link"
                data-variant="link"
                fontSize={20}
                size={'sm'}
                icon={<FaWrench />}
              />
            </SettingsModal>
          </>
        ) : (
          ''
        )}

        {isLoggedIn ? (
          <>
            <ul className="drop-nav">
              <li>
                <ReactLink to="/account">
                  <Button
                    size={'sm'}
                    style={{ borderRadius: '20px' }}
                    colorScheme="green"
                  >
                    D
                  </Button>
                </ReactLink>
              </li>
              <ul className="dropdown">
                {/* <li><Link to="/profile">Profile</Link></li> */}
                <li>
                  <ReactLink onClick={handleLogout} to={'/login'}>
                    Log Out
                  </ReactLink>
                </li>
              </ul>
            </ul>
          </>
        ) : (
          <>
            <ReactLink style={{ textDecoration: 'none' }} to={'/login'}>
              <Button size={'sm'} style={{ color: 'white' }} colorScheme="red">
                Login
              </Button>
            </ReactLink>
            <ReactLink style={{ textDecoration: 'none' }} to={'/register'}>
              <Button size={'sm'} style={{ color: 'white' }} colorScheme="red">
                Register
              </Button>
            </ReactLink>
          </>
        )}
      </div>
    </div>
  );
};

export default SiteHeader;
