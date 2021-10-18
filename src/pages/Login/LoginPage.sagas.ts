import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { baseAPIURL } from "../../shared/constants";
import { LocalStorage } from "../../app/common/LocalStorage";
import {
  requestLogin,
  receiveLoginFailure,
  receiveLoginSuccess,
  IRequestLoginAction,
} from "./LoginPage.slice";
import apiClient from "../../app/common/apiClient";

function* handleRequestLogin(action: PayloadAction<IRequestLoginAction>): any {
  try {
    const url = `${baseAPIURL}v1/user/login`;
    const { data } = yield call(async () => {
      return apiClient.post(url, action.payload);
    });
    const { token } = data;
    console.log("token received");
    LocalStorage.setToken(token);
    yield put(receiveLoginSuccess(token));
  } catch (e) {
    LocalStorage.checkUnauthorized(e);
    yield put(
      receiveLoginFailure(
        "The username or password is incorrect. Please try again."
      )
    );
  }
}

function* loginSaga() {
  yield takeEvery(requestLogin.type, handleRequestLogin);
}

export default loginSaga;
