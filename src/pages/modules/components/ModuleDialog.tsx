import React from "react";
import { TextField, Typography, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DialogStatus, EmptyModule } from "../types";
import { useAppDispatch, useAppSelector } from "../../../app/common/hooks";
import {
  requestNewModule,
  requestModifyModule,
  closeDialog,
} from "../ModulesPage.slice";
import { IModuleBase } from "../../../shared/types";
import Dialog from "../../../shared/GenericDialog";

const NumberField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  width: "18%",
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(1),
}));

const NameTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  maxWidth: "70%",
  marginTop: theme.spacing(2),
}));

const dialogTitle = (status: DialogStatus) => {
  if (status === DialogStatus.CREATE) {
    return "Creating a new module";
  } else if (status === DialogStatus.EDIT) {
    return "Editing an existing module";
  } else {
    return "Closing this dialog";
  }
};

export function ModuleDialog() {
  const dispatch = useAppDispatch();
  const { open, action, module } = useAppSelector(
    (state) => state.modules.dialogState
  );

  const [dialogInput, setDialogInput] =
    React.useState<IModuleBase>(EmptyModule);

  React.useEffect(() => {
    if (action === DialogStatus.EDIT) {
      setDialogInput(module);
    } else {
      setDialogInput(EmptyModule);
    }
  }, [action, module]);

  const handleDialogSubmit = () => {
    if (action === DialogStatus.CREATE) {
      dispatch(requestNewModule(dialogInput));
    } else if (action === DialogStatus.EDIT) {
      dispatch(requestModifyModule(dialogInput));
    }

    // TODO:
    //  dont close before checking
    //  if action was successful
    dispatch(closeDialog());
    // make sure feedback is visible
    // when the dialog is open
  };

  const FooterButtons = [
    {
      label: "Cancel",
      onClick: () => dispatch(closeDialog()),
      variant: "contained",
      color: "error",
    },
    {
      label: action === DialogStatus.CREATE ? "Add Module" : "Edit Module",
      onClick: () => handleDialogSubmit(),
      variant: "contained",
    },
  ];

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      title={dialogTitle(action)}
      handleClose={() => dispatch(closeDialog())}
      footerContent={FooterButtons}
    >
      <>
        <Typography>
          To add a new module, or to modify a module's name and number, please
          use the form below.
        </Typography>

        <NumberField
          label="Number"
          variant="filled"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          onChange={(event) => {
            setDialogInput({
              ...dialogInput,
              number: parseInt(event.target.value),
            });
          }}
          defaultValue={
            action === DialogStatus.EDIT ? module.number : undefined
          }
          fullWidth
          required
          focused
        />

        <NameTextField
          label="Module Name"
          variant="filled"
          onChange={(event) => {
            setDialogInput({
              ...dialogInput,
              name: event.target.value,
            });
          }}
          defaultValue={action === DialogStatus.EDIT ? module.name : undefined}
          fullWidth
          required
          focused
        />
      </>
    </Dialog>
  );
}
