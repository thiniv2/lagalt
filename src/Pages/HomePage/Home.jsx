import ProjectBanner from "../../Components/Utils/ProjectBanner";
import CategoryButton from "../../Components/Home/CategoryButton";
import React, { useState, useEffect } from "react";
import { FormControl, TextField } from "@mui/material";
import "./Home.css";
import { addNewProject, getAllProjectBanners } from "../../Services/Projects";
import { useProjectBanners } from "../../Context/ProjectBannerContext";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	Stack,
	DialogActions,
	Select,
	MenuItem,
	InputLabel,
} from "@mui/material";
import { useUser } from "../../Context/UserContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const CATEGORIES = [
	"Music",
	"Film",
	"Web Development",
	"Game Development",
	"View all",
];

const Home = () => {
	const [searchText, setSearchText] = useState("");
	const { projectBanners, setProjectBanners } = useProjectBanners();
	const [visibleBanners, setVisibleBanners] = useState(null);
	const [open, setOpen] = useState(false);
	const [projectTitle, setProjectTitle] = useState("");
	const [projectField, setProjectField] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [projectSkills, setProjectSkills] = useState("");
	const { user } = useUser();

	useEffect(() => {
		if (projectBanners !== null) {
			setVisibleBanners(projectBanners);
		}
	}, [projectBanners]);

	// useEffect for the search functionality
	useEffect(() => {
		if (projectBanners !== null) {
			setVisibleBanners(
				projectBanners.filter((banner) => {
					return (
						banner.title.toLowerCase().includes(searchText.toLowerCase()) ||
						banner.field.toLowerCase().includes(searchText.toLowerCase())
					);
				})
			);
		}
	}, [searchText, projectBanners]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmit = async () => {
		let skillsArray = projectSkills.split(",").map((skill) => skill.trim());

		let projectData = {
			title: projectTitle,
			description: projectDescription,
			skillSet: skillsArray,
			field: projectField,
			ownerId: user.microsoftId,
			progress: "Founding",
		};

		await addNewProject(projectData).then((res) => {
			getAllProjectBanners().then((res) => {
				res.forEach((banner) => {
					banner.field = banner.field.split(/(?=[A-Z])/).join(" ");
				});

				setProjectBanners(res);
			});
		});
		setOpen(false);
	};

	const handleSelectChange = (event) => {
		setProjectField(event.target.value);
	};

	const theme = createTheme({
		palette: {
			themeColor: {
				main: "#0092ca",
				contrastText: "#fff",
			},
		},
	});

	return (
		<div className="row">
			<h3 className="col-11 homePageTitle">Projects</h3>

			<div className="col-6 col-s-12">
				<div className="categoryButtons">
					{CATEGORIES.map((field, index) => {
						return (
							<CategoryButton
								setVisibleBanners={setVisibleBanners}
								title={field}
								key={index}
							/>
						);
					})}
				</div>
			</div>

			<div className="col-3 col-s-12">
				<div className="searchBar">
					<FormControl>
						<TextField
							id="filled-basic"
							label="Search"
							variant="outlined"
							fullWidth
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
						/>
					</FormControl>
				</div>
			</div>

			<div className="col-3 addNewProject">
				{user && (
					<ThemeProvider theme={theme}>
						<Button
							variant="outlined"
							color="themeColor"
							size="medium"
							onClick={handleClickOpen}
						>
							Add New Project
						</Button>
					</ThemeProvider>
				)}
				<Dialog
					open={open}
					onClose={handleClose}
					PaperProps={{ sx: { width: "100%", maxWidth: "40%" } }}
				>
					<DialogTitle>Project</DialogTitle>
					<DialogContent>
						<Stack spacing={5}>
							<TextField
								value={projectTitle}
								onChange={(e) => setProjectTitle(e.target.value)}
								id="standard-basic"
								label="Title"
								variant="standard"
								type="text"
							></TextField>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Field</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={projectField}
									label="Field"
									onChange={handleSelectChange}
								>
									<MenuItem value={0}>Music</MenuItem>
									<MenuItem value={1}>Film</MenuItem>
									<MenuItem value={2}>Game Development</MenuItem>
									<MenuItem value={3}>Web Development</MenuItem>
								</Select>
							</FormControl>
							<TextField
								value={projectDescription}
								onChange={(e) => setProjectDescription(e.target.value)}
								id="standard-basic"
								label="Description"
								variant="standard"
								type="text"
							></TextField>
							<TextField
								value={projectSkills}
								onChange={(e) => setProjectSkills(e.target.value)}
								id="standard-basic"
								label="Skills, separated by a comma"
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

			<div className="col-9 col-s-12 banners">
				{visibleBanners ? (
					visibleBanners.map((banner, index) => {
						return <ProjectBanner banner={banner} key={index} />;
					})
				) : (
					<h3>Loading projects...</h3>
				)}
			</div>
		</div>
	);
};

export default Home;
