<script setup lang="ts">
/* @ts-ignore */
import { useStore } from "vuex";
import { computed } from "vue";

import GenForm from "../components/GenForm/GenForm.vue";
import PrettyJson from "../components/PrettyJson.vue";

import type { GenFormConfig } from "../components/GenForm/types";

const FORM_NAME = "basic";
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
            name: "email",
            type: "input",
            label: { text: "Email" },
            attrs: {
                type: "email",
                placeholder: "user@example.com",
                autocomplete: "email",
            },
            validators: [
                (value) => (!value ? "Email is required" : undefined),
                (value) =>
                    value && !/^\S+@\S+\.\S+$/.test(value)
                        ? "Invalid email"
                        : undefined,
            ],
            validtionMode: "blur",
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
            validtionMode: "lazy",
        },
        {
            name: "acceptTerms",
            type: "checkbox",
            label: { text: "Accept terms and conditions" },
            attrs: { checked: false, id: "acceptTerms" },
            validators: [
                (value) => (!value ? "You must accept terms" : undefined),
            ],
            validtionMode: "eager",
        },
        {
            name: "country",
            type: "select",
            label: { text: "Country" },
            options: [
                { id: "us", value: "US", title: "United States" },
                { id: "de", value: "DE", title: "Germany" },
                { id: "fr", value: "FR", title: "France" },
                { id: "jp", value: "JP", title: "Japan" },
                { id: "br", value: "BR", title: "Brazil" },
            ],
            validators: [
                (value) => (!value ? "Country is required" : undefined),
            ],
            validtionMode: "lazy",
        },
        {
            name: "bio",
            type: "textarea",
            label: { text: "Bio" },
            attrs: {
                rows: 4,
                cols: 40,
                placeholder: "Tell us about yourself",
                maxlength: 200,
            },
            validators: [
                (value) =>
                    value && value.length > 200
                        ? "Bio must be under 200 characters"
                        : undefined,
            ],
            validtionMode: "blur",
        },
    ],
};

const store = useStore();
const formData = computed({
    get() {
        return store.getters.getForm(FORM_NAME);
    },
    set(value) {
        store.dispatch("updateForm", { formName: FORM_NAME, data: value });
    },
});
</script>

<template>
    <h1>Basic</h1>

    <p>Все поддерживаемы типы полей с базовыми валидаторами</p>

    <div>
        <GenForm
            v-model="formData"
            :config="formConfig"
            class="custom-form-class"
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
