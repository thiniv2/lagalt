import "./ProjectBanner.css";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../Services/User";
import { useUser } from "../../Context/UserContext";

const ProjectBanner = ({ banner }) => {
	let navigate = useNavigate();

	const [Owner, setOwner] = React.useState("");
	const [userMatchesSkills, setUserMatchesSkills] = React.useState(false);
	const { user } = useUser();
	const [projectSkillset, setProjectSkillset] = React.useState([]);

	React.useEffect(() => {
		getUserById(banner.owner).then((res) => {
			setOwner(res);
		});

		fetch(`${process.env.REACT_APP_API_URL}project/${banner.id}`)
			.then((response) => response.json())
			.then((data) => {
				setProjectSkillset(data.skillset);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}, [banner.id, banner.owner]);

	React.useEffect(
		() => {
			if (user && user.skills) {
				let numOfSkills = 0;
				switch (projectSkillset.length) {
					case 0:
						break;
					case 1:
						projectSkillset.forEach((skill) => {
							if (user.skills.includes(skill)) {
								numOfSkills += 1;
							}
						});
						if (numOfSkills >= 1) {
							setUserMatchesSkills(true);
						} else {
							setUserMatchesSkills(false);
						}
						break;
					case 2:
						projectSkillset.forEach((skill) => {
							if (user.skills.includes(skill)) {
								numOfSkills += 1;
							}
						});
						if (numOfSkills >= 2) {
							setUserMatchesSkills(true);
						} else {
							setUserMatchesSkills(false);
						}
						break;
					default:
						projectSkillset.forEach((skill) => {
							if (user.skills.includes(skill)) {
								numOfSkills += 1;
							}
						});
						if (numOfSkills >= 3) {
							setUserMatchesSkills(true);
						} else {
							setUserMatchesSkills(false);
						}
						break;
				}
			}
		},
		[banner.id, projectSkillset, user],
	);

	return (
		<div
			title={
				userMatchesSkills
					? "You have the required skills for this project!"
					: ""
			}
			className={`banner ${userMatchesSkills ? "highlighted" : ""}`}
			onClick={() => navigate(`/project/${banner.id}`)}
		>
			<div className="bannerTitle">{banner.title}</div>
			<div>{banner.field}</div>
			<div className="bannerOwner">Owner: {Owner.username}</div>
			<br></br>
			<div># of skills required: {banner.totalSkills}</div>
			{}
		</div>
	);
};

export default ProjectBanner;
