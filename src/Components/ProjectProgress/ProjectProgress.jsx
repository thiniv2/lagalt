import { Button, FormControl, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { updateProgress } from "../../Services/Projects";
import { getUserById } from "../../Services/User";

const ProjectProgress = (props) => {
  const [progress, setProgress] = useState("");
  const [progressText, setProgressText] = useState("");
  const [owner, setOwner] = React.useState("");
  const { user } = useUser();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}project/${props.projectId}`)
      .then((response) => response.json())
      .then((data) => {
        setProgress(data.progress);
        setProgressText(data.progress);
        if (user) {
          setUserId(user.microsoftId);
        }
        getUserById(data.owner).then((res) => {
          setOwner(res);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [user, props.projectId]);

  const handleSubmit = () => {
    setProgressText(`${progress}`);
    updateProgress(`${progress}`, `${props.projectId}`);
    alert(`Set project progress to: ${progress}`);
  };

  const editPanel = () => {
    if (userId === owner.id && user) {
      return (
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          >
            <MenuItem value={"Founding"}>Founding</MenuItem>
            <MenuItem value={"In progress"}>In progress</MenuItem>
            <MenuItem value={"Stalled"}>Stalled</MenuItem>
            <MenuItem value={"Completed"}>Completed</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </FormControl>
      );
    }
  };

  return (
    <div className="projectProgress">
      Progress: {progressText} <br />
      {editPanel()}
    </div>
  );
};

export default ProjectProgress;
