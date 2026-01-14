import { createRouter, createWebHistory } from 'vue-router';
import ProductList from '../components/ProductList.vue';
import Cart from '../components/Cart.vue';

const routes = [
  { path: '/', component: ProductList },
  { path: '/cart', component: Cart }
];

export default createRouter({ history: createWebHistory(), routes });