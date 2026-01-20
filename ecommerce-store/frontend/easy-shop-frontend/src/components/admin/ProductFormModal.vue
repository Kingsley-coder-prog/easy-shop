<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div class="bg-white w-full max-w-md p-6 rounded">
      <h2 class="text-xl font-bold mb-4">
        {{ product ? "Edit" : "Create" }} Product
      </h2>

      <form @submit.prevent="submit" class="space-y-3">
        <input v-model="form.name" placeholder="Name" class="input" />
        <input
          v-model.number="form.price"
          type="number"
          placeholder="Price"
          class="input"
        />
        <input
          v-model.number="form.stock"
          type="number"
          placeholder="Stock"
          class="input"
        />

        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')">Cancel</button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  product: Object,
});

const emit = defineEmits(["save", "close"]);

const form = reactive({
  name: "",
  price: 0,
  stock: 0,
});

watch(
  () => props.product,
  (p) => {
    if (p) Object.assign(form, p);
    else {
      form.name = "";
      form.price = 0;
      form.stock = 0;
    }
  },
  { immediate: true }
);

const submit = () => {
  emit("save", { ...form });
};
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 4px;
}
</style>
