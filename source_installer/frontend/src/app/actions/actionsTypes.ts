export const getLoginAction = () => {
  return {
    type: 'LOGIN',
  };
};

export const getLogoutAction = () => {
  return {
    type: 'LOGOUT',
  };
};

export const getSaveTokenAction = (accessToken: any) => {
  return {
    type: 'SAVE_TOKEN',
    payload: accessToken,
  };
};

export const getSaveProfileAction = (user: any) => {
  return {
    type: 'SAVE_PROFILE',
    payload: user,
  };
};

export const getRequestGen = (ids: string[], tic: number, status: number) => {
  return {
    type: 'REQUEST_GENERATION',
    payload: { ids, tic, status },
  };
};

export const terminateOneRequest = (id: string) => {
  return {
    type: 'TERMINATE_ONE_GENERATION',
    payload: { id },
  };
};

export const prepareNextRequest = () => {
  return {
    type: 'PREPARE_NEXT_GENERATION',
  };
};

export const terminateRequestGen = () => {
  return {
    type: 'TERMINATE_GENERATION',
  };
};

export const requestUnifiedCanvasImg = (
  widthFit: number,
  heightFit: number
) => {
  return {
    type: 'REQUEST_UNIFIED_CANVAS_IMG',
    payload: { widthFit, heightFit },
  };
};
