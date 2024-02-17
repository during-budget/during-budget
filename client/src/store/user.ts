import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthDataType, SnsIdType } from '../util/api/authAPI';
import { UserDataType } from '../util/api/userAPI';

export interface UserInfoType {
  _id: string;
  defaultBudgetId: string;
  userName: string;
  email?: string;
  tel?: string;
  birthdate?: string;
  gender?: string;
}

const initialState: {
  isAuth: boolean;
  auth: AuthDataType;
  info: UserInfoType;
} = {
  isAuth: false,
  auth: {
    email: '',
    isLocal: false,
    snsId: {
      google: undefined,
      naver: undefined,
      kakao: undefined,
    },
    isGuest: false,
  },
  info: {
    _id: '',
    defaultBudgetId: '',
    userName: '',
    email: '',
    tel: '',
    birthdate: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserDataType>) {
      state.isAuth = true;

      const {
        _id,
        userName,
        email,
        tel,
        birthdate,
        snsId,
        isGuest,
        isLocal,
        basicBudgetId: defaultBudgetId,
      } = action.payload;

      state.info = {
        _id,
        defaultBudgetId,
        userName,
        email,
        tel,
        birthdate,
      };
      state.auth = {
        email,
        isLocal,
        snsId,
        isGuest,
      };
    },
    logout(state) {
      state = initialState;
    },
    setUserInfo(state, action: PayloadAction<UserInfoType>) {
      state.info = { ...action.payload };
    },
    updateUserInfo(state, action: PayloadAction<Partial<UserInfoType>>) {
      state.info = { ...state.info, ...action.payload };
    },
    setAuthInfo(state, action: PayloadAction<AuthDataType>) {
      const authInfo = action.payload;
      state.auth = { ...action.payload };
      if (!authInfo.snsId) {
        state.auth = { ...state.auth, snsId: initialState.auth.snsId };
      }
    },
    setSnsId(state, action: PayloadAction<SnsIdType>) {
      state.auth.snsId = action.payload;
    },

  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
