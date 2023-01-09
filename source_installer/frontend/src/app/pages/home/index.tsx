import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { imageGallerySelector } from 'features/gallery/store/gallerySliceSelectors';
import { useAppDispatch, useAppSelector } from 'app/store';
import HoverableImage from './HoverableImage';
import DoodlerImg from 'assets/images/large_logo.png';
import { Input, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { setPrompt } from 'features/options/store/optionsSlice';
import { getDataByURL, getReports } from 'app/actions';
import './index.scss';

const Home = () => {
  const auth = useSelector((state: any) => state.authReducer);
  const { images, currentImageUuid } = useAppSelector(imageGallerySelector);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [promptTxt, setPromptTxt] = useState('');
  const [galleryImages, setGalleryImages] = useState<any[] | []>([]);

  useEffect(() => {
    const init = async () => {
      const res = await getReports();
      const requests = res.reports;
      console.log('requests', requests);
      const temp: any[] = [];
      requests.reverse().map((request: any) => {
        if (request.url) {
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
  //   console.log('images', images);
  //   const temp: any[] = [];
  //   images.map((image: any) => {
  //     if (image.metadata.image) {
  //       temp.push(image);
  //     } else {
  //       getDataByURL(image.url).then((res: any) => {
  //         console.log(res);
  //       });
  //     }
  //   });
  //   setGalleryImages(temp);
  // }, [images]);

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setPromptTxt(e.target.value);
  };

  const Generate = () => {
    if (auth.isLoggedIn) {
      dispatch(setPrompt(promptTxt));
      localStorage.setItem('fromGenerate', 'yes');
      localStorage.setItem('promptTxt', promptTxt);
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home" style={{ overflow: 'auto' }}>
      <div>
        <img
          src={DoodlerImg}
          alt="logo"
          style={{ margin: 'auto', width: '25%', marginTop: '50px' }}
        />
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '30px',
          color: '#999696',
          fontSize: '18px',
        }}
      >
        <p>Doodlers is a free AI art generator.</p>
        <p>Register to generate images. Registration is 100% free.</p>
      </div>
      <div style={{ textAlign: 'center', padding: '15px' }}>
        <Input
          width={'60%'}
          borderColor={'#999696'}
          marginRight={'5px'}
          onChange={handleChange}
          placeholder="Type here the descrption of the image you want to generate."
          _placeholder={{ opacity: 1, color: 'gray.500' }}
        />
        <Button colorScheme="blue" marginTop={'-2px'} onClick={Generate}>
          Generate
        </Button>
      </div>
      <div className="image-gallery-container">
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
                  <HoverableImage
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

export default Home;
