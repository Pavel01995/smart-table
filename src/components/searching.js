import { rules } from "../lib/compare.js";

export function initSearching(searchField) {
    // Просто создаем функцию правила
    const searchRule = rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false);

    return (data, state, action) => {
        const query = state[searchField];

        // Если поле пустое — ничего не делаем
        if (!query) return data;

        // Фильтруем массив напрямую функцией правила
        return data.filter(row => searchRule(row, query));
    }
}