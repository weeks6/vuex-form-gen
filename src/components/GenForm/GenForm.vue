<script setup lang="ts">
import { computed, ref } from "vue";
import type {
    ErrorMessage,
    Field,
    FieldType,
    GenFormConfig,
    GenFormData,
    SelectOption,
} from "./types";

const props = defineProps<{
    config: GenFormConfig;
    modelValue: GenFormData;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: GenFormData): void;
    (e: "submit", values: Record<string, any>): void;
    (e: "reset"): void;
}>();

const componentMap: Record<FieldType, string> = {
    input: "input",
    checkbox: "input",
    select: "select",
    textarea: "textarea",
};

const formData = computed({
    get() {
        return props.modelValue;
    },
    set(updated) {
        emit("update:modelValue", updated);
    },
});

const earlyValidation = ref(false);

const isValid = computed(() => {
    return Object.values(formData.value || {}).every(
        (field) => field.errors === undefined || field.errors.length === 0,
    );
});

function setValue(name: string, value: any, errors?: ErrorMessage[]) {
    earlyValidation.value = false;

    if (formData.value[name]) {
        formData.value[name].value = value;
        if (errors) {
            formData.value[name].errors = errors;
        }
    } else {
        formData.value[name] = { value, errors };
    }
}

function setErrors(name: string, errors: ErrorMessage[]) {
    if (formData.value[name]) {
        formData.value[name].errors = errors;
    } else {
        formData.value[name] = { value: undefined, errors };
    }
}

function resolveFieldType(field: Field) {
    if (field.type === "input") {
        if (field.attrs?.type) {
            return field.attrs.type;
        }

        return field.type;
    }

    if (field.type !== "select") {
        return field.type;
    }

    return undefined;
}

function resolveFieldValue(field: Field) {
    if (field.type === "select") {
        return resolveSelectValue(formData.value[field.name]?.value);
    } else if (field.type === "checkbox") {
        return formData.value[field.name]?.value ? "on" : undefined;
    }

    return formData.value[field.name]?.value;
}

function resolveSelectValue(option?: string | number | SelectOption) {
    if (option === undefined) {
        return option;
    }

    if (typeof option === "string" || typeof option === "number") {
        return option;
    }

    if (option.id !== undefined) {
        return option.id;
    }

    if (option.value) {
        return option.value;
    }

    if (option.title !== undefined) {
        return option.title;
    }
}

function resolveValidators(value: any, field: Field) {
    const errors: ErrorMessage[] = [];

    field.validators?.forEach((validator) => {
        const error = validator(value, formData.value);
        if (error) errors.push(error);
    });

    return errors;
}

function formInputHandler(field: Field, event: any) {
    const value = event.target?.value;
    let resolveValue = value;

    if (field.type === "select") {
        resolveValue = field.options.find((option) => {
            if (typeof option === "string" || typeof option === "number") {
                return option;
            }

            if (option.id !== undefined && option.id === value) {
                return option;
            }

            if (option.value === value) {
                return option;
            }

            if (option.title !== undefined && option.title === value) {
                return option;
            }
        });
    } else if (field.type === "checkbox") {
        resolveValue = !formData.value[field.name]?.value;
    }

    if (field.validtionMode === "eager") {
        const errors = resolveValidators(resolveValue, field);
        setValue(field.name, resolveValue, errors);
    } else {
        setValue(field.name, resolveValue);
    }
}

function formChangeHandler(field: Field, _event: Event) {
    setValue(field.name, !formData.value[field.name]?.value);
}

function inputBlurHandler(field: Field, _event: Event) {
    if (field.validtionMode === "blur") {
        const errors = resolveValidators(
            formData.value[field.name]?.value,
            field,
        );
        setErrors(field.name, errors);
    }
}

function handleSubmit(_event: SubmitEvent) {
    props.config.fields.forEach((field) => {
        const errors = resolveValidators(formData.value[field.name], field);
        setErrors(field.name, errors);
    });

    if (isValid.value) {
        emit(
            "submit",
            Object.keys(formData.value).reduce(
                (acc, fieldKey) => {
                    acc[fieldKey] = formData.value[fieldKey]?.value;
                    return acc;
                },
                {} as Record<string, any>,
            ),
        );
    }
}

function handleReset() {
    Object.keys(formData.value).forEach((fieldKey) => {
        formData.value[fieldKey] = { value: undefined, errors: [] };
    });

    emit("reset");
}

