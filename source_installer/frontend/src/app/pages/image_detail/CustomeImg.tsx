import { useEffect, useState } from 'react';
import { Box, Image } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'app/store';
import { setShouldHoldGalleryOpen } from 'features/gallery/store/gallerySlice';
import { BsHeart } from 'react-icons/bs';
// import DeleteImageModal from './DeleteImageModal';
import { memo } from 'react';

import * as InvokeAI from 'app/invokeai';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { hoverableImageSelector } from 'features/gallery/store/gallerySliceSelectors';
import { useNavigate } from 'react-router-dom';
import './index.scss';

interface HoverableImageProps {
  image: InvokeAI.Image;
  isSelected: boolean;
}

const memoEqualityCheck = (
  prev: HoverableImageProps,
  next: HoverableImageProps
) => prev.image.uuid === next.image.uuid && prev.isSelected === next.isSelected;

/**
 * Gallery image component with delete/use all/use seed buttons on hover.
 */
const HoverableImage = memo((props: HoverableImageProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [widthFit, setWidthFit] = useState(512);
  const [heightFit, setHeightFit] = useState(512);
  const {
    galleryImageObjectFit,
    galleryImageMinimumWidth,
    shouldUseSingleGalleryColumn,
  } = useAppSelector(hoverableImageSelector);
  const { image, isSelected } = props;
  const { url, thumbnail, uuid, metadata } = image;

  useEffect(() => {
    console.log(image.width, image.height);
    
    const ratio = image.width / 512;
    setWidthFit(512);
    setHeightFit(image.height / ratio);
  }, []);

  return (
    <ContextMenu.Root
      onOpenChange={(open: boolean) => {
        dispatch(setShouldHoldGalleryOpen(open));
      }}
    >
      <ContextMenu.Trigger>
        <Box
          position={'relative'}
          key={uuid}
          className=" parent sudo"
          userSelect={'none'}
          style={{
            padding: '0px',
            // height: '512px',
            // width: '512px',
            minHeight: '512px',
            width: '512px',
          }}
        >
          <Image
            // className="hoverable-image-image"
            className="child"
            width={widthFit}
            height={heightFit}
            objectFit={
              shouldUseSingleGalleryColumn ? 'contain' : galleryImageObjectFit
            }
            rounded={'md'}
            src={thumbnail || url}
            style={{ padding: '10px' }}
            loading={'lazy'}
          />
        </Box>
      </ContextMenu.Trigger>
    </ContextMenu.Root>
  );
}, memoEqualityCheck);

export default HoverableImage;
