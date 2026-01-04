<template>
    <h1>Пример использования</h1>
    <p>
        Импортируем компонент и передаем <code>config</code> и
        <code>v-model</code> для хранения данных формы:
    </p>

    <div class="example">
        <pre><code>&lt;script setup lang="ts"&gt;
import GenForm from "@/components/GenForm.vue";

const formData = {
  email: { value: '', errors: [] },
  subscribe: { value: false, errors: [] }
};

const formConfig = {
  fields: [
    {
      name: "email",
      type: "input",
      attrs: { type: "email", placeholder: "Введите email" },
      label: { text: "Email", attrs: { for: "email" } },
      validators: [
        (value) =&gt; !value ? "Email обязателен" : undefined
      ],
      validtionMode: "eager"
    },
    {
      name: "subscribe",
      type: "checkbox",
      label: { text: "Подписаться на рассылку" }
    }
  ]
};
&lt;/script&gt;

&lt;template&gt;
  &lt;GenForm
    :config="formConfig"
    v-model="formData"
    @submit="values =&gt; console.log('Отправлено', values)"
    @reset="() =&gt; console.log('Форма сброшена')"
  /&gt;
&lt;/template&gt;
</code></pre>
    </div>

    <h2>Описание пропсов</h2>
    <table>
        <tbody>
            <tr>
                <th>Пропс</th>
                <th>Тип</th>
                <th>Описание</th>
            </tr>
            <tr>
                <td>config</td>
                <td><code>GenFormConfig</code></td>
                <td>
                    Объект конфигурации формы, описывает поля, их атрибуты,
                    валидаторы и режим валидации.
                </td>
            </tr>
            <tr>
                <td>v-model / modelValue</td>
                <td><code>GenFormData</code></td>
                <td>
                    Реактивный объект для хранения текущих значений и ошибок
                    полей формы.
                </td>
            </tr>
        </tbody>
    </table>

    <h2>Описание событий</h2>
    <table>
        <tbody>
            <tr>
                <th>Событие</th>
                <th>Аргументы</th>
                <th>Описание</th>
            </tr>
            <tr>
                <td>update:modelValue</td>
                <td><code>GenFormData</code></td>
                <td>Срабатывает при изменении данных формы.</td>
            </tr>
            <tr>
                <td>submit</td>
                <td><code>Record&lt;string, any&gt;</code></td>
                <td>
                    Срабатывает при успешной отправке формы, содержит только
                    значения полей.
                </td>
            </tr>
            <tr>
                <td>reset</td>
                <td>—</td>
                <td>Срабатывает при сбросе формы.</td>
            </tr>
        </tbody>
    </table>

    <h2>Использование слотов</h2>
    <p>
        Компонент поддерживает кастомные слоты для меток, ошибок и опций select:
    </p>
    <ul>
        <li>
            <code>&lt;slot name="label"&gt;</code> — кастомная метка для всех
            полей
        </li>
        <li>
            <code>&lt;slot :name="&lt;field-name&gt;-label"&gt;</code> —
            кастомная метка для конкретного поля
        </li>
        <li>
            <code>&lt;slot name="error"&gt;</code> — кастомный вывод ошибок для
            всех полей
        </li>
        <li>
            <code>&lt;slot :name="&lt;field-name&gt;-error"&gt;</code> —
            кастомный вывод ошибок для конкретного поля
        </li>
        <li>
            <code>&lt;slot name="submit"&gt;</code> — кастомная кнопка отправки
        </li>
        <li>
            <code>&lt;slot name="reset"&gt;</code> — кастомная кнопка сброса
        </li>
    </ul>

    <h2>Пример с select и кастомной опцией</h2>
    <div class="example">
        <pre><code>
const formConfig = {
  fields: [
    {
      name: "country",
      type: "select",
      attrs: {},
      options: [
        { id: 1, title: "Россия" },
        { id: 2, title: "США" }
      ],
      label: { text: "Страна" }
    }
  ]
};
    </code></pre>
    </div>

    <p>
        В шаблоне можно использовать слот <code>country-option</code> для
        кастомного рендера опций:
    </p>
    <pre><code>&lt;template&gt;
    &lt;GenForm :config="formConfig" v-model="formData"&gt;
        &lt;template #country-option="{ option }"&gt;
        &lt;option :value="option.id"&gt;🌍 {{ `\{\{option.title\}\}` }}&lt;/option&gt;
        &lt;/template&gt;
    &lt;/GenForm&gt;
&lt;/template&gt;
        </code></pre>

    <h2>Примечания</h2>
    <ul>
        <li>Для checkbox значение хранится как <code>true/false</code>.</li>
        <li>
            Для select значение хранится как <code>id</code>,
            <code>value</code> или <code>title</code> объекта опции.
        </li>
        <li>
            Режим валидации может быть <code>eager</code>, <code>blur</code> или
            <code>lazy</code>.
        </li>
        <li>
            HTML-атрибуты для поля можно передавать через
            <code>attrs</code> объекта Field, например
            <code>{ placeholder: 'Введите текст', id: 'my-input' }</code>.
        </li>
    </ul>
</template>

<style scoped lang="scss">
h1,
h2,
h3 {
    color: #222;
}
code {
    background-color: #eee;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
}
pre {
    background-color: #eee;
    padding: 1rem;
    overflow-x: auto;
    border-radius: 4px;
}
table {
    border-collapse: collapse;
    margin-bottom: 2rem;
    width: 100%;
}
th,
td {
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    text-align: left;
}
th {
    background-color: #f2f2f2;
}
.example {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 2rem;
    border-radius: 4px;
}
</style>

<script setup lang="ts"></script>
