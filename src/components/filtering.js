export function initFiltering(elements, indexes) {
    // 1. Заполняем выпадающие списки (этот кусок у тебя работает отлично)
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map((name) => {
                    const option = document.createElement("option");
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
            );
        }
    });

    return (data, state, action) => {
        // 2. Обработка кнопки очистки конкретного поля
        if (action && action.name === "clear") {
            const fieldName = action.dataset.field;
            if (fieldName) {
                state[fieldName] = "";
                const input = action.parentElement.querySelector("input, select");
                if (input) input.value = "";
            }
        }

        // 3. Обработка глобального сброса (reset)
        if (action && action.name === "reset") {
            Object.keys(state).forEach(key => state[key] = "");
        }

        // 4. Прямая фильтрация данных
        return data.filter((row) => {
            // Проверка: Продавец (селект)
            if (state.searchBySeller && row.seller !== state.searchBySeller) {
                return false; // не совпадает — выкидываем строку
            }

            // Проверка: Сумма ОТ (больше или равно)
            if (state.totalFrom) {
                if (parseFloat(row.total) < parseFloat(state.totalFrom)) {
                    return false;
                }
            }

            // Проверка: Сумма ДО (меньше или равно)
            if (state.totalTo) {
                if (parseFloat(row.total) > parseFloat(state.totalTo)) {
                    return false;
                }
            }

            // Если строка прошла все проверки, оставляем её
            return true;
        });
    };
}