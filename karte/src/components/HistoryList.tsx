import React, { useCallback } from 'react';
import { List } from 'antd';

import { HistoryEntity } from '../model/store';
import { StylePropertyName } from '../model/property';
import ColorProperty from './ColorProperty';

interface HistoryListProps {
	historyList: HistoryEntity[];
	selectedIndex: number;
	selectHistory: (index: number) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const { FILL, STROKE } = StylePropertyName;

const HistoryList = (props: HistoryListProps) => {
	const { historyList, selectedIndex, selectHistory } = props;

	const renderItem = useCallback(
		({ label, property, value }: HistoryEntity, index: number) => {
			return (
				<List.Item
					className={`${index <= selectedIndex ? 'selected-' : ''}item`}
					onClick={selectHistory(index)}>
					<List.Item.Meta title={label as string} />
					{(property === FILL || property === STROKE) && <ColorProperty color={value as string} />}
				</List.Item>
			);
		},
		[selectHistory, selectedIndex],
	);

	return (
		<List
			itemLayout="horizontal"
			className="history-list"
			dataSource={historyList}
			renderItem={renderItem}
		/>
	);
};

export default React.memo(HistoryList);
