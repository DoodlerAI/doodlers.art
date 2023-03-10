import { AnyAction, Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';
import dateFormat from 'dateformat';
import { Socket } from 'socket.io-client';
import {
  frontendToBackendParameters,
  FrontendToBackendParametersConfig,
} from 'common/util/parameterTranslation';
import {
  GalleryCategory,
  GalleryState,
  removeImage,
} from 'features/gallery/store/gallerySlice';
import { OptionsState } from 'features/options/store/optionsSlice';
import {
  addLogEntry,
  generationRequested,
  modelChangeRequested,
  setIsProcessing,
} from 'features/system/store/systemSlice';
import { InvokeTabName } from 'features/tabs/components/InvokeTabs';
import * as InvokeAI from 'app/invokeai';
import { RootState } from 'app/store';
import { requestGeneration, deleteImgByURL } from 'app/actions';
import { getRequestGen } from 'app/actions/actionsTypes';

/**
 * Returns an object containing all functions which use `socketio.emit()`.
 * i.e. those which make server requests.
 */
const makeSocketIOEmitters = (
  store: MiddlewareAPI<Dispatch<AnyAction>, any>,
  socketio: Socket
) => {
  // We need to dispatch actions to redux and get pieces of state from the store.
  const { dispatch, getState } = store;

  return {
    emitGenerateImage: (generationMode: InvokeTabName) => {
      dispatch(setIsProcessing(true));

      const state: RootState = getState();

      const {
        options: optionsState,
        system: systemState,
        canvas: canvasState,
      } = state;
      const { email } = state.authReducer.user;
      const { widthFit, heightFit } = state.generationReducer;

      const frontendToBackendParametersConfig: FrontendToBackendParametersConfig =
        {
          generationMode,
          optionsState,
          canvasState,
          systemState,
        };

      const { generationParameters, esrganParameters, facetoolParameters } =
        frontendToBackendParameters(frontendToBackendParametersConfig);      

      if (generationParameters.generation_mode == 'unifiedCanvas') {
        generationParameters.width = widthFit;
        generationParameters.height = heightFit;
      }

      console.log(
        'generationParameters',
        generationParameters,
        esrganParameters,
        facetoolParameters
      );

      requestGeneration({ email, ...generationParameters }).then(
        (data: any) => {
          console.log(data);
          if (data.status == 1 || data.status == 3) {
            dispatch(generationRequested());
            dispatch(getRequestGen(data.id, new Date().getTime(), data.status));
            socketio.emit(
              'generateImage',
              generationParameters,
              esrganParameters,
              facetoolParameters
            );
            // we need to truncate the init_mask base64 else it takes up the whole log
            // TODO: handle maintaining masks for reproducibility in future
            if (generationParameters.init_mask) {
              generationParameters.init_mask = generationParameters.init_mask
                .substr(0, 64)
                .concat('...');
            }
            if (generationParameters.init_img) {
              generationParameters.init_img = generationParameters.init_img
                .substr(0, 64)
                .concat('...');
            }

            dispatch(
              addLogEntry({
                timestamp: dateFormat(new Date(), 'isoDateTime'),
                message: `Image generation requested: ${JSON.stringify({
                  ...generationParameters,
                  ...esrganParameters,
                  ...facetoolParameters,
                })}`,
              })
            );
          } else {
            alert(
              'Successfully Requested. \n We will send email you when it is your turn.'
            );
            dispatch(setIsProcessing(false));
          }
        }
      );
    },
    emitRunESRGAN: (imageToProcess: InvokeAI.Image) => {
      dispatch(setIsProcessing(true));
      const options: OptionsState = getState().options;
      const { upscalingLevel, upscalingStrength } = options;
      const esrganParameters = {
        upscale: [upscalingLevel, upscalingStrength],
      };
      socketio.emit('runPostprocessing', imageToProcess, {
        type: 'esrgan',
        ...esrganParameters,
      });
      dispatch(
        addLogEntry({
          timestamp: dateFormat(new Date(), 'isoDateTime'),
          message: `ESRGAN upscale requested: ${JSON.stringify({
            file: imageToProcess.url,
            ...esrganParameters,
          })}`,
        })
      );
    },
    emitRunFacetool: (imageToProcess: InvokeAI.Image) => {
      dispatch(setIsProcessing(true));
      const options: OptionsState = getState().options;
      const { facetoolType, facetoolStrength, codeformerFidelity } = options;

      const facetoolParameters: Record<string, any> = {
        facetool_strength: facetoolStrength,
      };

      if (facetoolType === 'codeformer') {
        facetoolParameters.codeformer_fidelity = codeformerFidelity;
      }

      socketio.emit('runPostprocessing', imageToProcess, {
        type: facetoolType,
        ...facetoolParameters,
      });
      dispatch(
        addLogEntry({
          timestamp: dateFormat(new Date(), 'isoDateTime'),
          message: `Face restoration (${facetoolType}) requested: ${JSON.stringify(
            {
              file: imageToProcess.url,
              ...facetoolParameters,
            }
          )}`,
        })
      );
    },
    emitDeleteImage: (imageToDelete: InvokeAI.Image) => {
      const { url, uuid, category, thumbnail } = imageToDelete;
      deleteImgByURL(url).then(() => {
        dispatch(removeImage(imageToDelete));
        socketio.emit('deleteImage', url, thumbnail, uuid, category);
      });
    },
    emitRequestImages: (category: GalleryCategory) => {
      const gallery: GalleryState = getState().gallery;
      const { earliest_mtime } = gallery.categories[category];
      socketio.emit('requestImages', category, earliest_mtime);
    },
    emitRequestNewImages: (category: GalleryCategory) => {
      const gallery: GalleryState = getState().gallery;
      const { latest_mtime } = gallery.categories[category];
      socketio.emit('requestLatestImages', category, latest_mtime);
    },
    emitCancelProcessing: () => {
      socketio.emit('cancel');
    },
    emitRequestSystemConfig: () => {
      socketio.emit('requestSystemConfig');
    },
    emitRequestModelChange: (modelName: string) => {
      dispatch(modelChangeRequested());
      socketio.emit('requestModelChange', modelName);
    },
    emitSaveStagingAreaImageToGallery: (url: string) => {
      socketio.emit('requestSaveStagingAreaImageToGallery', url);
    },
    emitRequestEmptyTempFolder: () => {
      socketio.emit('requestEmptyTempFolder');
    },
  };
};

export default makeSocketIOEmitters;
