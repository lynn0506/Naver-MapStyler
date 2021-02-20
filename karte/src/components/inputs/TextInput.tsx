import React, { useCallback } from 'react';
import { Button, Input } from 'antd';
import { UndoOutlined } from '@ant-design/icons';

interface TextInputProps {
	value: string;
	placeholder: string;
	onChangeText: (text: string | null) => void;
}

const TextInput = (props: TextInputProps) => {
	const { value, placeholder, onChangeText } = props;
	const onChangeValue = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChangeText(e.target.value);
		},
		[onChangeText],
	);

	const onClickReset = useCallback(() => {
		onChangeText(null);
	}, [onChangeText]);

	return (
		<div className="text-input">
			<Input
				value={value}
				onChange={onChangeValue}
				placeholder={placeholder}
				suffix={
					<Button shape="circle" size="small" icon={<UndoOutlined />} onClick={onClickReset} />
				}
			/>
		</div>
	);
};

TextInput.defaultProps = {
	placeholder: 'Enter the text',
};

export default React.memo(TextInput);
