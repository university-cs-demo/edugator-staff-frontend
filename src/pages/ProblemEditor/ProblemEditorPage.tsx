import React from "react";
import { ProblemEditorContainer } from "./ProblemEditorContainer/ProblemEditorContainer";
import { LayoutContainer } from "../../shared/LayoutContainer";

export const ProblemEditorPage = () => {
  const actions = [
    {
      label: "Back to Modules",
      onClick: () =>
        console.log("TODO: route back to modules and handle delete logic"),
    },
  ];

  return (
    <LayoutContainer pageTitle="New Problem" actionButtons={actions}>
      <ProblemEditorContainer />
    </LayoutContainer>
  );
};
