<template>
  <div>
    <div class="flex justify-between mb-6">
      <h1 class="text-2xl font-bold">Products</h1>

      <button
        @click="openCreate"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>
    </div>

    <ProductTable
      :products="products"
      @edit="openEdit"
      @delete="deleteProduct"
    />

    <ProductFormModal
      v-if="showModal"
      :product="selectedProduct"
      @close="closeModal"
      @save="saveProduct"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "@/stores/product.store";

import ProductTable from "@/components/admin/ProductTable.vue";
import ProductFormModal from "@/components/admin/ProductFormModal.vue";

const store = useProductStore();

const showModal = ref(false);
const selectedProduct = ref(null);

onMounted(() => {
  store.fetchProducts();
});

const openCreate = () => {
  selectedProduct.value = null;
  showModal.value = true;
};

const openEdit = (product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveProduct = async (data) => {
  if (selectedProduct.value) {
    await store.updateProduct(selectedProduct.value._id, data);
  } else {
    await store.createProduct(data);
  }
  closeModal();
};

const deleteProduct = async (id) => {
  if (confirm("Delete this product?")) {
    await store.deleteProduct(id);
  }
};

const products = computed(() => store.products);
</script>
