/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["plugin:vue/base", "plugin:vue/vue3-essential", "plugin:vue/vue3-strongly-recommended", "plugin:vue/vue3-recommended", "eslint:recommended", "@vue/eslint-config-typescript", "@vue/eslint-config-prettier/skip-formatting"],
    rules: {
        "vue/no-unused-vars": "warn",
        "vue/html-indent": "off",
        "vue/max-attributes-per-line": "off",
        "vue/singleline-html-element-content-newline": "off",
    },
    parserOptions: {
        ecmaVersion: "latest",
    },
};
