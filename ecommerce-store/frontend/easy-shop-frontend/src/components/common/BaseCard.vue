<template>
  <div
    :class="[
      'bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg',
      className,
    ]"
  >
    <div v-if="$slots.header" class="border-b border-gray-100 px-6 py-4">
      <slot name="header"></slot>
    </div>
    <div class="p-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: "",
  },
});
</script>
