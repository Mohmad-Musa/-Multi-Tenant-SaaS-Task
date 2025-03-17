import Task from "../Modules/task.model.js";
import User from "../Modules/user.model.js";
import Organization from "../Modules/organization.model.js";
import getUserRoleForOrg from "../lib/userRole.js";

export const CreateTask = async (req, res) => {
  const data = req.body;
  const userId = req.user._id;

  try {
    // Find the organization
    const org = await Organization.findOne({ name: data.organization });
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Get the current user's role in the org
    const currentUser = await User.findById(userId);
    const currentUserRole = getUserRoleForOrg(currentUser, org._id);

    if (currentUserRole == "Member") {
      return res
        .status(403)
        .json({ message: "Only Admins or Managers can create tasks" });
    }

    // Create the task
    const newTask = new Task({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      organization: org._id,
      createdBy: userId,
      assignedTo: data.assignedTo || null,
    });

    await newTask.save();

    res.status(201).json({ task: newTask });
  } catch (error) {
    console.log("Error in CreateTask controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const ViewAllTaskForOrg = async (req, res) => {
  const { OrgId } = req.params;

  try {
    const tasks = await Task.find({ organization: OrgId }).populate(
      "assignedTo organization",
      "fullname email name"
    );

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this organization" });
    }

    res.status(200).json({
      organizationTasks: tasks,
    });
  } catch (error) {
    console.log("Error in ViewAllTaskForOrg controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getTaskById = async (req,res) =>{
    const {TaskId} = req.params 
try{
const task = await Task.findById(TaskId).populate(
  "assignedTo",
  "fullname email"
);
if(!task)
         res.status(500).json({ message: "task Id is not correct" });
res.status(200).json({
  task : task  
})

}
catch(error){
        console.log("Error in GetTaskById controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
}

}

export const ViewAllTaskForUser = async (req, res) => {
  const { UserId } = req.params;

  try {
    const tasks = await Task.find({ assignedTo: UserId })

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this User" });
    }

    res.status(200).json({
      UserTasks: tasks,
    });
  } catch (error) {
    console.log("Error in ViewAllTaskForUser controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const DeleteTask = async (req, res) => {
  const { TaskId } = req.params;
  const userId = req.user._id;

  try {
    const task = await Task.findById(TaskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const currentUser = await User.findById(userId);
    const userRole = getUserRoleForOrg(currentUser, task.organization);


    if (userRole == "Member") {
      return res.status(403).json({ message: "Not authorized to delete task" });
    }

    await Task.findByIdAndDelete(TaskId);

    res.status(200).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    console.log("Error in DeleteTask controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const UpdateTask = async (req, res) => {
  const { TaskId } = req.params;
  const updatedData = req.body;
  const userId = req.user._id;

  try {
    const task = await Task.findById(TaskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const currentUser = await User.findById(userId);
    const userRole = getUserRoleForOrg(currentUser, task.organization);

    if (userRole == "Member") {
      return res.status(403).json({ message: "Not authorized to update task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      TaskId,
      {
        title: updatedData.title,
        description: updatedData.description,
        status: updatedData.status,
        priority: updatedData.priority,
        dueDate: updatedData.dueDate,
        assignedTo: updatedData.assignedTo,
      },
      { new: true }
    );

    res.status(200).json({ updatedTask });
  } catch (error) {
    console.log("Error in UpdateTask controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};