import React from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

interface ExportButtonProps {
	onClick: () => void;
}

const ExportButton = ({ onClick }: ExportButtonProps) => {
	return (
		<Button
			className="export"
			shape="circle"
			size="large"
			icon={<ExportOutlined />}
			onClick={onClick}
		/>
	);
};

export default ExportButton;
