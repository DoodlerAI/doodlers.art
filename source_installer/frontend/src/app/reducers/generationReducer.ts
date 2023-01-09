interface IRequest {
  id: string;
  tic: number;
  status: number;
}

interface IInitialState {
  requested: number;
  requests: IRequest[];
  widthFit: number;
  heightFit: number;
}

const initialstate: IInitialState = {
  requested: 0,
  requests: [],
  widthFit: 512,
  heightFit: 512,
  // id: '',
  // tic: 0,
  // status: 0,
};

const generationReducer = (state = initialstate, action: any) => {
  switch (action.type) {
    case 'REQUEST_GENERATION': {
      const temp: IRequest[] = [];
      action.payload.ids.map((id: string) => {
        temp.push({
          id,
          tic: action.payload.tic,
          status: action.payload.status,
        });
      });
      return {
        ...state,
        requested: 1,
        requests: [...temp],
      };
    }
    case 'TERMINATE_ONE_GENERATION': {
      const temp: IRequest[] = state.requests;
      state.requests.map((request: IRequest, index: number) => {
        if (request.id == action.payload.id) {
          temp.splice(index, 1);
          console.log('Reducer Terminate', temp.length);
        }
      });
      if (temp.length) {
        return {
          requested: 1,
          requests: [...temp],
        };
      } else {
        return {
          requests: [],
          requested: 0,
        };
      }
      // console.log([...temp]);
    }
    case 'PREPARE_NEXT_GENERATION': {
      state.requests[1].tic = new Date().getTime();
      // console.log([...state.requests]);
      // alert('PREPARE_NEXT_GENERATION');

      return {
        ...state,
        requests: [...state.requests],
      };
    }
    case 'TERMINATE_GENERATION':
      return {
        ...state,
        requested: 0,
        requests: [],
      };

    case 'REQUEST_UNIFIED_CANVAS_IMG':
      return {
        ...state,
        widthFit: action.payload.widthFit,
        heightFit: action.payload.heightFit,
      };

    default:
      return state;
  }
};

export default generationReducer;
