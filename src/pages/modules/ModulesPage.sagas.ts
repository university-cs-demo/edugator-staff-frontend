import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  requestModules,
  requestModulesSuccess,
  requestModulesFailure,
  requestNewModule,
  requestNewModuleSuccess,
  requestNewModuleFailure,
} from "./ModulesPage.slice";

import apiUrls from "./config";
import { IModule, IModulesPUT } from "../../shared/types";

function* handleGetModulesRequest(action: PayloadAction<void>): any {
  console.log("sagas for GET Modules");
  // request
  let modulesRequest = () =>
    axios.request<IModule[]>({ ...apiUrls["get modules and problems"] });
  try {
    const response: AxiosResponse<IModule[]> = yield call(modulesRequest);
    yield put(requestModulesSuccess(response.data));
  } catch (e) {
    yield put(requestModulesFailure(e as Error));
  }
}

function* handleAddModulesRequest(action: PayloadAction<IModulesPUT>): any {
  console.log("sagas for POST Modules");

  // request
  let moduleAddRequest = () =>
    axios.request<string>({
      ...apiUrls["add module"],
      data: {
        name: action.payload.moduleName,
        number: action.payload.moduleNum,
      },
    });

  try {
    // Add response content to sagas
    const response: AxiosResponse<string> = yield call(moduleAddRequest);
    console.log("stuff:", response);
    //console.log("data:", response.data);

    let new_module: IModule = {
      name: action.payload.moduleName,
      number: action.payload.moduleNum,
      problems: [],
      _id: response.data,
    };
    yield put(requestNewModuleSuccess(new_module));
  } catch (e) {
    yield put(requestNewModuleFailure(e as Error));
  }
}

function* modulesSaga() {
  yield takeEvery(requestModules.type, handleGetModulesRequest);
  yield takeEvery(requestNewModule.type, handleAddModulesRequest);
}

export default modulesSaga;
