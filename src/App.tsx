/* Есть следующие структуры данных, описывающих товар – интерфейс Model и набор параметров этого товара.
1. Необходимо реализовать на React компоненты, которые позволяют редактировать структуру Model – проставлять значения
параметров.
2. При этом параметры должны выводиться все и сразу должны быть доступны для редактирования, а переданные значения в
структуре проставлены в форме редактирования, которые передаются в params: Param[],
3. а так же позволяют получить полную структуру в методе getModel() – содержащую все проставленные значения параметров.
4. Решение должно быть легко расширяемым (например, позволять легко добавлять новые типы параметров – не только
текстовые, но например числовые или со списком значений).
5. Ваша реализация должна работать только с текстовыми параметрами Input – тип string. */

import React from 'react';

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

	getModel() {
		return {
			paramValues: Object.entries(this.state.paramValues).map(
				([paramId, value]) => ({ paramId: +paramId, value })
			),
			colors: this.props.model.colors,
		};
	}

	onChange(paramId: number) {

	}
	// 6. Реализовать рендер всех полученных параметров в виде редактируемых инпутов
    // 7. решить как сделать добавление новых типов
}

// 8. Вызвать компонент редактора с переданной структорой

function App() {
	return (
		<>
			Редактор параметров

		</>
	)
}

export default App
