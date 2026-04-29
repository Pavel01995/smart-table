export function initSearching(searchField) {
    return (query, state, action) => {
        return state[searchField] ? Object.assign({}, query, {
            search: state[searchField]
        }) : query;

        const lowerQuery = query.toLowerCase().trim();

        return data.filter(row => {
            const matchDate = String(row.date || "").toLowerCase().includes(lowerQuery);
            const matchCustomer = String(row.customer || "").toLowerCase().includes(lowerQuery);
            const matchSeller = String(row.seller || "").toLowerCase().includes(lowerQuery);

            return matchDate || matchCustomer || matchSeller;
        });
    };
}