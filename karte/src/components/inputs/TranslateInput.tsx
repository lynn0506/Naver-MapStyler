import React, { useCallback } from 'react';
import { Col, Row } from 'antd';

import { TranslateType, NumberInputType } from '../../model/property';
import { NumberInput } from './index';

interface TranslateInputProps {
	translate: TranslateType;
	onChangeTranslate: (translate: TranslateType) => void;
}

const TranslateInput = ({ translate, onChangeTranslate }: TranslateInputProps) => {
	const onChangeNumber = useCallback(
		(axis: string) => (value: NumberInputType) => {
			typeof value === 'number' && onChangeTranslate({ ...translate, [axis]: value });
		},
		[translate, onChangeTranslate],
	);

	return (
		<>
			{Object.entries(translate).map(([axis, value]) => {
				return (
					<Row className="translate-input" align="middle" key={axis}>
						<Col>{axis}</Col>
						<Col offset={4}>
							<NumberInput value={value} onChangeNumber={onChangeNumber(axis)} />
						</Col>
					</Row>
				);
			})}
		</>
	);
};

export default React.memo(TranslateInput);
