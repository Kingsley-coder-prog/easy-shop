<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div
      class="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-6">
        {{ product ? "Edit Product" : "Create New Product" }}
      </h2>

      <form @submit.prevent="submit" class="space-y-5">
        <!-- Product Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter product name"
            required
            class="input w-full"
          />
        </div>

        <!-- Price -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Price (₦) *
            </label>
            <input
              v-model.number="form.price_naira"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
              class="input w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select v-model="form.category" required class="input w-full">
              <option value="">Select a category</option>
              <option value="Drinks">Drinks</option>
              <option value="Fruits">Fruits</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
              <option value="Home">Hygiene</option>
              <option value="Snacks">Snacks</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            v-model="form.description"
            placeholder="Enter product description"
            rows="3"
            class="input w-full"
          ></textarea>
        </div>

        <!-- Image Upload Section -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div class="flex flex-col items-center">
            <!-- Preview Current Image -->
            <div v-if="form.image || imagePreview" class="mb-4 w-full">
              <img
                :src="imagePreview || form.image"
                alt="Product preview"
                class="w-32 h-32 object-cover rounded mx-auto"
              />
              <button
                type="button"
                @click="clearImage"
                class="mt-2 text-red-600 text-sm hover:text-red-700 block mx-auto"
              >
                Remove Image
              </button>
            </div>

            <!-- Upload Area -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleDrop"
              :class="[
                'w-full text-center cursor-pointer transition',
                isDragging ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50',
              ]"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
              <div @click="$refs.fileInput?.click()" class="py-4">
                <p class="text-gray-600 font-medium">
                  📤 Click to upload or drag & drop
                </p>
                <p class="text-gray-500 text-sm">
                  Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                </p>
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploading" class="mt-4 w-full">
              <div class="flex items-center gap-2">
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                ></div>
                <span class="text-sm text-gray-600">Uploading image...</span>
              </div>
            </div>

            <!-- Upload Error -->
            <div v-if="uploadError" class="mt-4 text-red-600 text-sm">
              ⚠️ {{ uploadError }}
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="uploading"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ uploading ? "Uploading..." : "Save Product" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from "vue";
import { uploadImageFile } from "@/api/s3.api";

const props = defineProps({
  product: Object,
});

const emit = defineEmits(["save", "close"]);

const fileInput = ref(null);
const isDragging = ref(false);
const uploading = ref(false);
const uploadError = ref(null);
const imagePreview = ref(null);

const form = reactive({
  name: "",
  price_naira: 0,
  category: "",
  description: "",
  image: "",
});

watch(
  () => props.product,
  (p) => {
    if (p) {
      Object.assign(form, p);
      imagePreview.value = p.image;
    } else {
      form.name = "";
      form.price_naira = 0;
      form.category = "";
      form.description = "";
      form.image = "";
      imagePreview.value = null;
    }
  },
  { immediate: true }
);

const handleFileSelect = async (e) => {
  const file = e.target.files?.[0];
  if (file) {
    await uploadImage(file);
  }
};

const handleDrop = async (e) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith("image/")) {
    await uploadImage(file);
  }
};

const uploadImage = async (file) => {
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = "File size must be less than 5MB";
    return;
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = "Only JPEG, PNG, GIF, and WebP formats are allowed";
    return;
  }

  uploading.value = true;
  uploadError.value = null;

  try {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result;
    };
    reader.readAsDataURL(file);

    // Upload to S3
    const imageUrl = await uploadImageFile(file);
    form.image = imageUrl;
    console.log("✅ Image uploaded successfully:", imageUrl);
  } catch (error) {
    console.error("❌ Upload failed:", error);
    // Show the detailed error message when available
    uploadError.value =
      error.message || "Failed to upload image. Please try again.";
    imagePreview.value = null;
  } finally {
    uploading.value = false;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};

const clearImage = () => {
  form.image = "";
  imagePreview.value = null;
};

const submit = () => {
  if (!form.name || !form.price_naira || !form.category) {
    alert("Please fill in all required fields");
    return;
  }

  emit("save", { ...form });
};
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea.input {
  resize: vertical;
  font-family: inherit;
}

select.input {
  cursor: pointer;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
