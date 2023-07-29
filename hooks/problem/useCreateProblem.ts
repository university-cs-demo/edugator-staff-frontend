import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "constants/apiRoutes";
import { COURSE_STRUCTURE_QUERY_KEY } from "hooks/course/useGetCourseStructure";
import apiClient from "lib/api/apiClient";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "lib/store/store";
import { useRouter } from "next/router";
import { Problem } from "./useGetProblem";

type TestCaseCreate = {
  testType: string;
  input: string;
  expectedOutput: string;
  hint: string;
  visibility: number;
  feedback: string;
  orderNumber: number;
};

type ProblemCreate = {
  title: string;
  hidden: boolean;
  fileName: string;
  dueDate: string;
  statement: string;
  codeHeader: string;
  codeBody: string;
  codeFooter: string;
  templatePackage: string;
  timeLimit: number;
  memoryLimit: number;
  buildCommand: string;
  languages: string;
  moduleId: string;
  testCases: TestCaseCreate[];
  //awaiting impl
  difficulty: string;
  author: string;
  codeSolution: string;
};

// takes in ProblemCreate, returns a Problem object. define type as promise
const createProblem = async (problem: ProblemCreate): Promise<Problem> => {
  const { data } = await apiClient.post(
    apiRoutes.v2.admin.createProblem,
    problem
  );
  return data;
};

export const useCreateProblem = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { courseId } = router.query;

  return useMutation<Problem, Error, ProblemCreate>(createProblem, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([COURSE_STRUCTURE_QUERY_KEY, courseId]);
      toast.success("Problem created successfully");

      const id = data.id;

      console.log(data);

      router.push({
        pathname: `/courses/${courseId}/problem/edit/${id}`,
        query: {
          courseId,
        },
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
