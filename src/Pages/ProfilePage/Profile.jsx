import ProfileBio from "../../Components/ProfileBio/ProfileBio"
import ProjectBanner from "../../Components/Utils/ProjectBanner"
import { useUser } from "../../Context/UserContext"
import "./Profile.css"
import { useEffect, useState } from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
} from "@mui/material"
import SkillItem from "../../Components/ProfileBio/SkillItem"
import { getProjectsByOwnerId } from "../../Services/Projects"
import { storageRead, storageSave } from "../../Utils/Storage"
import { getSkills, updateSkills } from "../../Services/User"

const Profile = () => {
  const [skill, setSkill] = useState("")
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const [userProjects, setUserProjects] = useState([])
  const [visibleSkills, setVisibleSkills] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const projects = await getProjectsByOwnerId(user.microsoftId)
        setUserProjects(projects.data)
        const res = await getSkills(user.microsoftId)
        setVisibleSkills(res)
      }
    }
    fetchData()
  }, [user])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
	if (!user.skills)
		user.skills = [];
    user.skills.push(skill)
    setVisibleSkills(user.skills)
    updateSkills(user.skills, user.microsoftId)
    const tempUser = storageRead("Lagalt-user")
    storageSave("Lagalt-user", { ...tempUser, skills: user.skills })
    setOpen(false)
  }

  const deleteSkill = (skill) => {
    user.skills = user.skills.filter((_skill) => _skill !== skill)
    setVisibleSkills(user.skills)
    updateSkills(user.skills, user.microsoftId)
    const tempUser = storageRead("Lagalt-user")
    storageSave("Lagalt-user", { ...tempUser, skills: user.skills })
  }

  if (!user) {
    return <h1>Login first</h1>
  }
  return (
    <div className="row Profile">

      <h3 className = "col-12 profileTitle">{user.name}</h3>

      <div className = "col-6 ownProjects">
        <h5>Own projects</h5>
        {userProjects && user && userProjects.map((project, index) => {
          return (
            <ProjectBanner banner={project} key={index}/>
          )
        })}
      </div>
      
      <div className = "col-6">
        <ProfileBio/>
        <div className="profileSkills">
            <h5>Skills</h5>
            <ul>{visibleSkills &&  visibleSkills.map((skill, index) => {
              return <SkillItem deleteItem={deleteSkill} key={index} text={skill}/>
            })}</ul>
          <Button variant="outlined" onClick={handleClickOpen}>
            Add New Skill
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add a new skill</DialogTitle>
            <DialogContent>
              <Stack spacing={5}>
                <TextField
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  id="standard-basic"
                  label="Skill"
                  variant="standard"
                  type="text"
                ></TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      
    </div>
  )
}

export default Profile
