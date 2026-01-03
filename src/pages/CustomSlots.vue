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
    <h1>Custom Slots</h1>

    <p>
        Можно установить кастомные слоты как на все поля
        <strong>(field, error, select-option)</strong> так и отдельно на поля по
        имени из конфига формы
        <strong>(например: password-label, password-error)</strong>
    </p>

    <div>
        <GenForm
            class="custom-form-class"
            v-model="formData"
            :config="formConfig"
            @submit="onFormSubmit"
        >
            <template #label="{ field }">
                <div class="custom-label">
                    {{ field.label?.text }}
                </div>
            </template>

            <template #password-label="{ field }">
                <div class="custom-label--password">
                    {{ field.label?.text }}
                </div>
            </template>

            <template #password-error="{ errors }">
                <div class="custom-error">
                    {{ errors[0] }}
                </div>
            </template>
        </GenForm>
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

.custom-label {
    color: blue;

    &--password {
        color: green;
    }
}

.custom-error {
    color: salmon;
}
</style>
