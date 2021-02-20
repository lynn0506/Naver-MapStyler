import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Popover } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../store';
import HistoryList from '../../components/HistoryList';
import { applyHistoryMapboxStyle } from '../../store/map';
import { resetHistoryMode, setHistoryStyle } from '../../store/history';
import { ButtonName } from '../../model/store';

const { HISTORY } = ButtonName;

interface HistoryContainerProps {
	className: string;
	onClickHistoryButton: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const HistoryContainer = ({ className, onClickHistoryButton }: HistoryContainerProps) => {
	const selectedButton = useSelector((state: AppState) => state.map.selectedMode);
	const historyList = useSelector((state: AppState) => state.history.historyList);
	const featureName = useSelector((state: AppState) => state.map.featureName);
	const dispatch = useDispatch();

	const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number>(historyList.length - 1);

	useEffect(() => {
		if (featureName && selectedButton === HISTORY) {
			dispatch(resetHistoryMode());
		}
	}, [dispatch, featureName, selectedButton]);

	const selectHistory = useCallback(
		(index: number) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			e.preventDefault();
			setSelectedHistoryIndex(index);
			dispatch(setHistoryStyle(index));
		},
		[dispatch],
	);

	const onClickApplyHistoryButton = useCallback(() => {
		const currentIndex = historyList.length - 1;
		if (selectedHistoryIndex !== currentIndex)
			dispatch(applyHistoryMapboxStyle(selectedHistoryIndex));
		dispatch(resetHistoryMode());
	}, [dispatch, historyList.length, selectedHistoryIndex]);

	const onVisibleChange = useCallback(
		(visible: boolean) => {
			if (visible) {
				const currentIndex = historyList.length - 1;
				setSelectedHistoryIndex(currentIndex);
				dispatch(setHistoryStyle(currentIndex));
			}
		},
		[dispatch, historyList.length],
	);

	const historyListTitle = <div className="history-list-title">History List</div>;
	const historyListContent = useMemo(
		() => (
			<>
				<HistoryList
					historyList={historyList}
					selectedIndex={selectedHistoryIndex}
					selectHistory={selectHistory}
				/>
				<Button className="apply-history-button" type="link" onClick={onClickApplyHistoryButton}>
					Apply
				</Button>
			</>
		),
		[historyList, onClickApplyHistoryButton, selectHistory, selectedHistoryIndex],
	);

	return (
		<Popover
			placement="bottom"
			title={historyListTitle}
			trigger="click"
			visible={selectedButton === HISTORY}
			onVisibleChange={onVisibleChange}
			content={historyListContent}>
			<Button type="link" className={className} onClick={onClickHistoryButton}>
				History
			</Button>
		</Popover>
	);
};

export default React.memo(HistoryContainer);
