import getUserRoleForOrg from "../lib/userRole.js";
import Organization from "../Modules/organization.model.js";
import User from "../Modules/user.model.js";

export const NewOrg = async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create new org with creator as a member
    const newOrg = new Organization({
      name,
      members: [{ user: userId }],
    });

    await newOrg.save();

    // Assign "Admin" role for this org to the user
    user.roles.push({
      organization: newOrg._id,
      role: "Admin",
    });

    await user.save();

    res.status(201).json({ organization: newOrg });
  } catch (error) {
    console.error("Error in NewOrg controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const AddMember = async (req, res) => {
  const { id } = req.params; // id of the user to add
  const { name, role } = req.body; // name of the org, role to assign (optional)
  const currentUserId = req.user._id;

  try {
    const org = await Organization.findOne({ name });
    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    const currentUser = await User.findById(currentUserId);


      const currentUserRole = getUserRoleForOrg(currentUser, org._id);

    if (currentUserRole !== "Admin") {
      return res.status(403).json({ message: "Only Admins can add members" });
    }

    const userToAdd = await User.findById(id);
    if (!userToAdd)
      return res.status(404).json({ message: "User to add not found" });

    // Check if already a member
    const isAlreadyMember = org.members.some(
      (m) => m.user.toString() === userToAdd._id.toString()
    );
    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this org" });
    }

    // Add to org members
    org.members.push({ user: userToAdd._id });
    await org.save();

    // Add org role to user
    userToAdd.roles.push({
      organization: org._id,
      role: role || "Member", // default to Member if not provided
    });
    await userToAdd.save();

    res.status(200).json({ message: "User added successfully", org });
  } catch (error) {
    console.error("Error in AddMember controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const OrgDetails = async (req,res) =>{
const {id} = req.params
try {
    const details = await Organization.findById(id)
    if(!details)
        res.status(400).json({message:"Invalid id"})

    res.status(200).json({
        org:details,
        message:"done"
    })
} catch (error) {
  console.error("Error in Org Details controller:", error.message);
  res.status(500).json({ message: "Internal Server Error" });
}
}

export const RemoveMemberFromOrg = async (req,res) =>{
const {id} = req.params
const {name} = req.body
  const currentUserId = req.user._id;

try {
 const org = await Organization.findOne({ name });
 if (!org) return res.status(404).json({ message: "Organization not found" });

 const currentUser = await User.findById(currentUserId);

 const currentUserRole = getUserRoleForOrg(currentUser, org._id);

 if (currentUserRole !== "Admin") {
   return res.status(403).json({ message: "Only Admins can add members" });
 }
   const userToRemove = await User.findById(id);
   if (!userToRemove)
     return res.status(404).json({ message: "User not found" });

   // Check if user is part of the organization
   const isMember = org.members.some(
     (m) => m.user.toString() === userToRemove._id.toString()
   );

   if (!isMember) {
     return res
       .status(400)
       .json({ message: "User is not a member of this org" });
   }

   // Remove user from org members
   org.members = org.members.filter(
     (m) => m.user.toString() !== userToRemove._id.toString()
   );
   await org.save();

   // Remove org role from user
   userToRemove.roles = userToRemove.roles.filter(
     (r) => r.organization.toString() !== org._id.toString()
   );
   await userToRemove.save();

   res
     .status(200)
     .json({ message: "User removed from organization successfully" });

} catch (error) {
  console.error("Error in RemoveMemberFromOrg controller:", error.message);
  res.status(500).json({ message: "Internal Server Error" });
}



}

