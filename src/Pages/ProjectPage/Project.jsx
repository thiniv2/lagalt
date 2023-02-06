import "./Project.css";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { getUserById } from "../../Services/User";
import ProjectProgress from "../../Components/ProjectProgress/ProjectProgress";
import {
	acceptApplicant,
	addNewApplicant,
	deleteApplicant,
} from "../../Services/Projects";
import Lobby from "../../Components/ChatPanel/Lobby";
import {
	HubConnectionBuilder,
	LogLevel,
	HttpTransportType,
} from "@microsoft/signalr";
import Chat from "../../Components/ChatPanel/Chat";

const Project = () => {
	const { projectId } = useParams();
	const [project, setProject] = useState([]);
	const { user } = useUser();
	const [owner, setOwner] = useState("");
	const [userId, setUserId] = useState("");
	const [connection, setConnection] = useState();
	const [messages, setMessages] = useState([]);
	const [open, setOpen] = useState(false);
	const [projectApplicants, setProjectApplicants] = useState([]);
	const [projectContributors, setProjectContributors] = useState([]);
	const applicationRef = useRef();
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSaveChanges = () => {
		console.log(applicationRef.current.value);
		// funktion kutsu servicestä: userID, projectID applicationLetter
		addNewApplicant(
			user.microsoftId,
			projectId,
			applicationRef.current.value,
			user.name
		);
		setOpen(false);
	};

	const handleClickAccept = async (event) => {
		event.preventDefault();
		await acceptApplicant(projectId, event.target.value);
		setProjectApplicants((prev) =>
			prev.filter((applicant) => applicant.userId !== event.target.value)
		);
		const newContributor = project.applicants.find(
			(contributor) => contributor.userId === event.target.value
		);
		console.log(newContributor.userId);
		let num = false;
		projectContributors.forEach((contributor) => {
			console.log(contributor);
			if (contributor.id === newContributor.userId) {
				console.log("User already in contributors");
				num = true;
			}
		});
		if (!num) {
			setProjectContributors((prev) => [...prev, newContributor]);
		}
	};

	const handleClickDecline = (event) => {
		event.preventDefault();
		if (window.confirm("Are you sure?")) {
			deleteApplicant(event.target.value, projectId).then((res) =>
				console.log(res)
			);
			setProjectApplicants((prev) =>
				prev.filter((applicant) => applicant.userId !== event.target.value)
			);
			console.log(projectApplicants);
		}
	};

	const joinRoom = async (user, room) => {
		try {
			const connection = new HubConnectionBuilder()
				.withUrl(process.env.REACT_APP_API_URL + "chat", {
					skipNegotiation: true,
					transport: HttpTransportType.WebSockets,
				})
				.configureLogging(LogLevel.Information)
				.build();

			connection.on("ReceiveMessage", (user, message) => {
				setMessages((messages) => [...messages, { user, message }]);
			});

			await connection.start();
			await connection.invoke("JoinRoom", { user, room });
			setConnection(connection);
		} catch (e) {
			console.log(e);
		}
	};

	const sendMessage = async (message) => {
		try {
			await connection.invoke("SendMessage", message);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}project/${projectId}`)
			.then((response) => response.json())
			.then((data) => {
				setProject(data);
				setProjectApplicants(data.applicants);
				setProjectContributors(data.users);
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
	}, [projectId, user]);

	const listSkillset = project.skillset?.map((i) => (
		<ListGroup.Item key={i}>{i}</ListGroup.Item>
	));

	const projectApplicant = () => {
		if (userId !== owner.id && user !== null) {
			return (
				<div className="col-12">
					<CssBaseline />
					<Container fixed className="applyContainer">
						<Box className="Box">
							<Button
								className="applyButton"
								variant="outlined"
								size="large"
								onClick={handleClickOpen}
							>
								Apply to project
							</Button>
							<Dialog open={open} onClose={handleClose}>
								<DialogTitle>Application letter</DialogTitle>
								<DialogContent>
									<DialogContentText></DialogContentText>
									<TextField
										autoFocus
										margin="dense"
										id="name"
										type="email"
										fullWidth
										variant="standard"
										inputRef={applicationRef}
										defaultValue=""
									/>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleClose}>CANCEL</Button>
									<Button onClick={handleSaveChanges}>SEND</Button>
								</DialogActions>
							</Dialog>
						</Box>
					</Container>
				</div>
			);
		}
		// Add applicant letter and name to <li>
		else if (user && userId === owner.id) {
			return (
				<table className="applicants-table">
					<thead>
						<tr className="table-headers-row">
							<th className="table-header">Applicants</th>
							<th className="table-header">Letter</th>
							<th className="table-header">Accept/Decline</th>
						</tr>
					</thead>
					<tbody>
						{projectApplicants.map((applicant, index) => {
							return (
								<tr key={index} className="applicants">
									<td className="applicant-info">{applicant.username}</td>
									<td className="applicant-info">{applicant.letter}</td>
									<td className="applicant-info-buttons">
										<button
											onClick={handleClickAccept}
											value={applicant.userId}
										>
											Accept
										</button>
										<button
											onClick={handleClickDecline}
											value={applicant.userId}
										>
											Decline
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			);
		}
	};

	return (
		<div className="row">
			<div className="col-12 titleANDdescription">
				<h3 className="ProjectTitle">{project.title}</h3>
				<div className="description">{project.description}</div>
				<div>Owner: {owner.username}</div>
			</div>
			<div className="col-12">
				{projectApplicant()}
			</div>
			<div className="col-5 skillsContainer">
				<h5>Skills</h5>
				<ListGroup as="ol" numbered className="projectSkills">
					{listSkillset}
				</ListGroup>
			</div>

			<div className="col-5 progressANDcommits">
				<ProjectProgress projectId={projectId} project={project} />
				<h5>Git repository commits here</h5>
			</div>
			<div className="col-6">
				<h5>Contributors:</h5>
				{projectContributors &&
					projectContributors.map((user, index) => {
						return <div key={index}>{user.username}</div>;
					})}
			</div>
			<div className="col-6">
				{!connection ? (
					<Lobby joinRoom={joinRoom} project={project} />
				) : (
					<Chat messages={messages} sendMessage={sendMessage} />
				)}
			</div>
			{/*<ChatPanel user={user} projectTitle={project.title} />*/}
		</div>
	);
};

export default Project;
