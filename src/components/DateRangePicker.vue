<script setup lang="ts">
import { defineModel } from "vue";

const from = defineModel("from");
const to = defineModel("to");
</script>

<template>
    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="from">{{ $t("main.from") }}</label>
            <input id="from" v-model="from" class="form-control" type="datetime-local" />
        </div>
        <div class="col-md-6 mb-3">
            <label for="to">{{ $t("main.to") }}</label>
            <input id="to" v-model="to" class="form-control" type="datetime-local" />
        </div>
    </div>
</template>
