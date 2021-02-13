import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { auth } from "../firebase";
import ReactModal from "react-modal";
import styled from "styled-components";
import { apiURL } from "../api";

const Signup = ({ userAuth, setUserInfo }) => {
	const [modalIsOpen, setIsOpen] = useState(false);

	const revealPassword = useRef();

	useEffect(async () => {
		if (userAuth !== null) {
			console.log("PROFILE: ", userAuth);
			const result = await axios(`${apiURL}/users/${userAuth.uid}`);
			setUserInfo(result.data.user);
		}
	}, [userAuth, modalIsOpen, setUserInfo]);

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const togglePassword = e => {
		console.log("hi");
	};

	const signUpUser = e => {
		e.preventDefault();
		let name = "";
		let bio = "";
		let title = "";

		if (e.target[2].value === "") {
			name = "Mysterious User";
		} else {
			name = e.target[2].value;
		}

		if (e.target[3].value === "") {
			bio = "Mysterious Person";
		} else {
			bio = e.target[3].value;
		}

		if (e.target[4].value === "") {
			title = "Mysterious";
		} else {
			title = e.target[4].value;
		}

		const form = {
			email: e.target[0].value,
			password: e.target[1].value,
			name: name,
			bio: bio,
			title: title,
		};
		auth
			.createUserWithEmailAndPassword(form.email, form.password)
			.then(userCredential => {
				// Signed in
				const user = userCredential.user;
				axios
					.post(`${apiURL}/users/add`, {
						userFirebaseUID: user.uid,
						email: form.email,
						name: form.name,
						bio: form.bio,
						title: form.title,
					})
					.then(response => {
						console.log("SIGNUP: in backend axios auth", response);
						setUserInfo(response.data.user);
						closeModal();
					})
					.catch(error => {
						console.log(error);
					});
			})
			.catch(error => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(`${errorCode}: ${errorMessage}`);
			});
	};

	return (
		<StyledSignUp>
			<button onClick={openModal} className="home-button">
				Sign Up
				<div className="home-button__horizontal"></div>
				<div className="home-button__vertical"></div>
			</button>

			<ReactModal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel="Login"
				className="study-modal signup-modal"
				overlayClassName="study-overlay">
				<form onSubmit={signUpUser}>
					<h3>Sign Up!</h3>
					<div className="form-row">
						<label htmlFor="email">Email:*</label>
						<input type="text" name="email" id="email" placeholder="example@exam.com" />
					</div>

					<div className="form-row">
						<label htmlFor="password">Password:*</label>
						<input
							ref={revealPassword}
							type="password"
							name="password"
							id="password"
							placeholder="example123"
						/>
						<div className="show-password">
							<input type="checkbox" onClick={togglePassword} /> Show Password
						</div>
					</div>

					<div className="form-row">
						<label htmlFor="name">Name:</label>
						<input type="text" name="name" id="name" placeholder="Ecma Script" />
					</div>

					<div className="form-row">
						<label htmlFor="bio">Bio:</label>
						<textarea
							type="text"
							name="bio"
							id="bio"
							placeholder="Helping the world one person at a time."
							rows="3"
							maxLength="150"
						/>
					</div>

					<div className="form-row">
						<label htmlFor="title">Title:</label>
						<input type="text" name="title" id="title" placeholder="Frontend Developer" />
					</div>

					<div className="modal-buttons">
						<button type="submit">sign up</button>
						<button onClick={closeModal}>close</button>
					</div>
				</form>
			</ReactModal>
		</StyledSignUp>
	);
};

const StyledSignUp = styled.div`
	button {
		color: white;
		background: #59afff;
		padding: 0.7rem 1.5rem;
		font-size: 24px;
		margin-bottom: 2.5rem;
		width: 190px;
	}
	button:hover {
		background: #488ccc;
	}
`;

export default Signup;
