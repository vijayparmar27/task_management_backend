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

    const membersIds = members.map(
      (member: any) => new Types.ObjectId(String(member.id))
    );

    const project = new Project({
      userId: new Types.ObjectId(String(id)),
      title,
      description,
      status,
      membersIds: membersIds,
      dueDate: new Date(dueDate).getTime(),
    });

    await project.save();

    return res.status(201).json({ message: "created successfully." });
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

    const projectsAggregate = await Project.aggregate([
      {
        $match: {
          $or: [
            {
              userId: new Types.ObjectId(String(id)),
            },
            {
              membersIds: { $in: [new Types.ObjectId(String(id))] },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "membersIds",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          title: 1,
          description: 1,
          status: 1,
          dueDate: 1,
          "members._id": 1,
          "members.name": 1,
          "members.email": 1,
          user: {
            _id: { $arrayElemAt: ["$users._id", 0] },
            name: { $arrayElemAt: ["$users.name", 0] },
          },
        },
      },
    ]);

    return res.json({ data: { projects: projectsAggregate } });
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
    const project = await Project.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "membersIds",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          title: 1,
          description: 1,
          status: 1,
          dueDate: 1,
          "members._id": 1,
          "members.name": 1,
          "members.email": 1,
          user: {
            _id: { $arrayElemAt: ["$users._id", 0] },
            name: { $arrayElemAt: ["$users.name", 0] },
          },
        },
      },
    ]);

    if (project.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json({ data: { project: project[0] } });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving project", error });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status, members, dueDate, title, description } = req.body;

    const membersIds = members.map(
      (member: any) => new Types.ObjectId(String(member.id))
    );

    // TODO : dueDate set all day

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        status,
        membersIds,
        dueDate: new Date(dueDate).getTime(),
        title,
        description,
      },
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
