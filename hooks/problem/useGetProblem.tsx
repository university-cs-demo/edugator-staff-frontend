// basically same as useGetLesson but with problem instead of lesson
import { useQuery } from "@tanstack/react-query";
import { Content } from "@tiptap/react";
import { apiRoutes } from "constants/apiRoutes";
import apiClient from "lib/api/apiClient";
import { toast } from "react-hot-toast";

export interface TestCase {
  id?: string;
  testType?: string;
  input: string;
  expectedOutput: string;
  hint: string;
  visibility: number;
  feedback?: string;
  orderNumber?: number;
  createdAt?: string;
  updatedAt?: string;
  problemId?: string;
}

export interface Problem {
  id?: string;
  title: string;
  statement: string | Content;
  hidden: boolean;
  fileName: string;
  dueDate: string;
  codeHeader: string;
  codeBody: string;
  codeFooter: string;
  templatePackage: string;
  timeLimit: number;
  memoryLimit: number;
  buildCommand: string;
  languages: string;
  orderNumber?: number;
  createdAt?: string;
  updatedAt?: string;
  moduleId?: string;
  testCases: TestCase[];
}

type GetProblemParams = {
  problemId: string;
};

const fetchProblem = async ({ problemId }: GetProblemParams) => {
  const { data } = await apiClient.get(
    apiRoutes.v2.admin.getProblem(problemId)
  );
  return data;
};

export const useGetProblem = ({ problemId }: GetProblemParams) => {
  return useQuery<Problem, Error>({
    refetchOnWindowFocus: false,
    queryKey: ["problem", problemId],
    queryFn: () => fetchProblem({ problemId }),
    onError: () => {
      toast.error("Error loading problem");
    },
  });
};