<script setup lang="ts">
import Menu from "./components/Menu.vue";
</script>

<template>
    <main class="main">
        <Menu />
        <section class="page">
            <RouterView />
        </section>
    </main>
</template>

<style lang="scss">
.main {
    display: flex;
    gap: 20px;
}

.page {
    flex-grow: 1;
    padding: 16px;
    margin-left: 240px;
}
</style>
