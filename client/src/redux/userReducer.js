import { THEME } from "./Types";

const initialState = {
  theme: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case THEME:
      return {
        ...state,
        theme: !state.theme,
      };
    default:
      return state;
  }
}
