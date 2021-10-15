import {
  call,
  cancelled,
  put,
  takeEvery,
  fork,
  take,
} from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  requestModulesAndProblems,
  setNavStructure,
  setProblems,
  setIsLoading,
  setRunningSubmission,
  requestRunCode,
  setCompilerOutput,
  setActiveTab,
  setIsAcceptedOutput,
  submitCode,
  setResultSubmission,
} from "./CodeEditorSlice";
import api from "../../app/common/api";

const judge0Validator = ({ data }: { data: IJudge0Response }): boolean => {
  return data.status.id >= 3;
};

const poll = async (
  fn: Function,
  payload: any,
  validate: (value: any) => boolean,
  interval: number,
  maxAttempts: number
) => {
  let attempts = 0;

  const executePoll = async (resolve: any, reject: any) => {
    const result = await fn(payload);
    attempts++;
    if (validate(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error("Exceeded max Attempts"));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};

function filterForProblems(moduleProblemStructure: IModuleWithProblems[]) {
  let problems: IProblem[] = [];
  moduleProblemStructure.forEach((element) => {
    problems = [...problems, ...element.problems];
  });
  return problems;
}
function createNavStructure(moduleProblemStructure: IModuleWithProblems[]) {
  const moduleItems: INavigationItem[] = [];
  moduleProblemStructure.forEach((element) => {
    const payload = {
      _id: element._id,
      name: element.name,
      problems: element.problems.map((el) => ({
        problemName: el.title,
        _id: el._id,
      })),
    };
    moduleItems.push(payload);
  });
  return moduleItems;
}
function* handleRequestModulesAndProblems() {
  try {
    const { data }: { data: IModuleWithProblems[] } = yield call(async () => {
      return api.getStudentModulesAndProblems();
    });
    yield put(setProblems(filterForProblems(data)));
    yield put(setNavStructure(createNavStructure(data)));
    yield put(setIsLoading(false));
  } catch (e) {}
}

function* runCodeRequest(action: PayloadAction<ICodeSubmission>) {
  try {
    const { code, header, footer, stdin } = action.payload;
    const paylodBuffer = Buffer.from(header + code + footer, "utf-8");
    const stdinPayload = Buffer.from(stdin, "utf-8");
    const { data }: { data: IToken } = yield call(async () => {
      return api.runCodeRequest(
        paylodBuffer.toString("base64"),
        54,
        true,
        stdinPayload.toString("base64")
      );
    });
    if (!data.token || data.token === "") {
      throw new Error("Token not pressent");
    }
    const result = yield call(async () => {
      return poll(
        api.getCodeRequest,
        { runId: data.token, base_64: true },
        judge0Validator,
        3000,
        4
      );
    });
    const resultData: IJudge0Response = result.data;
    yield put(setRunningSubmission(false));
    yield put(setActiveTab(1));
    yield put(setIsAcceptedOutput(resultData.status.id === 3));
    yield put(
      setCompilerOutput({
        compilerMessage:
          resultData.status.id === 3
            ? "Accepted"
            : resultData.status.description,
        compilerBody:
          resultData.status.id === 3 && resultData.stdout
            ? Buffer.from(resultData.stdout as string, "base64").toString()
            : Buffer.from(resultData.compile_output, "base64").toString(),
      })
    );
  } catch (e) {
    //TODO notify user
    yield put(setRunningSubmission(false));
  } finally {
    if (yield cancelled()) {
      //TODO notifiy user
    }
  }
}

function* runCodeSubmission(
  action: PayloadAction<ICodeSubmission & { problemId: string }>
) {
  try {
    const { code, header, footer, stdin, problemId } = action.payload;
    const paylodBuffer = Buffer.from(header + code + footer, "utf-8");
    const stdinPayload = Buffer.from(stdin, "utf-8");
    const { data }: { data: IResultSubmission[] } = yield call(async () => {
      return api.runCodeSubmission(
        paylodBuffer.toString("base64"),
        54,
        true,
        stdinPayload.toString("base64"),
        problemId
      );
    });
    yield put(setActiveTab(2));
    yield put(setRunningSubmission(false));
    yield put(setResultSubmission(data));
  } catch (e) {
    //notify user
    yield put(setRunningSubmission(false));
  }
}

function* codeEditorSaga() {
  yield takeEvery(
    requestModulesAndProblems.type,
    handleRequestModulesAndProblems
  );
  yield takeEvery(requestRunCode.type, runCodeRequest);
  yield takeEvery(submitCode.type, runCodeSubmission);
}

export default codeEditorSaga;
