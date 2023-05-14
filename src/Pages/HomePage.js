import React from "react";

import Section from "../Components/Section";
import { useStateContext } from "../Contexts/State";

export default function HomePage() {
	const {
		state: { version, memoryReport },
	} = useStateContext();

	return (
		<div>
			<h1>Welcome to the GP2040-CE Web Configurator!</h1>
			<p>Please select a menu option to proceed.</p>
			<Section title="System Stats">
				<div>
					<div>
						<strong>Version</strong>
					</div>
					<div>Current: {version.currentVersion}</div>
					<div>Latest: {version.latestVersion}</div>
					{version.latestVersion &&
						version.currentVersion !== version.latestVersion && (
							<div className="mt-3 mb-3">
								<a
									target="_blank"
									rel="noreferrer"
									href={`https://github.com/OpenStickCommunity/GP2040-CE/releases/tag/${version.latestTag}`}
									className="btn btn-primary"
								>
									Get Latest Version
								</a>
							</div>
						)}
					{memoryReport && (
						<div>
							<strong>Memory (KB)</strong>
							<div>
								Flash: {memoryReport.usedFlash} / {memoryReport.totalFlash} (
								{memoryReport.percentageFlash}%)
							</div>
							<div>
								Heap: {memoryReport.usedHeap} / {memoryReport.totalHeap} (
								{memoryReport.percentageHeap}%)
							</div>
							<div>Static Allocations: {memoryReport.staticAllocs}</div>
						</div>
					)}
				</div>
			</Section>
		</div>
	);
}
