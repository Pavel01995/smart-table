export function initFiltering(elements, indexes) {
    // 1. Заполняем выпадающие списки
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
        // 2. Очистка конкретного поля
        if (action && action.name === "clear") {
            const fieldName = action.dataset.field;
            if (fieldName) {
                state[fieldName] = "";
                const input = action.parentElement.querySelector("input, select");
                if (input) input.value = "";
            }
        }

        // 3. Глобальный сброс
        if (action && action.name === "reset") {
            Object.keys(state).forEach((key) => (state[key] = ""));
        }

        // 4. Прямая фильтрация со всеми полями
        return data.filter((row) => {
            // --- Проверка Даты ---
            // Имя поля в форме может быть searchByDate или date
            const dateValue = state.searchByDate ?? state.date ?? "";
            if (
                dateValue &&
                !String(row.date || "")
                    .toLowerCase()
                    .includes(dateValue.toLowerCase())
            ) {
                return false;
            }

            // --- Проверка Покупателя ---
            const customerValue = state.searchByCustomer ?? state.customer ?? "";
            if (
                customerValue &&
                !String(row.customer || "")
                    .toLowerCase()
                    .includes(customerValue.toLowerCase())
            ) {
                return false;
            }

            // --- Проверка Продавца ---
            const sellerValue = state.searchBySeller ?? state.seller ?? "";
            if (
                sellerValue &&
                !String(row.seller || "")
                    .toLowerCase()
                    .includes(sellerValue.toLowerCase())
            ) {
                return false;
            }

            // --- Проверка: Сумма ОТ (>=) ---
            if (state.totalFrom) {
                if (parseFloat(row.total) < parseFloat(state.totalFrom)) {
                    return false;
                }
            }

            // --- Проверка: Сумма ДО (<=) ---
            if (state.totalTo) {
                if (parseFloat(row.total) > parseFloat(state.totalTo)) {
                    return false;
                }
            }

            // Если ни одно условие не выкинуло строку (return false), значит она нам подходит
            return true;
        });
    };
}
