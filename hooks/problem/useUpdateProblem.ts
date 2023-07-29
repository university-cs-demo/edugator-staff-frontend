import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Content } from "@tiptap/react";
import { apiRoutes } from "constants/apiRoutes";
import { COURSE_STRUCTURE_QUERY_KEY } from "hooks/course/useGetCourseStructure";
import apiClient from "lib/api/apiClient";
import { RootState } from "lib/store/store";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

type TestCaseUpdate = {
  testType: string;
  input: string;
  expectedOutput: string;
  hint: string;
  visibility: number;
  feedback: string;
  orderNumber: number;
};

export interface ProblemUpdate {
  title: string;
  hidden: boolean;
  fileName: string;
  dueDate: string;
  statement: string | Content;
  codeHeader: string;
  codeBody: string;
  codeFooter: string;
  templatePackage: string;
  timeLimit: number;
  memoryLimit: number;
  buildCommand: string;
  languages: string;
  moduleId: string;
  testCases: TestCaseUpdate[];
}

export const useUpdateProblem = (problemId: string) => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const { courseId } = router.query;

  if (!courseId) {
    throw new Error("Course id not found");
  }

  const updateProblem = async (problem: ProblemUpdate) => {
    const { data } = await apiClient.put(
      apiRoutes.v2.admin.updateProblem(problemId),
      problem
    );
    return data;
  };

  return useMutation<ProblemUpdate, Error, ProblemUpdate>(updateProblem, {
    onSuccess: () => {
      // invalidate course structure query
      queryClient.invalidateQueries([COURSE_STRUCTURE_QUERY_KEY, courseId]);
      queryClient.invalidateQueries(["problem", problemId]);
      queryClient.invalidateQueries([
        "problem",
        "978f5c19-e07d-4999-b88a-f39d2e812080",
      ]);
    },
  });
};
