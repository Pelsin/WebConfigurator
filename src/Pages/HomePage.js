import React, { useEffect, useState } from 'react';
import axios from 'axios';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'react-i18next';

import Section from '../Components/Section';

import WebApi from '../Services/WebApi';

const percentage = (x, y) => (x / y * 100).toFixed(2)
const toKB = (x) => parseFloat((x / 1024).toFixed(2))

export default function HomePage() {
	const [latestVersion, setLatestVersion] = useState('');
	const [latestTag, setLatestTag] = useState('');
	const [currentVersion, setCurrentVersion] = useState(process.env.REACT_APP_CURRENT_VERSION);
	const [memoryReport, setMemoryReport] = useState(null);
	const { t, i18n } = useTranslation('translation', {keyPrefix: 'homePage'});

	useEffect(() => {
		WebApi.getFirmwareVersion().then(response => {
			setCurrentVersion(response.version);
		})
		.catch(console.error);

		WebApi.getMemoryReport().then(response => {
			const unit = 1024;
			const {totalFlash, usedFlash, staticAllocs, totalHeap, usedHeap} = response;
			setMemoryReport({
				totalFlash: toKB(totalFlash),
				usedFlash: toKB(usedFlash),
				staticAllocs: toKB(staticAllocs),
				totalHeap: toKB(totalHeap),
				usedHeap: toKB(usedHeap),
				percentageFlash: percentage(usedFlash, totalFlash),
				percentageHeap: percentage(usedHeap, totalHeap)
			});
		})
		.catch(console.error);

		axios.get('https://api.github.com/repos/OpenStickCommunity/GP2040-CE/releases')
			.then((response) => {
				const sortedData = orderBy(response.data, 'published_at', 'desc');
				setLatestVersion(sortedData[0].name);
				setLatestTag(sortedData[0].tag_name);
			})
			.catch(console.error);
	}, []);

	return (
		<div>
			<h1>Translation Demo with fallback!</h1>
			<button onClick={() => i18n.changeLanguage('en')}>English</button>
			<button onClick={() => i18n.changeLanguage('sv')}>Svenska</button>

			<h1>{t('title')}</h1>
			<p>{t('subTitle')}</p>
			<Section title="System Stats">
				<div>
					<div><strong>{t('version')}</strong></div>
					<div>{t('currentVersion', { currentVersion })}</div>
					<div>{t('latestVersion', { latestVersion })}</div>
					{(latestVersion && currentVersion !== latestVersion) &&
						<div className="mt-3 mb-3">
							<a
								target="_blank"
								rel="noreferrer"
								href={`https://github.com/OpenStickCommunity/GP2040-CE/releases/tag/${latestTag}`}
								className="btn btn-primary"
							>{t('getLatestVersion')}</a>
						</div>
					}
					{memoryReport &&
						<div>
							<strong>{t('memory')}</strong>
							<div>{t('flash', {used: memoryReport.usedFlash, total: memoryReport.usedFlash, percentage: memoryReport.percentageFlash})}</div>
							<div>{t('heap', {used: memoryReport.usedHeap, total: memoryReport.totalHeap, percentage: memoryReport.percentageHeap})}</div>
							<div>{t('allocs', {value: memoryReport.staticAllocs})}</div>
						</div>
					}
				</div>
			</Section>
		</div>
	);
}
