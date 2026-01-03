<script setup lang="ts">
const examples = [
    {
        path: "/",
        name: "Home",
    },
    {
        path: "/basic",
        name: "Basic",
    },
    {
        path: "/submit-handler",
        name: "With Submit Handler",
    },
    {
        path: "/custom-slots",
        name: "With Custom Slots",
    },
];
</script>

<template>
    <aside class="menu">
        <RouterLink v-for="route in examples" :to="route.path">
            {{ route.name }}
        </RouterLink>
    </aside>
</template>

<style scoped lang="scss">
.menu {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 220px;
    height: 100vh;
    overflow-y: auto;
    padding: 16px;
    border-right: 1px solid lightgray;
}
</style>
