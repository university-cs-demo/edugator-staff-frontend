//https://javascript.plainenglish.io/creating-a-confirm-dialog-in-react-and-material-ui-3d7aaea1d799
import IconButton from "@mui/material/IconButton/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "./ConfirmationDialog";
import { useState } from "react";

const ConfirmDelete = (props: {
  title: string;
  body: string;
  onConfirm: any;
}) => {
  const { title, body, onConfirm } = props;
  const [open, setOpen] = useState(false);
  return (
    <div>
      <IconButton aria-label="delete" onClick={() => setOpen(true)}>
        <DeleteIcon />
      </IconButton>
      <ConfirmDialog
        title={title}
        setOpen={setOpen}
        onConfirm={onConfirm}
        open={open}
      >
        {body}
      </ConfirmDialog>
    </div>
  );
};
export default ConfirmDelete;
