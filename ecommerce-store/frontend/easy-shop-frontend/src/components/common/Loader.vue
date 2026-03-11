<template>
  <div
    class="inline-flex items-center justify-center"
    role="status"
    :aria-label="label"
  >
    <svg
      class="animate-spin text-blue-600"
      :class="sizeClass"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "md",
    validator: (v) => ["sm", "md", "lg"].includes(v),
  },
  label: {
    type: String,
    default: "Loading",
  },
});

const sizeClass = computed(() => {
  if (props.size === "sm") return "w-5 h-5";
  if (props.size === "lg") return "w-10 h-10";
  return "w-7 h-7";
});
</script>