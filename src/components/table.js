import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach((subName) => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });
    after.forEach((subName) => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener("change", () => {
        onAction();
    });

    // 2. Отслеживаем сброс формы (кнопки type="reset")
    root.container.addEventListener("reset", () => {
        // Используем нулевой таймаут, чтобы дождаться, пока браузер очистит поля
        setTimeout(onAction);
    });

    // 3. Отслеживаем отправку формы (кнопки пагинации или сабмит поиска)
    root.container.addEventListener("submit", (e) => {
        e.preventDefault(); // Останавливаем перезагрузку страницы
        onAction(e.submitter); // Передаем кнопку, которая вызвала отправку
    });
    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map((item) => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach((key) => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    // Возвращаем объект, который содержит всё из root (container, elements)
    // и добавляем к нему нашу функцию render, чтобы её можно было вызвать снаружи
    return { ...root, render };
}
