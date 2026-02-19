import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore("toast", () => {
  const message = ref("");
  const type = ref("success");
  const isVisible = ref(false);

  const show = (msg, toastType = "success", duration = 3000) => {
    message.value = msg;
    type.value = toastType;
    isVisible.value = true;

    setTimeout(() => {
      isVisible.value = false;
    }, duration);
  };

  const success = (msg, duration = 3000) => show(msg, "success", duration);
  const error = (msg, duration = 3000) => show(msg, "error", duration);
  const info = (msg, duration = 3000) => show(msg, "info", duration);
  const warning = (msg, duration = 3000) => show(msg, "warning", duration);

  return {
    message,
    type,
    isVisible,
    show,
    success,
    error,
    info,
    warning,
  };
});
