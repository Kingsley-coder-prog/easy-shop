<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="[
        'fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg text-white font-semibold animate-slide-in z-50',
        {
          'bg-green-500': type === 'success',
          'bg-red-500': type === 'error',
          'bg-blue-500': type === 'info',
          'bg-yellow-500': type === 'warning',
        },
      ]"
    >
      {{ message }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "success",
  },
  duration: {
    type: Number,
    default: 3000,
  },
  isVisible: Boolean,
});

const visible = ref(false);

watch(
  () => props.isVisible,
  (newVal) => {
    if (newVal) {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
      }, props.duration);
    }
  }
);
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>
