import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { imageGallerySelector } from 'features/gallery/store/gallerySliceSelectors';
import { useAppDispatch, useAppSelector } from 'app/store';
import ProfileHoverableImage from './ProfileHoverableImage';
import DoodlerImg from 'assets/images/large_logo.png';
import { Input, Button, useToast } from '@chakra-ui/react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { setPrompt } from 'features/options/store/optionsSlice';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  getFollowStatus,
  getFollowsByEmail,
  getFollowerByEmail,
  follow,
  unfollow,
  getLikesByEmail,
  getURLsByEmail,
  getReports,
} from 'app/actions';
import './index.scss';

const Profile = () => {
  const auth = useSelector((state: any) => state.authReducer);
  const { images, currentImageUuid } = useAppSelector(imageGallerySelector);

  const [wholeFollowings, setWholeFollowings] = useState(0);
  const [isFollowed, setIsFollowed] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [wholeLikes, setWholeLikes] = useState(0);
  const [myImages, setMyImages] = useState<any[] | []>([]);
  const [galleryImages, setGalleryImages] = useState<any[] | []>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [promptTxt, setPromptTxt] = useState('');
  const [email, setEmail] = useState('');
  const toast = useToast();
  const params: any = {
    email: window.location.pathname.replace('/profile/', ''),
  };

  useEffect(() => {
    const init = async () => {
      console.log('email', params.email);
      const state: any = location.state;
      setEmail(params.email);
      const res1 = await getFollowsByEmail(params.email);
      const res2 = await getFollowStatus(auth.user.email, params.email);
      const res3 = await getLikesByEmail(params.email);
      const res4 = await getFollowerByEmail(params.email);

      setWholeFollowings(res1);
      setIsFollowed(res2);
      setWholeLikes(res3);
      setFollowers(res4);

      const email: any = params.email;
      const url_list = await getURLsByEmail(email);

      const res = await getReports();
      const requests = res.reports;
      console.log('requests', requests);
      const temp: any[] = [];
      requests.reverse().map((request: any) => {
        if (request.email == params.email && request.url) {
          temp.push({
            category: 'result',
            width: request.width,
            height: request.height,
            url: request.url,
            metadata: {
              image: {
                cfg_scale: request.cfg_scale,
                width: request.width,
                height: request.height,
                seed: request.seed,
                steps: request.steps,
                sampler: request.sampler_name,
                prompt: [
                  {
                    prompt: request.prompt,
                  },
                ],
              },
            },
          });
        }
      });
      setGalleryImages(temp);
    };
    init();
  }, []);

  // useEffect(() => {
  //   const init = async () => {
  //     // const state: any = location.state;
  //     const email: any = params.email;
  //     const url_list = await getURLsByEmail(email);
  //     console.log('url_list', url_list);
  //     const temp: any[] = [];
  //     images.map((image) => {
  //       if (url_list.indexOf(image.url) > -1) {
  //         temp.push(image);
  //       }
  //     });

  //     setMyImages(temp);
  //   };
  //   init();
  // }, [images]);

  const handleFollow = () => {
    console.log('follow');
    follow(auth.user.email, email).then(() => {
      setWholeFollowings((prevState) => prevState + 1);
      setIsFollowed(1);
    });
  };

  const handleUnFollow = () => {
    console.log('unfollow');
    unfollow(auth.user.email, email).then(() => {
      setWholeFollowings((prevState) => prevState - 1);
      setIsFollowed(0);
    });
  };

  const share = () => {
    toast({
      title: 'Copied link to clipboard',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  return (
    <div className="" style={{ overflow: 'auto' }}>
      <div className="user-detail">
        <div style={{ width: '30%', display: 'inline-block', padding: '5px' }}>
          <div>
            <h1
              style={{ padding: '5px', fontSize: '25px', marginBottom: '15px' }}
            >
              {email}
            </h1>
          </div>
          <div>
            <h2 style={{ display: 'inline', padding: '5px' }}>
              {wholeFollowings} Followers
            </h2>
            <h2 style={{ display: 'inline', padding: '5px' }}>
              {' '}
              {followers} Following
            </h2>
            <h2 style={{ display: 'inline', padding: '5px' }}>
              {' '}
              {wholeLikes} Likes
            </h2>
          </div>
        </div>
        <div style={{ width: '30%', display: 'inline-block' }}>
          {email != auth.user.email && isFollowed == 1 ? (
            <Button
              colorScheme="blue"
              margin={'5px 10px'}
              onClick={handleUnFollow}
            >
              Unfollow
            </Button>
          ) : (
            ''
          )}
          {email != auth.user.email && isFollowed != 1 ? (
            <Button
              colorScheme="blue"
              margin={'5px 10px'}
              onClick={handleFollow}
            >
              Follow
            </Button>
          ) : (
            ''
          )}
          {/* {isFollowed == 1 ? (
            <Button
              colorScheme="blue"
              margin={"5px 10px"}
              onClick={handleUnFollow}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              margin={"5px 10px"}
              onClick={handleFollow}
            >
              Follow
            </Button>
          )} */}
          <CopyToClipboard text={window.location.href} onCopy={share}>
            <Button colorScheme="blue" margin={'5px 10px'}>
              Share
            </Button>
          </CopyToClipboard>
        </div>
      </div>
      <div className="image-gallery-container" style={{ paddingTop: '15px' }}>
        {galleryImages.length ? (
          <>
            <div
              className="image-gallery"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(256px, auto))',
                padding: '0px',
              }}
            >
              {galleryImages.map((image: any) => {
                const { uuid } = image;
                const isSelected = currentImageUuid === uuid;
                // console.log("image", image);
                return (
                  <ProfileHoverableImage
                    key={uuid}
                    image={image}
                    isSelected={isSelected}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="image-gallery-container-placeholder">
            <p>No Images In Gallery</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
