import React, { useCallback } from 'react';
import { MapContext } from 'react-mapbox-gl';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { CameraFilled } from '@ant-design/icons';

const MapScreenShot = () => {
	const takeScreenshot = useCallback(
		(map) => async () => {
			const image = await new Promise((resolve) => {
				map.once('render', () => {
					resolve(map.getCanvas().toDataURL());
				});
				map.triggerRepaint();
			});
			const timeStamp = moment().format('YYYY-MM-DD A h.mm.ss');
			if (image) saveAs(image as string, `mapStyler ${timeStamp}.png`);
		},
		[],
	);

	return (
		<MapContext.Consumer>
			{(map) => <CameraFilled className="screen-capture" onClick={takeScreenshot(map)} />}
		</MapContext.Consumer>
	);
};

export default React.memo(MapScreenShot);
