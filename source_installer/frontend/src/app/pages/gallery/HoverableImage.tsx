import { useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "app/store";
import { setShouldHoldGalleryOpen } from "features/gallery/store/gallerySlice";
import { BsHeart } from "react-icons/bs";
// import DeleteImageModal from './DeleteImageModal';
import { memo, useState } from "react";

import * as InvokeAI from "app/invokeai";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { hoverableImageSelector } from "features/gallery/store/gallerySliceSelectors";
import { useNavigate } from "react-router-dom";
import { getLikesByURL } from "app/actions";

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
  const auth = useAppSelector((state: any) => state.authReducer);
  const {
    galleryImageObjectFit,
    galleryImageMinimumWidth,
    shouldUseSingleGalleryColumn,
  } = useAppSelector(hoverableImageSelector);
  const { image, isSelected } = props;
  const { url, thumbnail, uuid, metadata } = image;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [likes, setLikes] = useState(0);

  const handleMouseOver = () => setIsHovered(true);

  const handleMouseOut = () => setIsHovered(false);

  const handleClick = (img: any) => {
    if(auth.isLoggedIn ) {
      navigate(`/image-detail`, {
        state: { ...img },
      });
    }    
  };

  useEffect(() => {
    const init = async () => {
      const likes = await getLikesByURL(image.url);
      setLikes(likes.length)
    };
    init();
  }, []);

  return (
    <ContextMenu.Root
      onOpenChange={(open: boolean) => {
        dispatch(setShouldHoldGalleryOpen(open));
      }}
    >
      <ContextMenu.Trigger>
        <Box
          position={"relative"}
          key={uuid}
          className="hoverable-image"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          // userSelect={"none"}
          style={{ padding: "0px" }}
          onClick={() => handleClick(image)}
        >
          <Image
            className="hoverable-image-image"
            objectFit={
              shouldUseSingleGalleryColumn ? "contain" : galleryImageObjectFit
            }
            rounded={"md"}
            src={thumbnail || url}
            loading={"lazy"}
          />
          {isHovered && galleryImageMinimumWidth >= 64 && (
            <div className="likes-container">
              <div className="likes">
                <div style={{ fontSize: "20px", display: "inline-block" }}>
                  {likes}{" "}
                </div>
                <BsHeart
                  style={{
                    display: "inline",
                    fontSize: "25px",
                    paddingTop: "10px",
                    marginLeft: "2px",
                  }}
                />
              </div>

              <div className="prompt">
                <p>
                  <b>Prompt:</b>
                </p>
                {image.metadata?.image.prompt[0].prompt.length > 90
                  ? image.metadata?.image.prompt[0].prompt.slice(0, 90) + " ..."
                  : image.metadata?.image.prompt[0].prompt.slice(0, 90)}
              </div>
            </div>
          )}
        </Box>
      </ContextMenu.Trigger>
    </ContextMenu.Root>
  );
}, memoEqualityCheck);

export default HoverableImage;
