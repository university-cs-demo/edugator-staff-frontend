/** Problem Interfaces */

export interface ITestCase {
  input: string;
  expectedOutput: string;
  hint: string;
  visibility: number;
}

export interface IProblem extends IProblemBase {
  hidden: boolean;
  language: string;
  dueDate: string; //iso format
  statement: string;
  code: {
    header: string;
    body: string;
    footer: string;
  };
  fileExtension: string;
  testCases: ITestCase[];
  templatePackage: string;
  timeLimit: number;
  memoryLimit: number;
  buildCommand: string;
}

export interface INewProblem extends IProblem {
  moduleId: string;
}

// please extend problem interfaces from here
export interface IProblemBase {
  _id?: string;
  title: string;
  // add more basic details as necessary
}

/** Module interfaces */

export interface IModuleBase {
  _id?: string;
  name: string;
  number: number;
}

/** Feedback Interfaces */

/** Useful Enum */
export enum AlertType {
  info = "info",
  error = "error",
  success = "success",
}

export interface IFeedback {
  message?: string;
  display: boolean;
  type: AlertType;
  title?: string;
}

export interface IRequestMessage {
  message?: string;
}

/** Other Interfaces */
