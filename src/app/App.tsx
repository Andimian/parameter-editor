import React, { useRef } from 'react';
import styles from './app.module.scss';

interface Props {
	params: Param[];
	model: Model;
}

export interface Param {
	id: number;
	name: string;
	type: 'string';
}

export interface Model {
	paramValues: ParamValue[];
	colors: Color[];
}

interface ParamValue {
	paramId: number;
	value: string;
}

type Color = string; // Предположительно цвет будет задан в виде HEX строки
interface State {
	paramValues: Record<number, string>;
}

interface ParamRowProps {
	param: Param,
	value: string,
	onChange: (value: string) => void,
}

/**
 * Строка в редакторе параметров, которая содержит параметр и его значение.
 */
const StringParamInput = ({param, value, onChange}: ParamRowProps) => {
	return (
		<div>
			<div className={styles.param}>{param.name}</div>
			<input
				type='text'
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
}

/** Это так скажем объект соответствия, чтобы динамически создавать компонент с нужным типом */
const rowParamEditorByType: Record<Param['type'], React.FC<ParamRowProps>> = {
	string: StringParamInput,
	/* здесь закладываю расширение на случай если нужно будет добавить дополнительные типы параметров, например для
	типа number добавлю соответствующий компонент NumberParamInput. */
};

class ParamEditor extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		// Записать в state значения параметров как объект вида: {[paramId: number]: string}
		const initialParamValues: Record<number, string> = {};
		props.model.paramValues.forEach((paramValue) => {
			// Предполагаем что id параметра при создании идентично id значения параметра
			// Но на всякий случай обработаем
			const param = props.params.find((param) => paramValue.paramId === param.id);
			initialParamValues[paramValue.paramId] = param ? paramValue.value : '';
		})
		this.state = {paramValues: initialParamValues};
	}

	getModel = () => {
		return {
			paramValues: Object.entries(this.state.paramValues).map(
				([paramId, value]) => ({paramId: +paramId, value})
			),
			colors: this.props.model.colors,
		};
	}

	onChange = (paramId: number, value: string) => {
		this.setState((prevState) => ({
				paramValues: {
					...prevState.paramValues,
					[paramId]: value
				}
			})
		);
	}

	render = () => {
		const { params } = this.props;
		const { paramValues } = this.state;

		return (
			<div className={styles.editor}>
				<h2>Редактор параметров</h2>
				{params.map((param) => {
					{/* Для каждого параметра отрисовываем соответствующий компонент ввода. Если нужно будеть добавлять
					 новые типы параметров - создам дополнительно редактор, например NumberParamInput
					 */}
					const RowEditor = rowParamEditorByType[param.type];
					return (
						<RowEditor
							key={param.id}
							param={param}
							value={paramValues[param.id]}
							onChange={(value) => this.onChange(param.id, value)}
						/>
					);
				})}
			</div>
		);
	}
}

function App() {
	const params: Param[] = [
		{ id: 1, name: 'Назначение', type: 'string' },
		{ id: 2, name: 'Длина', type: 'string' }

	];

	const model: Model = {
		paramValues: [
			{ paramId: 1, value: 'повседневное' },
			{ paramId: 2, value: 'макси' }
		],
		colors: []
	};

	const editorRef = useRef<ParamEditor>(null);

	return (
		<>
			<div className={styles.container}>
				<ParamEditor ref={editorRef} params={params} model={model}/>
				<button
					onClick={() => {
						if (editorRef.current) {
							const model = editorRef.current.getModel();
							console.log(model);
							alert(JSON.stringify(model, null, 2));
						}
					}}
					style={{marginTop: 16}}
				>
					Получить модель
				</button>
			</div>
		</>
	)
}

export default App;
