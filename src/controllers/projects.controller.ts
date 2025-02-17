import { Request, Response } from "express";
import { Project } from "../models/projects.model";
import { ProjectStatus } from "../@types/globle.interface";
import { Types } from "mongoose";

export const createProject = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status, members, dueDate, title, description } = req.body;
    const { id } = req.headers;

    const project = new Project({
      userId: new Types.ObjectId(String(id)),
      title,
      description,
      status,
      members,
      dueDate: new Date(dueDate).getTime(),
    });
    await project.save();
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: "Error creating project", error });
  }
};

export const getProjects = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.headers;

    const projects = await Project.find({
      userId: new Types.ObjectId(String(id)),
    })
      .populate("userId")
      .populate("members.id")
      .select({
        "userId.members": 0,
      });

    return res.json({ data: { projects } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving projects", error });
  }
};

export const getSingleProjects = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("userId")
      .populate("members.id");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving project", error });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status, members, dueDate } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status, members, dueDate },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: "Error updating project", error });
  }
};

export const changeStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status } = req.body;
    // Optionally, validate that status is one of ProjectStatus enum values
    if (!Object.values(ProjectStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid project status" });
    }
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error updating project status", error });
  }
};

// export const addOrRemoveMemberFromProject = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const { addMembers, removeMemberIds } = req.body;
//     // addMembers: array of objects { id, role }
//     // removeMemberIds: array of userId strings to remove
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     if (addMembers && Array.isArray(addMembers)) {
//       // Append new members
//       project.members.push(...addMembers);
//     }
//     if (removeMemberIds && Array.isArray(removeMemberIds)) {
//       // Filter out members that match the IDs to remove
//       project.members = project.members.filter(
//         (member) => !removeMemberIds.includes(member.id.toString())
//       );
//     }
//     await project.save();
//     // Populate members to return complete info
//     await project.populate("userId").populate("members.id").execPopulate();
//     res.json(project);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating project members", error });
//   }
// };

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};
