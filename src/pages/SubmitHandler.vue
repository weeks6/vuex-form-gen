<script setup lang="ts">
import { ref } from "vue";

import GenForm from "../components/GenForm/GenForm.vue";
import PrettyJson from "../components/PrettyJson.vue";

import type { GenFormConfig } from "../components/GenForm/types";

const formData = ref({});

const formConfig: GenFormConfig = {
    fields: [
        {
            name: "username",
            type: "input",
            label: { text: "Username", attrs: { for: "username" } },
            attrs: {
                id: "username",
                type: "text",
                placeholder: "Enter username",
                maxlength: 32,
                autocomplete: "username",
            },
            validators: [
                (value) => (!value ? "Username is required" : undefined),
                (value) =>
                    value && value.length < 3 ? "Too short" : undefined,
            ],
            validtionMode: "eager",
        },
        {
            name: "password",
            type: "input",
            label: { text: "Password" },
            attrs: {
                type: "password",
                minlength: 8,
                autocomplete: "new-password",
            },
            validators: [
                (value) => (!value ? "Password required" : undefined),
                (value) =>
                    value && value.length < 8
                        ? "Password too short"
                        : undefined,
            ],
            validtionMode: "eager",
        },
    ],
};

function onFormSubmit(values: Record<string, any>) {
    alert(`Form submit with values: ${JSON.stringify(values, null, 2)}`);
}
</script>

<template>
    <h1>With Submit Handler</h1>

    <p>
        При нажатии кнопки Submit выполняются все валидаторы и если все поля
        валидны, то выполняется обработчик на событие <strong>submit</strong>
    </p>

    <div>
        <GenForm
            class="custom-form-class"
            v-model="formData"
            :config="formConfig"
            @submit="onFormSubmit"
        />
    </div>

    <div>
        <PrettyJson>
            {{ formData }}
        </PrettyJson>
    </div>
</template>

<style scoped lang="scss">
.custom-form-class {
    max-width: 400px;
    display: flex;
    flex-direction: column;
}
</style>
