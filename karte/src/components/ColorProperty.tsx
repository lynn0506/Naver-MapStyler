import React from 'react';
import { BorderOutlined } from '@ant-design/icons';

interface ColorPropertyProps {
	color: string;
}

const ColorProperty = ({ color }: ColorPropertyProps) => {
	return (
		<BorderOutlined
			className="color-property"
			style={{
				backgroundColor: `${color}`,
			}}
		/>
	);
};

export default React.memo(ColorProperty);
