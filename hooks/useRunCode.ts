import apiClient from "lib/api/apiClient";
import {
  evaluateCompilerBody,
  judge0Validator,
  poll,
  transformPayload,
} from "utils/CodeEditorUtils";
import { IResultSubmission, IToken } from "components/problem/student/types";
import { IJudge0Response } from "components/problem/student/types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CompilerOutput } from "./types";
import { apiRoutes } from "constants/apiRoutes";
import useWebSocket, { ReadyState } from "react-use-websocket";

const SOCKET_URL = "wss://edugator.prayujt.com/api/v2?token=sadasfaf";

export interface ResponseGenerator {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
}

const getCodeRequest = ({
  runId,
  base_64,
}: {
  runId: string;
  base_64: string;
}) => {
  return apiClient.post(apiRoutes.v2.student.runCodeSubmission, {
    base_64,
    runId,
  });
};

export const useRunCode = (locationState: string) => {
  const { sendMessage, lastMessage, readyState, getWebSocket } =
    useWebSocket(SOCKET_URL);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    console.log("readyState", readyState);
    console.log("connectionStatus", connectionStatus);
  }, [readyState]);

  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage.data));
    }
    console.log("lastMessage", lastMessage);
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const [stdIn, setStdIn] = useState<string>("");
  const [isSubmissionRunning, setIsSubmissionRunning] =
    useState<boolean>(false);
  const [isAcceptedOutput, setIsAcceptedOutput] = useState<boolean | undefined>(
    undefined
  );
  const [compilerOutput, setCompilerOutput] = useState<CompilerOutput>({
    compilerMessage: "",
    compilerBody: "",
  });
  const [submissionOutput, setSubmissionOutput] = useState<
    IResultSubmission[] | undefined
  >(undefined);
  const [activeTab, setActiveTab] = useState<number>(0);

  // reset the state when the locationState changes
  useEffect(() => {
    setIsSubmissionRunning(false);
    setIsAcceptedOutput(undefined);
    setCompilerOutput({
      compilerMessage: "",
      compilerBody: "",
    });
    setSubmissionOutput(undefined);
    setActiveTab(0);
  }, [locationState]);

  const runCode = async ({
    code,
    stdin,
    problemId,
    timeLimit,
    memoryLimit,
    buildCommand,
  }: {
    code: string;
    stdin: string;
    problemId: string;
    timeLimit: number;
    memoryLimit: number;
    buildCommand: string;
  }) => {
    setIsSubmissionRunning(true);
    try {
      // connect to the websocket
      if (readyState !== ReadyState.OPEN) {
        console.log("not open");
        toast.error("Websocket not connected");
        return;
      } /* 

      // wait until the websocket is connected
      while (readyState !== ReadyState.OPEN) {
        setTimeout(() => {
          console.log("waiting");
        }, 1000);
      }

      if (readyState !== ReadyState.OPEN) {
        console.log("not open");
        toast.error("Websocket not connected");
        return;
      }

      // send the message
      sendMessage(
        JSON.stringify({
          language_id: 71,
          source_code: code,
          stdin,
          expected_output: "",
          cpu_time_limit: timeLimit,
          memory_limit: memoryLimit,
          build_command: buildCommand,
        })
      );

      // wait for the response
      while (lastMessage === null) {
        setTimeout(() => {
          console.log("waiting");
        }, 1000);
      }

      if (lastMessage === null) {
        console.log("no message");
        toast.error("No message received");
        return;
      }

      // get the token from the response
      const token = JSON.parse(lastMessage.data).token;

      if (!token || token === "") {
        console.log("no toke");
        toast.error("Token not present");
        return;
      }

      // get the response from the api
      const { data }: { data: IJudge0Response } = await poll(
        getCodeRequest,
        { runId: token, base_64: true },
        judge0Validator,
        3000,
        4
      );
 */
      console.log("hereee");
      await apiClient.post(
        // apiRoutes.v2.student.runCode,
        "https://edugator.prayujt.com/api/v2/code/run/evaluate",
        transformPayload({
          code,
          stdin,
          problemId,
          timeLimit,
          memoryLimit,
          buildCommand,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "sadasfaf",
          },
        }
      );
      /* 
      console.log("here");
      if (!data.token || data.token === "") {
        console.log("no toke");
        throw new Error("Token not present");
      }

      const result: any = await poll(
        getCodeRequest,
        { runId: data.token, base_64: true },
        judge0Validator,
        3000,
        4
      );
      const resultData: IJudge0Response = result.data;

      setIsSubmissionRunning(false);
      setIsAcceptedOutput(resultData.status.id === 3);
      setCompilerOutput({
        compilerMessage:
          resultData.status.id === 3
            ? "Accepted"
            : resultData.status.description,
        compilerBody: evaluateCompilerBody(resultData),
      });
      setActiveTab(1);
      await apiClient.delete(apiRoutes.v2.student.runCodeSubmission, {
        params: {
          base64: true,
          token: data.token,
        },
      }); */
    } catch (error: any) {
      setIsSubmissionRunning(false);
      toast.error(error.message || "Something went wrong");
    }
  };

  const submitCode = async ({
    code,
    stdin,
    problemId,
    timeLimit,
    memoryLimit,
    buildCommand,
  }: {
    code: string;
    stdin: string;
    problemId: string;
    timeLimit: number;
    memoryLimit: number;
    buildCommand: string;
  }) => {
    setIsSubmissionRunning(true);
    try {
      const { data }: { data: IResultSubmission[] } = await apiClient.post(
        apiRoutes.v2.student.runCodeEvaluation,
        transformPayload({
          code,
          stdin,
          problemId,
          timeLimit,
          memoryLimit,
          buildCommand,
        })
      );
      setActiveTab(2);
      setIsSubmissionRunning(false);
      setSubmissionOutput(data);
    } catch (error: any) {
      setIsSubmissionRunning(false);
      toast.error(error.message || "Something went wrong");
    }
  };
  return {
    isSubmissionRunning,
    isAcceptedOutput,
    compilerOutput,
    runCode,
    submitCode,
    submissionOutput,
    activeTab,
    setActiveTab,
  };
};
