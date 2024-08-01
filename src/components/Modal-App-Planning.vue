<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['modal-close']);

const target = ref(null);
onClickOutside(target, () => emit('modal-close'));
</script>

<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div ref="target" class="modal-container">
        <div class="modal-header">
          <slot name="header">Default Header</slot>
        </div>
        <div class="modal-body">
          <slot name="content">Default Content</slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button @click="emit('modal-close')">Close</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.modal-container {
  width: 300px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
.modal-header,
.modal-body,
.modal-footer {
  padding: 20px;
}
</style>
