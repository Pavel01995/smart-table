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

// 1. Инициализируем API один раз
const api = initData(sourceData);
window.api = api;

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const page = parseInt(state.page) || 1;
    const rowsPerPage = parseInt(state.rowsPerPage) || 10;

    return {
        ...state,
        page,
        rowsPerPage
    };
}

async function render(action) {
    let state = collectState();
    let query = {};

    // Применяем все модули к объекту query
    if (applySearching) query = applySearching(query, state, action);
    if (applyFiltering) query = applyFiltering(query, state, action);
    if (applySorting) query = applySorting(query, state, action);
    if (applyPagination) query = applyPagination(query, state, action);

    // Получаем данные с сервера (или кеша)
    const { total, items } = await api.getRecords(query);

    // Обновляем визуальную часть
    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация компонентов
const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

const applySearching = initSearching('search');

// Вывод таблицы в DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Стартовая загрузка индексов и первый рендер
async function init() {
    try {
        const indexes = await api.getIndexes();
        // Наполняем селект продавцов именами из индексов
        updateIndexes(sampleTable.filter.elements, {
            searchBySeller: indexes.sellers
        });
    } catch (e) {
        console.error("Ошибка инициализации индексов:", e);
    }
}

// Сначала загружаем индексы, потом делаем первый рендер
init().then(() => render());