import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
// @todo: подключение


// Исходные данные используемые в render()
// В начале файла, где объявляешь переменные
// ... импорты ...

const api = initData(sourceData);

// Сначала объявляем функции, которые нужны для render
function collectState() {
    const formData = new FormData(sampleTable.container);
    const state = processFormData(formData);
    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage) || 10,
        page: parseInt(state.page) || 1
    };
}

async function render(action) {
    const state = collectState();
    let query = {};

    // Проверка на наличие функций (защита от ошибок инициализации)
    if (typeof applySearching === 'function') query = applySearching(query, state, action);
    if (typeof applyFiltering === 'function') query = applyFiltering(query, state, action);
    if (typeof applySorting === 'function') query = applySorting(query, state, action);
    if (typeof applyPagination === 'function') query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);

    if (typeof updatePagination === 'function') updatePagination(total, query);
    sampleTable.render(items);
}

// Инициализируем таблицу
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Подключаем пагинацию
const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span') || el;
        if (input) {
            input.value = page;
            input.checked = isCurrent;
        }
        label.textContent = page;
        return el;
    }
);

// Подключаем остальные модули
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements, {
    searchBySeller: [] // пока пусто, обновим в init
});

const applySearching = initSearching('search');

// Добавляем в DOM
const appRoot = document.querySelector('#app');
if (appRoot) {
    appRoot.appendChild(sampleTable.container);
}

// Запуск
async function init() {
    const freshIndexes = await api.getIndexes();
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: freshIndexes.sellers
    });
    await render();
}

init();