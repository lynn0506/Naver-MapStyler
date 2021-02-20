import React from 'react';
import { Layout } from 'antd';

import MapViewContainer from './container/MapViewContainer';
import StylerContainer from './container/StylerContainer';
import './scss/main.scss';

const { Content } = Layout;

const App = () => {
	return (
		<Layout className="App">
			<StylerContainer />
			<Content className="map-view-container">
				<MapViewContainer />
			</Content>
		</Layout>
	);
};

export default App;
