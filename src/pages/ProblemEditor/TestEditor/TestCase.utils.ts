export enum TestCaseVisibility {
  IO_HIDDEN = 0,
  I_VISIBLE_O_HIDDEN = 1,
  IO_VISBILE = 2,
}

export interface TestCaseField {
  input: string;
  expectedOutput: string;
  hint: string;
  visibility: TestCaseVisibility;
}

export interface TestCaseError {
  input: boolean;
  expectedOutput: boolean;
}

export interface TestCaseFormError {
  testCases: TestCaseError[];
  lengthError: string;
}

export function generateDefaultTestCase(): TestCaseField {
  return {
    input: "",
    expectedOutput: "",
    hint: "",
    visibility: TestCaseVisibility.IO_VISBILE,
  };
}
