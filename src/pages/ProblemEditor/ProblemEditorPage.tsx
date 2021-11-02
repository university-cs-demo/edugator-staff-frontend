import React from "react";
import { ProblemEditorContainer } from "./ProblemEditorContainer/ProblemEditorContainer";
import { LayoutContainer } from "../../shared/LayoutContainer";
import { useAppSelector } from "../../app/common/hooks";
import { useLocation, useParams } from "react-router-dom";

interface ProblemEditorURL {
  problemId?: string;
}

interface ProblemCreatorURL {
  moduleId?: string;
}

interface ProblemLocationState {
  moduleName?: string;
}

export const ProblemEditorPage = () => {
  const { moduleId, problemId } = useParams<
    ProblemEditorURL & ProblemCreatorURL
  >();
  const { moduleName } = useLocation<ProblemLocationState>().state;
  console.log("moduleId: " + moduleId);
  console.log("problemId: " + problemId);
  console.log("moduleName: " + moduleName);

  const problemTitle = useAppSelector(
    (state) => state.problemEditorContainer.metadata.title
  );
  const actions = [
    {
      label: "Back to Modules",
      onClick: () =>
        console.log("TODO: route back to modules and handle delete logic"),
      variant: "contained",
      color: "error",
    },
  ];

  return (
    <LayoutContainer
      pageTitle={problemTitle || "New Problem"}
      actionButtons={actions}
    >
      <ProblemEditorContainer />
    </LayoutContainer>
  );
};
