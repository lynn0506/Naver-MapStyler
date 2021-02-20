import React from 'react';
import { Switch } from 'antd';

interface SwitchInputProps {
	checked: boolean;
	onChangeSwitch: (value: boolean) => void;
}

const SwitchInput = ({ checked, onChangeSwitch }: SwitchInputProps) => {
	return <Switch checked={checked} onChange={onChangeSwitch} />;
};

export default React.memo(SwitchInput);
