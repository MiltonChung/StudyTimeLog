import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { auth } from "./firebase";
import Loader from "react-loader-spinner";

import Log from "./components/Log.js";
import GlobalStyles from "./components/GlobalStyles.js";
import LogNav from "./components/LogNav.js";
import LogTotal from "./components/LogTotal.js";
import NewLog from "./components/NewLog.js";
import Profile from "./components/Profile.js";
import Login from "./components/Login";
import Signup from "./components/Signup";

import Landing from "./img/landing.svg";

const App = () => {
	const [userAuth, setUserAuth] = useState(null);
	const [userInfo, setUserInfo] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		auth.onAuthStateChanged(user => {
			if (user) {
				setUserAuth(user);
			} else {
				setUserAuth(null);
			}
			setIsLoading(false);
		});
	}, []);

	return (
		<BrowserRouter>
			<GlobalStyles />
			<StyledDashboard>
				{/* If it's still fetching user credentials, show loading component */}
				{isLoading ? (
					<Loader type="Watch" color="#59afff" height={350} width={350} className="loader" />
				) : (
					<>
						{/* When it fetches, check whether the user is logged in or not */}
						{/* Show the landing page if user isn't logged in */}
						{!userAuth ? (
							<div className="landing">
								<div className="userForms">
									<Signup userInfo={userInfo} setUserInfo={setUserInfo} userAuth={userAuth} />
									<Login />
								</div>
								<img src={Landing} alt="landing pic" />
							</div>
						) : (
							<>
								{/* Else show the user's profile */}
								<div className="profile">
									<Profile userAuth={userAuth} userInfo={userInfo} setUserInfo={setUserInfo} />
								</div>
								<div className="vertical-line"></div>
								<div className="logs-info">
									<LogNav userAuth={userAuth} />
									<Switch>
										<Route path="/" component={() => <Log userAuth={userAuth} />} exact />
										<Route path="/add" component={() => <NewLog userAuth={userAuth} />} exact />
										<Route path="/total" component={() => <LogTotal userAuth={userAuth} />} exact />
									</Switch>
								</div>
							</>
						)}
					</>
				)}
			</StyledDashboard>
		</BrowserRouter>
	);
};

const StyledDashboard = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(255, 255, 255, 0.253);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(16px);
	-webkit-backdrop-filter: blur(16px);
	border-radius: 25px;
	border: 1px solid rgba(255, 255, 255, 0.281);
	margin: auto;
	padding: 2rem;
	height: 85vh;
	width: 92vw;
	overflow: hidden;

	.loader {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.landing {
		display: grid;
		grid-template-columns: 1fr 2fr;
		width: 100%;
		.userForms {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		img {
			width: 100%;
			height: auto;
		}
	}

	.profile {
		flex: 1;
		height: 100%;
	}
	.vertical-line {
		height: 90%;
		width: 2px;
		background: #272727;
		border-radius: 40px;
	}
	.logs-info {
		flex: 3;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}
`;

export default App;
