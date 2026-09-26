import express from "express";
import {
  aggregateNotes,
  createNote,
  deleteAllNotes,
  deleteNote,
  getNoteByContent,
  getNoteById,
  notesWithUser,
  paginateSortNotes,
  replaceNote,
  updateAllNotesTitle,
  updateNote,
} from "../controller/note.controller.js";

const router = express.Router();
router.post("/", createNote);
router.patch("/all", updateAllNotesTitle);
router.get("/paginate-sort", paginateSortNotes);
router.get("/note-by-content", getNoteByContent);
router.get("/note-with-user", notesWithUser);
router.get("/aggregate", aggregateNotes);
router.put("/replace/:noteId", replaceNote);
router.patch("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);
router.get("/:id", getNoteById);
router.delete("/", deleteAllNotes);

export default router;
