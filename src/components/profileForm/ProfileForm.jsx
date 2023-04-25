import React, { useEffect, useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import './profile.css';
import { authContext } from '../../contexts/auth';
import { contractorContext } from '../../contexts/ContractorContext';
import { techDataSchema, formInputs } from '../../constants/data';
import Upload from '../upload/Upload';
import InputSection from '../inputSection/InputSection';
import { style } from '@mui/system';
import { Padding } from '@mui/icons-material';

export default function ProfileForm() {
	const { user } = useContext(authContext);
	const {
		updateTechObject,
		currentUserProfile,
		matchProfileToCurrentUser,
		contractorMap,
	} = useContext(contractorContext);
	// const [profileImageUrl, setProfileImageUrl] = useState(null);
	const [imgUrl, setImgUrl] = useState(null);
	const [resumeFileUrl, setResumeFileUrl] = useState({ resume: '' });
	const [initialFormData, setInitialFormData] = useState(techDataSchema);
	const [skills, setSkills] = useState([{ skill: '' }]);
	const [projects, setProjects] = useState([
		{ projectName: '', description: '' },
	]);

	useEffect(() => {
		if (!currentUserProfile) {
			// toast.info('first');
			matchProfileToCurrentUser();
		}
	}, [user, contractorMap]);

	const addSkill = () => {
		setSkills((prevSkills) => [...prevSkills, { skill: '' }]);
	};

	const addProject = () => {
		setProjects((prevProjects) => [
			...prevProjects,
			{ projectName: '', description: '' },
		]);
	};

	const form = useRef();

	const onChange = (e) => {
		setInitialFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const data = {
			id: currentUserProfile?.id,
			name: currentUserProfile?.name || initialFormData?.name,
			email: currentUserProfile?.email || initialFormData?.email,
			summary: currentUserProfile?.summary || initialFormData?.summary,
			profileImg: currentUserProfile?.profileImg || imgUrl,
			otherInfo: {
				linkedinUrl:
					currentUserProfile?.linkedinUrl || initialFormData.linkedinUrl,
				githubUrl: currentUserProfile?.githubUrl || initialFormData.githubUrl,
				resume: currentUserProfile?.resume || initialFormData?.resume,
			},
			skills: skills || currentUserProfile?.skills,
			projects: projects || currentUserProfile?.projects,
		};
		console.log(data);
		updateTechObject(data);
	};

	return (
		<>
			{currentUserProfile && (
				<div className='updateForm flexCenter'>
					<form className='flexCenter' ref={form} onSubmit={onSubmit}>
						<div className='formContainer'>
							{formInputs?.map((section) => (
								<div key={section?.sectionTitle} className='formSection '>
									<h3>{section?.sectionTitle}</h3>
									{section?.fields?.map((field) => (
										<InputSection
											key={field?.name}
											value={initialFormData[field?.name] || ''}
											field={field}
											onChange={onChange}
										/>
									))}
								</div>
							))}
							{/* </div>
						<div className='flexCenter formContainer'> */}
							<div className='formSection '>
								<h3>Projects</h3>
								{projects.map((project, index) => (
									<div
										key={`project-${index}`}
										// className='formSection '
										style={{ flexDirection: 'column', display: 'flex' }}
									>
										<InputSection
											value={project.projectName}
											field={{
												name: `projectName-${index}`,
												label: `Project ${index + 1} Name`,
												placeholder: `Project ${index + 1} Name`,
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, projectName: value } : p
													)
												);
											}}
										/>
										<InputSection
											value={project.description}
											field={{
												name: `description-${index}`,
												label: `Project ${index + 1} Description`,
												type: 'textArea',
												placeholder: `Project ${index + 1} Description`,
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, description: value } : p
													)
												);
											}}
										/>
									</div>
								))}
								<button type='button' onClick={addProject}>
									Add Project
								</button>
							</div>

							<div className='formSection'>
								<h3>Skills</h3>
								{skills.map((skill, index) => (
									<InputSection
										key={`skill-${index}`}
										value={skill.skill}
										field={{
											name: `skill-${index}`,
											label: `Skill ${index + 1}`,
											type: 'text',

											placeholder: `Skill ${index + 1}`,
										}}
										onChange={(e) => {
											const value = e.target.value;
											setSkills((prevSkills) =>
												prevSkills.map((s, i) =>
													i === index ? { ...s, skill: value } : s
												)
											);
										}}
									/>
								))}
								<button type='button' onClick={addSkill}>
									Add Skill
								</button>
							</div>
						</div>
						<button className='customButton' type='submit'>
							<span>Save</span>
						</button>
					</form>
					<div className='profileImgUpload'>
						<Upload
							setImgUrl={setImgUrl}
							imgUrl={imgUrl}
							// setProfileImageUrl={setProfileImageUrl}
						/>
					</div>
				</div>
			)}
		</>
	);
}
