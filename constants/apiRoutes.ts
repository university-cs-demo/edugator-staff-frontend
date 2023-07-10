export const apiRoutes = {
  student: {
    getLesson: (id: string) => `v1/student/lesson/${id}`,
    getProblem: (id: string) => `v1/student/problem/${id}`,
    getModules: "v1/module/",
    getNavigation: "v1/module/WithNonHiddenProblems",
    runCode: "v1/code/run",
    runCodeSubmission: "v1/code/run/submission",
    runCodeEvaluation: "v1/code/run/evaluate",
    health: "v1/health"
  },
  admin: {
    getLesson: (id: string) => `v1/admin/lesson/${id}`,
    getProblem: (id: string) => `v1/admin/problem/${id}`,
    getNavigation: "v1/module/WithProblems",
    getAccounts: "v1/user/getUsers",
    createAccount: "v1/user/create",
    updateUser: "v1/user/updateUser",
    deleteUser: "v1/user/deleteUser",
    createProblem: "v1/admin/problem",
    editProblem: (id: string) => `v1/admin/problem/${id}`,
    putLesson: (id: string) => `v1/admin/lesson/${id}`,
    createLesson: "v1/admin/lesson",
    deleteLesson: (id: string) => `v1/admin/lesson/${id}`,
    deleteProblem: (id: string) => `v1/admin/problem/${id}`,
    changeProblemOrder: "v1/module/changeProblemOrder",
  },
};
