<template>
    <pre class="pretty-json">
        <slot/>
    </pre>
</template>

<style lang="scss">
pre.pretty-json {
    background: #0f172a; /* slate-900 */
    color: #e5e7eb; /* slate-200 */
    padding: 16px 20px;
    border-radius: 12px;
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", monospace;
    font-size: 13px;
    line-height: 1.6;
    overflow-x: auto;
    white-space: pre;
}
</style>
