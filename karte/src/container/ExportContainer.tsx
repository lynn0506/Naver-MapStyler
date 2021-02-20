import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Drawer, Row } from 'antd';
import moment from 'moment';

import ExportButton from '../components/ExportButton';
import { AppState } from '../store';
import { saveJsonFile } from '../utils/map';

const ExportContainer = () => {
	const mapboxStyle = useSelector((state: AppState) => state.map.mapboxStyle);
	const [visible, setVisible] = useState(false);

	const onClickExportButton = () => {
		setVisible(true);
	};

	const onCloseDrawer = () => {
		setVisible(false);
	};

	const onClickFileExportButton = useCallback(() => {
		const timeStamp = moment().format('YYYY-MM-DD');
		saveJsonFile(JSON.stringify(mapboxStyle), `mapStyler ${timeStamp}.json`);
	}, [mapboxStyle]);

	return (
		<>
			<ExportButton onClick={onClickExportButton} />
			<Drawer title="Export Style" visible={visible} onClose={onCloseDrawer}>
				<Row>
					<div className="export-style">{JSON.stringify(mapboxStyle)}</div>
					<Button className="export-file-button" onClick={onClickFileExportButton}>
						Export JSON file
					</Button>
				</Row>
			</Drawer>
		</>
	);
};

export default ExportContainer;
