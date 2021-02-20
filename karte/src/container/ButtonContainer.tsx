import React, { useCallback, useState } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import HistoryContainer from './mode/HistoryContainer';
import { ButtonName } from '../model/store';
import { AppState } from '../store';
import { resetFeatureData, resetSelectedMode, setSelectedMode } from '../store/map';

const { COMPARE, PICKER, HISTORY } = ButtonName;

interface ButtonContainerProps {
	isCenterPosition: boolean;
}

const ButtonContainer = ({ isCenterPosition }: ButtonContainerProps) => {
	const previousButton = useSelector((state: AppState) => state.map.selectedMode);
	const dispatch = useDispatch();

	const [isButtonListOpened, setIsButtonListOpened] = useState<boolean>(false);

	const getClassNameOfButton = useCallback(
		(currentButton: ButtonName) => {
			return previousButton === currentButton ? 'clicked-button' : 'button';
		},
		[previousButton],
	);

	const onClickButton = useCallback(
		(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			const currentButton = (e.target as HTMLElement).innerText as ButtonName;
			if (currentButton === HISTORY) dispatch(resetFeatureData());
			if (currentButton === previousButton) dispatch(resetSelectedMode());
			else dispatch(setSelectedMode(currentButton));
		},
		[previousButton, dispatch],
	);

	const toggleOpenButtonList = useCallback(
		(value: boolean) => () => {
			dispatch(resetSelectedMode());
			setIsButtonListOpened(value);
		},
		[dispatch],
	);

	return (
		<div className={`${isCenterPosition ? 'center' : 'left'}-button-container`}>
			{isButtonListOpened ? (
				<div className="opened-button-list">
					<LeftOutlined onClick={toggleOpenButtonList(false)} />
					<Button type="link" className={getClassNameOfButton(COMPARE)} onClick={onClickButton}>
						Compare
					</Button>
					<HistoryContainer
						className={getClassNameOfButton(HISTORY)}
						onClickHistoryButton={onClickButton}
					/>
					<Button type="link" className={getClassNameOfButton(PICKER)} onClick={onClickButton}>
						Picker
					</Button>
				</div>
			) : (
				<RightOutlined className="closed-button-list" onClick={toggleOpenButtonList(true)} />
			)}
		</div>
	);
};

export default React.memo(ButtonContainer);
