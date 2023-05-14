import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import WebApi, { baseButtonMappings } from "../Services/WebApi";
import { percentage, toKB } from "../Services/Utilities";
import UpdateMessage from "../Components/UpdateMessage";

const defaultState = {
	isLoading: true,
	error: "",
	updateMessage: "",
	version: {
		currentVersion: process.env.REACT_APP_CURRENT_VERSION,
		latestVersion: "",
		latestTag: "",
	},
	memoryReport: {
		totalFlash: 0,
		usedFlash: 0,
		staticAllocs: 0,
		totalHeap: 0,
		usedHeap: 0,
		percentageFlash: "",
		percentageHeap: "",
	},
	keyMappings: baseButtonMappings,
	gamepadOptions: {},
};

const StateContext = createContext({ state: defaultState, update: (x) => {} });

export const StateProvider = ({ children }) => {
	const [state, setState] = useState(defaultState);

	useEffect(() => {
		Promise.all([
			WebApi.getFirmwareVersion(),
			axios.get(
				"https://api.github.com/repos/OpenStickCommunity/GP2040-CE/releases/latest"
			),
			WebApi.getMemoryReport(),
			WebApi.getKeyMappings(),
			WebApi.getGamepadOptions(),
		])
			.then(
				([
					firmwareVersion,
					latestVersion,
					memoryReport,
					keyMappings,
					gamepadOptions,
				]) => {
					setState({
						isLoading: false,
						error: "",
						updateMessage: "",
						version: {
							currentVersion: firmwareVersion.currentVersion,
							latestVersion: latestVersion?.data?.name,
							latestTag: latestVersion?.data?.tag_name,
						},
						memoryReport: {
							totalFlash: toKB(memoryReport.totalFlash),
							usedFlash: toKB(memoryReport.usedFlash),
							staticAllocs: toKB(memoryReport.staticAllocs),
							totalHeap: toKB(memoryReport.totalHeap),
							usedHeap: toKB(memoryReport.usedHeap),
							percentageFlash: percentage(
								memoryReport.usedFlash,
								memoryReport.totalFlash
							),
							percentageHeap: percentage(
								memoryReport.usedHeap,
								memoryReport.totalHeap
							),
						},
						keyMappings,
						gamepadOptions,
					});
				}
			)
			.catch((error) => {
				setState((state) => ({
					...state,
					isLoading: false,
					error: `Failed to setup connection to board: ${error}`,
				}));
			});
	}, []);

	const update = async (apiCall) => {
		try {
			await apiCall;
			setState((state) => ({
				...state,
				updateMessage: "Saved! Please Restart Your Device",
			}));
		} catch (error) {
			setState((state) => ({
				...state,
				updateMessage: `Failed to update: ${error}`,
			}));
		}
	};

	return (
		<StateContext.Provider value={{ state, update }}>
			{state.isLoading ? (
				<p>Connecting to board</p>
			) : state.error ? (
				<p>{state.error}</p>
			) : (
				<>
					{state.updateMessage && (
						<UpdateMessage
							onClose={() =>
								setState((state) => ({ ...state, updateMessage: "" }))
							}
							message={state.updateMessage}
						/>
					)}
					{children}
				</>
			)}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