// got lazy to figure this part to be more user friendly
// onMounted(() => {
//     props.config.fields.forEach((field) => {
//         const errors = resolveValidators(formData.value[field.name], field);
//         setErrors(field.name, errors);

//         if (errors.length) earlyValidation.value = true;
//     });
// });
</script>

<template>
    <form
        class="gen-form"
        noValidate
        @submit.prevent="handleSubmit"
        @reset.prevent="handleReset"
    >
        <label
            v-for="field in config.fields"
            :key="field.name"
            class="gen-form__field"
            v-bind="field.label?.attrs"
        >
            <!-- label -->
            <span
                v-if="
                    field.label?.text &&
                    !$slots[`${field.name}-label`] &&
                    !$slots['label']
                "
            >
                {{ field.label.text }}
            </span>
            <slot
                v-else-if="$slots[`${field.name}-label`]"
                :name="`${field.name}-label`"
                :field="field"
            />
            <slot
                v-else-if="$slots['label'] && !$slots[`${field.name}-label`]"
                name="label"
                :field="field"
            />

            <!-- input -->
            <component
                :is="componentMap[field.type]"
                v-bind="field.attrs"
                :name="field.name"
                :value="resolveFieldValue(field)"
                :type="resolveFieldType(field)"
                @input="(event: Event) => formInputHandler(field, event)"
                @change="
                    field.type === 'checkbox'
                        ? (event: Event) => formChangeHandler(field, event)
                        : undefined
                "
                @blur="(event: Event) => inputBlurHandler(field, event)"
                :checked="
                    field.type === 'checkbox'
                        ? formData[field.name]?.value
                        : undefined
                "
            >
                <template v-if="field.type === 'select'">
                    <option
                        v-for="option in field.options"
                        :key="
                            typeof option === 'string' ||
                            typeof option === 'number'
                                ? option
                                : option.id || option.value || option.title
                        "
                        :value="
                            typeof option === 'string' ||
                            typeof option === 'number'
                                ? option
                                : option.id || option.value || option.title
                        "
                    >
                        <template
                            v-if="
                                field.type === 'select' &&
                                $slots[`${field.name}-option`]
                            "
                        >
                            <slot
                                :name="`${field.name}-option`"
                                :field="field"
                                :option="option"
                            />
                        </template>
                        <template
                            v-else-if="
                                field.type === 'select' &&
                                $slots['select-option'] &&
                                !$slots[`${field.name}-option`]
                            "
                        >
                            <slot
                                name="select-option"
                                :field="field"
                                :option="option"
                            />
                        </template>
                        <template v-else-if="field.type === 'select'">
                            {{
                                typeof option === "string" ||
                                typeof option === "number"
                                    ? option
                                    : option.title || option.value
                            }}
                        </template>
                    </option>
                </template>
            </component>
            <!-- error message(s) -->
            <span
                v-if="
                    !$slots[`${field.name}-error`] &&
                    !$slots['error'] &&
                    formData[field.name]?.errors?.[0]
                "
                class="gen-form__error"
            >
                {{ formData[field.name]?.errors?.[0] }}
            </span>
            <slot
                v-else-if="$slots['error']"
                name="error"
                :field="field"
                :errors="formData[field.name]?.errors || []"
            />
            <slot
                v-else-if="$slots[`${field.name}-error`] && !$slots['error']"
                :name="`${field.name}-error`"
                :field="field"
                :errors="formData[field.name]?.errors || []"
            />
        </label>

        <slot name="submit" :isValid="isValid">
            <button type="submit" :disabled="!isValid">Submit</button>
        </slot>

        <slot name="reset" :isValid="isValid">
            <button type="reset">Reset</button>
        </slot>
    </form>
</template>

<style lang="scss" scoped>
.gen-form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    button {
        padding: 4px 0px;

        &:disabled {
            cursor: not-allowed;
        }

        &:not(:disabled) {
            cursor: pointer;
        }
    }
}

.gen-form__error {
    color: red;
    font-size: 13px;
}

.gen-form__field {
    display: flex;
    flex-direction: column;

    gap: 4px;

    select,
    option {
        font-size: 16px;
        padding: 4px 8px;
    }

    input {
        font-size: 16px;
        padding: 4px 8px;
    }
}
</style>
