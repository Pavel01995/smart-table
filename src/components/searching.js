export function initSearching(searchField) {
    return (data, state, action) => {
        const query = state[searchField];

        // Если поиск пустой, возвращаем все данные
        if (!query) {
            return data;
        }

        // Приводим запрос к нижнему регистру для поиска без учета регистра
        const lowerQuery = query.toLowerCase().trim();

        // Фильтруем данные напрямую
        return data.filter(row => {
            // Проверяем каждое из трех полей на наличие подстроки
            const matchDate = String(row.date || "").toLowerCase().includes(lowerQuery);
            const matchCustomer = String(row.customer || "").toLowerCase().includes(lowerQuery);
            const matchSeller = String(row.seller || "").toLowerCase().includes(lowerQuery);

            // Если хоть одно поле содержит искомый текст, оставляем строку
            return matchDate || matchCustomer || matchSeller;
        });
    };
}