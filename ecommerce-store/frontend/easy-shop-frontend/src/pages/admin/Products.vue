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
import { ref, onMounted, computed } from "vue";
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

import { useToastStore } from "@/stores/toast.store";

const toast = useToastStore();

const saveProduct = async (data) => {
  try {
    if (selectedProduct.value) {
      await store.updateProduct(selectedProduct.value._id, data);
      toast.success("Product updated");
    } else {
      await store.createProduct(data);
      await store.fetchProducts();
      toast.success("Product created");
    }
    closeModal();
  } catch (err) {
    console.error("Save product failed:", err);
    toast.error(
      err.response?.data?.error || err.message || "Failed to save product"
    );
  }
};

const deleteProduct = async (product) => {
  const id = product.product_id || product._id || product.id;
  if (!id) return alert("Unable to determine product id");
  if (confirm("Delete this product?")) {
    try {
      await store.deleteProduct(id);
      // refresh products
      await store.fetchProducts();
      alert("Product deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }
};

const products = computed(() => store.products);
</script>
