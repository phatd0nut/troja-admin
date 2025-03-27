import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
  CloseIcon,
  SaveIcon,
  DeleteIcon,
} from "../utils/MaterialUI";
import Button from "./Button";

/**
 * @component SubjectModal
 * @example
 * <SubjectModal isOpen={true} onClose={handleClose} onSave={handleSave} />
 *
 * @param {Object} props - Komponentens egenskaper.
 * @param {boolean} props.isOpen - Anger om modalen är öppen.
 * @param {function} props.onClose - Funktion som anropas när modalen stängs.
 * @param {function} props.onSave - Funktion som anropas när ett ämne sparas.
 *
 * @description
 * SubjectModal är en komponent som visar en modal där användaren kan ange och spara ämnen. 
 * Användaren kan också välja tidigare sparade ämnen eller rensa alla sparade ämnen.
 *
 * @returns {JSX.Element} En JSX-element som representerar modalen.
 */
const SubjectModal = ({ isOpen, onClose, onSave }) => {
  const [subject, setSubject] = useState("");
  const [savedSubjects, setSavedSubjects] = useState([]);
  const subjectRef = useRef("");

  useEffect(() => {
    const savedSubjects =
      JSON.parse(localStorage.getItem("savedSubjects")) || [];
    setSavedSubjects(savedSubjects);
  }, []);

  useEffect(() => {
    subjectRef.current = subject;
  }, [subject]);

  const handleSaveSubject = () => {
    const updatedSubjects = [...savedSubjects, subjectRef.current];
    setSavedSubjects(updatedSubjects);
    localStorage.setItem("savedSubjects", JSON.stringify(updatedSubjects));
    onSave(subjectRef.current);
    onClose();
  };

  const handleSelectSubject = (selectedSubject) => {
    setSubject(selectedSubject);
    subjectRef.current = selectedSubject;
    onSave(selectedSubject);
    onClose();
  };

  const handleClearSubjects = () => {
    localStorage.removeItem("savedSubjects");
    setSavedSubjects([]);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...modalStyle, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" color="primary">
            Ange rubrik för utskick
          </Typography>
          <Button
            onClick={onClose}
            variant="text"
            color="secondary"
            endIcon={<CloseIcon />}
            sx={{
              "& .MuiButton-endIcon": {
                margin: 0,
                padding: 0,
              },
            }}
          />
        </Box>
        <TextField
          fullWidth
          label="Ny rubrik"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            subjectRef.current = e.target.value;
          }}
          sx={{ mt: 4 }}
        />
        <Typography variant="h6" sx={{ mt: 4 }}>
          Tidigare sparade rubriker
        </Typography>
        <List sx={{ mb: 2, maxHeight: 300, overflow: "auto" }}>
          {savedSubjects.map((savedSubject, index) => (
            <ListItem
              button="true"
              key={index}
              onClick={() => handleSelectSubject(savedSubject)}
              sx={{
                cursor: "pointer",
                padding: 0,
                paddingLeft: 1,
                "&:hover": {
                  backgroundColor: "rgba(220, 46, 52, 0.2)",
                },
              }}
            >
              <ListItemText primary={savedSubject} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSubject}
            endIcon={<SaveIcon />}
          >
            Spara
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearSubjects}
            endIcon={<DeleteIcon />}
          >
            Rensa sparade rubriker
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "50%",
  minWidth: 600,
  minHeight: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

export default SubjectModal;
