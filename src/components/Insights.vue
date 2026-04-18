<script setup>
import { computed } from 'vue'
import { TrendingUp } from 'lucide-vue-next'

const props = defineProps({
  data: { type: Object, required: true },
})

// distribución por mes
const monthlyStats = computed(() => {
  const stats = {}
  const allData = [...(props.data.followers || []), ...(props.data.following || [])]

  allData.forEach((item) => {
    if (!item.timestamp) return
    const date = new Date(item.timestamp * 1000)
    const key = date.toLocaleString('es-MX', { year: 'numeric', month: 'short' })
    stats[key] = (stats[key] || 0) + 1
  })

  // ordenar por fecha
  const now = new Date()
  const months = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('es-MX', { year: 'numeric', month: 'short' })
    months.push({ key, count: stats[key] || 0 })
  }
  return months
})

const maxCount = computed(() => Math.max(...monthlyStats.value.map((m) => m.count), 1))
const totalUsers = computed(() => (props.data.followers?.length || 0) + (props.data.following?.length || 0))

const ghosts = computed(() => {
  const followerSet = new Set((props.data.followers || []).map((f) => f.username.toLowerCase()))
  return (props.data.following || []).filter((f) => !followerSet.has(f.username.toLowerCase())).length
})

const fans = computed(() => {
  const followingSet = new Set((props.data.following || []).map((f) => f.username.toLowerCase()))
  return (props.data.followers || []).filter((f) => !followingSet.has(f.username.toLowerCase())).length
})
</script>

<template>
  <section class="border-b border-[var(--color-line)]">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">

      <!-- header -->
      <div>
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Estadísticas
        </p>
        <h2 class="mt-3 text-3xl font-medium tracking-tight">
          Análisis de tu actividad
        </h2>
      </div>

      <!-- stats cards -->
      <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-xl border border-[var(--color-line)] bg-white p-4">
          <p class="text-2xl font-medium tracking-tight">{{ totalUsers }}</p>
          <p class="mt-0.5 text-sm text-[var(--color-muted)]">Usuarios totales</p>
        </div>
        <div class="rounded-xl border border-[var(--color-line)] bg-white p-4">
          <p class="text-2xl font-medium tracking-tight">{{ data.followers?.length || 0 }}</p>
          <p class="mt-0.5 text-sm text-[var(--color-muted)]">Seguidores</p>
        </div>
        <div class="rounded-xl border border-[var(--color-line)] bg-white p-4">
          <p class="text-2xl font-medium tracking-tight">{{ data.following?.length || 0 }}</p>
          <p class="mt-0.5 text-sm text-[var(--color-muted)]">Siguiendo</p>
        </div>
        <div class="rounded-xl border border-[var(--color-line)] bg-white p-4">
          <p class="text-2xl font-medium tracking-tight">{{ ghosts }}</p>
          <p class="mt-0.5 text-sm text-[var(--color-muted)]">No te siguen</p>
        </div>
      </div>

      <!-- gráfico de distribución -->
      <div class="mt-8 rounded-xl border border-[var(--color-line)] bg-white p-6">
        <div class="flex items-center gap-2 pb-4">
          <TrendingUp class="h-5 w-5 text-[var(--color-ink)]" :stroke-width="2" aria-hidden="true" />
          <h3 class="font-medium">Distribución en últimos 12 meses</h3>
        </div>

        <div class="space-y-2">
          <div
            v-for="(month, i) in monthlyStats"
            :key="i"
            class="flex items-center gap-2"
          >
            <span class="w-12 text-xs text-[var(--color-muted)]">{{ month.key }}</span>
            <div class="flex-1">
              <div class="flex h-8 items-center overflow-hidden rounded bg-[var(--color-paper)]">
                <div
                  :style="{ width: `${(month.count / maxCount) * 100}%` }"
                  class="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all"
                ></div>
              </div>
            </div>
            <span class="w-8 text-right text-xs font-medium text-[var(--color-muted)]">
              {{ month.count }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
