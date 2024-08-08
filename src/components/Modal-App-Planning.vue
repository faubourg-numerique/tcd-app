<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
    isOpen: Boolean,
    isUpdate: Boolean,
});

const emit = defineEmits(["modal-close", "add-schedule", "delete-schedule", "edit-schedule"]);

const target = ref(null);
onClickOutside(target, () => emit("modal-close"));

const handleAddSchedule = () => emit("add-schedule");
const handleDeleteSchedule = () => emit("delete-schedule");
const handleEditSchedule = () => emit("edit-schedule");
</script>

<template>
    <div v-if="isOpen" class="modal show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header">
                        <h5 class="modal-title">Default Header</h5>
                    </slot>
                    <button type="button" class="btn-close" aria-label="Close" @click="emit('modal-close')"></button>
                </div>
                <div class="modal-body">
                    <slot name="content">Default Content</slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button v-if="!isUpdate" type="button" class="btn btn-primary" @click="handleAddSchedule">Ajouter une planification</button>
                        <button v-if="isUpdate" type="button" class="btn btn-warning" @click="handleEditSchedule">Modifier une planification</button>
                        <button v-if="isUpdate" type="button" class="btn btn-danger" @click="handleDeleteSchedule">Supprimer une planification</button>
                        <button type="button" class="btn btn-secondary" @click="emit('modal-close')">Fermer</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal.show {
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
    max-width: 500px;
    margin: 1.75rem auto;
}
</style>
