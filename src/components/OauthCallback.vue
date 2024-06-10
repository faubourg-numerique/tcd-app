<script setup lang="ts">
import { useOauthStore } from '../stores/oauth-store'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import axios, { type AxiosResponse } from 'axios'

const route = useRoute()
const router = useRouter()
const oauthStore = useOauthStore()

onMounted(async () => {
  const token = route.query.token as string | undefined
  oauthStore.backend = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (typeof token !== 'string') {
    console.error('Invalid token')
    return
  }

  const response: AxiosResponse = await axios.get(
    import.meta.env.VITE_IDENTITY_MANAGER_URL + '/user?access_token=' + token
  )

  oauthStore.name = response.data.username
  oauthStore.isConnected = true

  router.push({ name: 'dashboard' })
})
</script>
