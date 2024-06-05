import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

import axios, { type AxiosInstance } from "axios";

export const useOauthStore = defineStore("oauth", () => {
  const isConnected: Ref<boolean> = ref(false);

  const name: Ref<string> = ref("");

  const backend: AxiosInstance = axios.create();

  function $reset() {
    isConnected.value = false;
    name.value = "";
    backend.defaults.headers.common["Authorization"] = "";
  }

  return {
    isConnected,
    backend,
    name,
    $reset,
  };
});
