import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map((name) => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === "clear") {
            const parent = action.parentElement;
            const input = parent.querySelector("input");

            if (input) {
                input.value = "";
            }

            const fieldName = action.dataset.field;
            if (fieldName) {
                state[fieldName] = "";
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        // Мы используем filter, чтобы оставить только те строки (row),
        // которые соответствуют состоянию фильтров (state) по правилам defaultRules.
        return data.filter((row) => compare(row, state));
    };
}
