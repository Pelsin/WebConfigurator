import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import WebApi from "../Services/WebApi";
import { percentage, toKB } from "../Services/Utilities";

const defaultState = {
	isLoading: true,
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
	error: "",
};

const StateContext = createContext(defaultState);

export const StateProvider = ({ children }) => {
	const [state, setState] = useState(defaultState);

	useEffect(() => {
		Promise.all([
			WebApi.getFirmwareVersion(),
			axios.get(
				"https://api.github.com/repos/OpenStickCommunity/GP2040-CE/releases/latest"
			),
			WebApi.getMemoryReport(),
		])
			.then(([firmwareVersion, latestVersion, memoryReport]) => {
				setState({
					isLoading: false,
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
					error: "",
				});
			})
			.catch((error) => {
				setState((state) => ({
					...state,
					isLoading: false,
					error: `Failed to setup connection to board: ${error}`,
				}));
			});
	}, []);

	return (
		<StateContext.Provider value={state}>
			{state.isLoading && "Connecting to board"}
			{state.error && state.error}
			{!state.isLoading && !state.error && children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
