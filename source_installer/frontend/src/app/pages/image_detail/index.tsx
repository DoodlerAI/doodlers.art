import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Grid,
  GridItem,
  Button,
  ButtonGroup,
  Link,
  useToast,
} from '@chakra-ui/react';
import CustomeImg from './CustomeImg';
import { getImageDetail, getFollowsByEmail } from 'app/actions';
import { BsHeart, BsDownload, BsUpload, BsHeartFill } from 'react-icons/bs';
import './index.scss';
import {
  base_url,
  like,
  unlike,
  getLikes,
  getIsLike,
  getLikesByURL,
  getFollowerByEmail,
} from 'app/actions';
import fs from 'fs';
import { Buffer } from 'buffer';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from 'app/store';
import { hoverableImageSelector } from 'features/gallery/store/gallerySliceSelectors';
import {
  setActiveTab,
  setAllImageToImageParameters,
  setAllTextToImageParameters,
  setInitialImage,
  setIsLightBoxOpen,
  setPrompt,
  setSeed,
} from 'features/options/store/optionsSlice';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Data {
  email: string;
  prompt: string;
  cfg_scale: number;
  seed: number;
  model: string;
  createdAt: string;
  url: string;
}

const ImageDetail = () => {
  const location: any = useLocation();
  const navigate = useNavigate();
  const [fileDest, setFileDest] = useState('');
  const [data, setData] = useState<Data>({
    email: '',
    prompt: '',
    cfg_scale: 0,
    seed: 0,
    model: '',
    createdAt: '',
    url: '',
  });
  const [likes, setLikes] = useState(0);
  const [followings, setFollowings] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [isLike, setIsLike] = useState(0);
  const auth: any = useSelector((state: any) => state.authReducer);
  const { user } = auth;
  const image: any = location.state;
  const toast = useToast();
  useEffect(() => {
    const init = async () => {
      const res = await getImageDetail(location.state.url);
      console.log(location.state.url,'res', res)

      setData({ model: 'Stable Diffusion', ...res.data });
      setFileDest(base_url + '/' + res.data.url);

      const res2 = await getLikesByURL(res.data.url);
      const res3 = await getIsLike(
        auth.user.email,
        res.data.email,
        res.data.url
      );
      const res4 = await getFollowsByEmail(res.data.email);
      const res5 = await getFollowerByEmail(res.data.email);
      setLikes(res2.length);
      setIsLike(res3.like);
      setFollowings(res4);
      setFollowers(res5);
      console.log('res5', res5);
    };
    init();
  }, []);

  const copyLink = () => {
    toast({
      title: 'Copied link to clipboard',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  const copyPrompt = () => {
    toast({
      title: 'Copied prompt to clipboard',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  const close = () => {
    navigate('/home');
  };

  const handlelike = () => {
    like(user.email, data.email, data.url).then(() => {
      setIsLike(1);
      setLikes((prevState: any) => prevState + 1);
    });
  };

  const handle_unlike = () => {
    unlike(user.email, data.email, data.url).then(() => {
      setIsLike(0);
      setLikes((prevState: any) => prevState - 1);
    });
  };

  const gotoProfile = () => {
    navigate(`/profile/${data.email}`, {
      state: { email: data.email },
    });
  };

  const {
    activeTabName,
    galleryImageObjectFit,
    galleryImageMinimumWidth,
    mayDeleteImage,
    isLightBoxOpen,
    shouldUseSingleGalleryColumn,
  } = useAppSelector(hoverableImageSelector);
  const dispatch = useAppDispatch();

  const handleSendToImageToImage = () => {
    if (isLightBoxOpen) dispatch(setIsLightBoxOpen(false));
    dispatch(setInitialImage(image));
    if (activeTabName !== 'img2img') {
      dispatch(setActiveTab('img2img'));
    }
    toast({
      title: 'Sent to Image To Image',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  return (
    <div className="image-detail" style={{ overflow: 'auto' }}>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem style={{ width: '512px', maxWidth: '512px', margin: 'auto' }}>
          <CustomeImg key={image.uuid} image={image} isSelected={true} />
          <Grid templateColumns="repeat(5, 1fr)" gap={0} marginTop="10px">
            <GridItem
              colSpan={1}
              h="10"
              verticalAlign={'middle'}
              paddingLeft="10px"
            >
              <span style={{ height: '100%' }} className="likes-icon">
                {isLike == 1 ? (
                  <BsHeartFill
                    onClick={handle_unlike}
                    style={{
                      height: '100%',
                      display: 'inline-block',
                    }}
                  />
                ) : (
                  <BsHeart
                    onClick={handlelike}
                    style={{
                      height: '100%',
                      display: 'inline-block',
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: '15px' }} className="likes">
                {likes}
              </span>
            </GridItem>
            <GridItem colSpan={3} h="10" textAlign={'center'}>
              <Button
                margin={'0px 3px'}
                size="md"
                border="0px"
                bg="#333333"
                color={'white'}
                _active={{
                  bg: '#666666',
                  borderColor: 'none',
                }}
                _focus={{
                  // bg: "#666666",
                  borderColor: 'none',
                }}
                _hover={{ bg: '#666666' }}
                onClick={handleSendToImageToImage}
              >
                Make variation
              </Button>

              <CopyToClipboard text={data.prompt} onCopy={copyPrompt}>
                <Button
                  margin={'0px 3px'}
                  size="md"
                  border="0px"
                  bg="#333333"
                  color={'white'}
                  _active={{
                    bg: '#666666',
                    borderColor: 'none',
                  }}
                  _hover={{ bg: '#666666' }}
                  _focus={{
                    // bg: "#666666",
                    borderColor: 'none',
                  }}
                >
                  Copy prompt
                </Button>
              </CopyToClipboard>
            </GridItem>
            <GridItem colStart={5} colEnd={6} h="10" textAlign={'right'}>
              <Link download={true} href={data.url}>
                <BsDownload className="custom-icon" />
              </Link>

              <CopyToClipboard text={fileDest} onCopy={copyLink}>
                <BsUpload className="custom-icon" />
              </CopyToClipboard>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem w="100%" paddingLeft={'30px'}>
          <p style={{ fontSize: '30px' }} className="email">
            <b>
              <span onClick={gotoProfile}>{data.email} </span>
              <span className="close">
                <AiOutlineCloseCircle
                  onClick={close}
                  display={'inline'}
                  className="close-icon"
                />
              </span>
            </b>
          </p>
          <p style={{ marginBottom: '20px', marginTop: '5px' }}>
            <span style={{ color: '#f2f2f2', marginLeft: '240px' }}>
              {likes} Likes{' '}
            </span>
            <span style={{ color: '#f2f2f2', marginLeft: '10px' }}>
              {followers} Followings{' '}
            </span>
          </p>
          <p>
            <span className="field">Prompt : </span>
            <span className="content">{data.prompt}</span>
          </p>
          <p>
            <span className="field">Seed : </span>
            <span className="content">{data.seed}</span>
          </p>
          <p>
            <span className="field">Guidance Scale : </span>
            <span className="content">{data.cfg_scale}</span>
          </p>
          <p>
            <span className="field">Model : </span>
            <span className="content">{data.model}</span>
          </p>
          <p>
            <span className="field">Created : </span>
            <span className="content">
              {new Date(data.createdAt).toLocaleString()}
            </span>
          </p>
        </GridItem>
      </Grid>
    </div>
  );
};

export default ImageDetail;
