import React from "react";
import { Grid, Typography, TextField, MenuItem } from "@mui/material";
import { isBlank } from "../../../modules/components/ModuleDialog";
import { useAppSelector } from "../../../../app/common/hooks";
import { rolesEnum } from "../../types";

interface EditFormProps {
  nameError: boolean;
  validEmail: boolean;
  setNameError: (error: boolean) => void;
  handleEdit: (property: string, newValue: string) => void;
  emailInputRef: React.RefObject<HTMLInputElement>;
}

export function AccountEditForm(props: EditFormProps) {
  const { selectedAccount } = useAppSelector((state) => state.accountManager);

  const { nameError, validEmail, setNameError, handleEdit, emailInputRef } =
    props;

  // email textfiel ref & validation
  const [touchedEmail, setTouchedEmail] = React.useState<boolean>(false);

  return (
    <Grid container>
      <Typography>
        After editing the information, click save to send it to the database.
      </Typography>

      <Grid item xs={12}>
        <TextField
          label="Name"
          required
          fullWidth
          margin="normal"
          defaultValue={selectedAccount?.name}
          onChange={(event) => {
            const input = event.target.value;
            setNameError(isBlank(input));
            handleEdit("name", input);
          }}
          error={nameError}
          helperText={
            !nameError ? "Firstname and lastname" : "Please enter a name"
          }
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          type="email"
          label="Email"
          required
          fullWidth
          margin="normal"
          defaultValue={selectedAccount?.username}
          onChange={(event) => {
            setTouchedEmail(true);
            handleEdit("username", event.target.value);
          }}
          inputRef={emailInputRef}
          error={!validEmail && touchedEmail}
          helperText={
            !validEmail && touchedEmail
              ? "Please enter a valid email"
              : "Used to access this account"
          }
        />
      </Grid>

      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={6}>
          <TextField
            type="tel"
            label="Phone number (disabled)"
            margin="normal"
            defaultValue={selectedAccount?.phone}
            helperText="Contact information for this account"
            onChange={(event) => handleEdit("phone", event.target.value)}
            disabled
          />
        </Grid>

        <Grid item xs={5}>
          <TextField
            select
            label="Role"
            required
            fullWidth
            margin="normal"
            defaultValue={selectedAccount?.role}
            helperText="Permissions"
            onChange={(event) => handleEdit("role", event.target.value)}
          >
            <MenuItem value={rolesEnum.TA}>{rolesEnum.TA}</MenuItem>
            <MenuItem value={rolesEnum.Professor}>
              {rolesEnum.Professor}
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Grid>
  );
}
