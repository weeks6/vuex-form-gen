<script setup lang="ts">
import { computed, onMounted } from "vue";
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

function setValue(name: string, value: any, errors?: ErrorMessage[]) {
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

function formChangeHandler(field: Field, event: Event) {
    setValue(field.name, !formData.value[field.name]?.value);
}

function inputBlurHandler(field: Field, event: Event) {
    if (field.validtionMode === "blur") {
        const errors = resolveValidators(
            formData.value[field.name]?.value,
            field,
        );
        setErrors(field.name, errors);
    }
}
</script>

<template>
    <form class="gen-form">
        <label
            v-for="field in config.fields"
            :key="field.name"
            v-bind="field.label?.attrs"
        >
            <!-- label -->
            <span v-if="field.label?.text && !$slots[`${field.name}-label`]">
                {{ field.label.text }}
            </span>
            <slot v-else :name="`${field.name}-label`" :field="field" />

            <!-- input -->
            <component
                :is="componentMap[field.type]"
                v-bind="field.attrs"
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
                        <template v-else>
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
                v-if="formData[field.name]?.errors?.[0]"
                class="gen-form__error"
            >
                {{ formData[field.name]?.errors?.[0] }}
            </span>
        </label>
    </form>
</template>

<style lang="scss" scoped>
.gen-form__error {
    color: red;
}
</style>
