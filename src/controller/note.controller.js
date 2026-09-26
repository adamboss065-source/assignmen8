import Note from "../models/note.model.js";
import mongoose from "mongoose";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.query.userId;
    if (!userId) {
      return res.status(404).json({
        message: "userId is required",
      });
    }
    const note = await Note.create({
      title,
      content,
      userId,
    });
    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};
export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }
    const note = await Note.findOne({
      _id: noteId,
      userId,
    });
    if (!note) {
      return res.status(404).json({
        message: "Note not found or you are not the owner",
      });
    }
    const { title, content } = req.body;
    if (title !== undefined) {
      note.title = title;
    }
    if (content !== undefined) {
      note.content = content;
    }
    await note.save();
    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating note",
      error: error.message,
    });
  }
};
export const replaceNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.query.userId;
    const { title, content } = req.body;
    const note = await Note.findOneAndReplace(
      {
        _id: noteId,
        userId,
      },
      {
        title,
        content,
        userId,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or you are not the owner" });
    }
    res.status(200).json({
      message: "Note replaced successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};
export const updateAllNotesTitle = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { title } = req.body;
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }
    if (!title) {
      return res.status(400).json({
        message: "title is required",
      });
    }
    const result = await Note.updateMany(
      { userId },
      {
        $set: {
          title,
        },
      },
    );
    res.status(200).json({
      message: "All notes titles updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.query.userId;
    const note = await Note.deleteOne({
      _id: noteId,
      userId,
    });
    if (!note) {
      return res.status(404).json({
        message: "Note not found or you are not the owner",
      });
    }
    res.status(200).json({
      message: "Note deleted successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};
export const paginateSortNotes = async (req, res) => {
  try {
    const userId = req.query.userId;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalNotes = await Note.countDocuments({ userId });
    res.status(200).json({
      page,
      limit,
      totalNotes,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    const note = await Note.findOne({
      _id: id,
      userId,
    });
    if (!note) {
      return res.status(404).json({
        message: "Note not found or you are not the owner",
      });
    }
    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};
export const getNoteByContent = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { content } = req.query;
    if (!content) {
      return res.status(400).json({
        message: "content is required",
      });
    }
    const notes = await Note.find({
      userId,
      content,
    });
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({
      message: "Error getting notes by content",
      error: error.message,
    });
  }
};
export const notesWithUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    const notes = await Note.find({ userId })
      .select("title userId createdAt")
      .populate("userId", "email");
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({
      message: "Error getting notes with user",
      error: error.message,
    });
  }
};
export const aggregateNotes = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { title } = req.query;
    const match = {
      userId: new mongoose.Types.ObjectId(userId),
    };
    if (title) {
      match.title = title;
    }
    const notes = await Note.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          createdAt: 1,
          user: {
            name: "$user.name",
            email: "$user.email",
          },
        },
      },
    ]);
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({
      message: "Error aggregating notes",
      error: error.message,
    });
  }
};
export const deleteAllNotes = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }
    const result = await Note.deleteMany({ userId });
    res.status(200).json({
      message: "All notes deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting notes",
      error: error.message,
    });
  }
};
