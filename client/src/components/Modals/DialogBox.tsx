import classes from "./DialogBox.module.css";

interface ModalProps {
  id: string;
  title: string;
  body: string;
  setDeleteModel: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: (id: string) => void;
}

const DialogBox = ({
  id,
  title,
  body,
  setDeleteModel,
  onDelete,
}: ModalProps) => {
  return (
    <>
      <div
        className={classes.backdrop}
        onClick={() => setDeleteModel(false)}
      ></div>

      <div className={classes.modal}>
        <header className={classes.header}>
          <h2>{title}</h2>
        </header>

        <div className={classes.content}>
          <p>{body}</p>
        </div>

        <footer className={classes.actions}>
          <button
            className={classes.btn}
            style={{ backgroundColor: "#CD2027" }}
            type="button"
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
          <button
            className={classes.btn}
            style={{ backgroundColor: "#5fb5c6" }}
            type="button"
            onClick={() => setDeleteModel(false)}
          >
            Cancel
          </button>
        </footer>
      </div>
    </>
  );
};

export default DialogBox;
