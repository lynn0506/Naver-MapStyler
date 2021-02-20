import React, { useEffect, useState } from 'react';
import { Row, Col, Image } from 'antd';
import { useSelector } from 'react-redux';

import FeatureSider from './sider/FeatureSider';
import LayerPropertySider from './sider/LayerPropertySider';
import siderHeaderIcon from '../assets/images/sider-header-icon.png';
import ButtonContainer from './ButtonContainer';
import ExportContainer from './ExportContainer';
import { AppState } from '../store';

const StylerContainer = () => {
	const selectedFeature = useSelector((state: AppState) => state.map.featureName);
	const [isSecondSiderOpened, setIsSecondSiderOpened] = useState<boolean>(false);

	useEffect(() => {
		selectedFeature ? setIsSecondSiderOpened(true) : setIsSecondSiderOpened(false);
	}, [selectedFeature]);

	return (
		<>
			<div className="sider-container">
				<Row className={`${isSecondSiderOpened ? 'full' : 'half'}-header`}>
					<Image className="sider-header-icon" src={siderHeaderIcon} preview={false} />
					<Col>Map Styler</Col>
				</Row>
				<Row>
					<FeatureSider />
					<LayerPropertySider
						currentFeatureName={selectedFeature}
						collapsed={!isSecondSiderOpened}
					/>
				</Row>
			</div>
			<ButtonContainer isCenterPosition={isSecondSiderOpened} />
			<ExportContainer />
		</>
	);
};

export default React.memo(StylerContainer);
