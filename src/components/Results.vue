<script setup>
import { computed, ref } from 'vue'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  GitCompareArrows,
  Search,
  UserMinus,
  UserPlus,
  Clock,
  ArrowUpRight,
  HardDriveDownload,
  Trash2,
} from 'lucide-vue-next'
import {
  diffNotFollowingBack,
  diffFansNotFollowedBack,
  downloadCsv,
  ageCategory,
} from '../lib/parseInstagram.js'

const props = defineProps({
  data: { type: Object, required: true },
  savedAt: { type: Number, default: null },
})
const emit = defineEmits(['reset', 'compare-pick'])

// ---- view & search ----
const view = ref('ghosts')
const query = ref('')

// ---- sort ----
const sortKey = ref('timestamp')
const sortDir = ref('desc')

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = key === 'timestamp' ? 'desc' : 'asc'
  }
}

function sortIcon(key) {
  if (sortKey.value !== key) return ArrowUpDown
  return sortDir.value === 'asc' ? ArrowUp : ArrowDown
}

// ---- data ----
const ghosts = computed(() => diffNotFollowingBack(props.data))
const fans = computed(() => diffFansNotFollowedBack(props.data))
const pending = computed(() =>
  [...(props.data.pending || [])].sort((a, b) => b.timestamp - a.timestamp),
)

const activeRows = computed(() => {
  if (view.value === 'ghosts') return ghosts.value
  if (view.value === 'fans') return fans.value
  return pending.value
})

const headline = computed(() => {
  if (view.value === 'ghosts') return `${ghosts.value.length} cuentas no te siguen de vuelta`
  if (view.value === 'fans') return `${fans.value.length} seguidores que no sigues de vuelta`
  return `${pending.value.length} solicitudes de seguir pendientes`
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  let rows = q
    ? activeRows.value.filter((r) => r.username.toLowerCase().includes(q))
    : [...activeRows.value]

  rows.sort((a, b) => {
    let cmp =
      sortKey.value === 'username'
        ? a.username.localeCompare(b.username)
        : (a.timestamp || 0) - (b.timestamp || 0)
    return sortDir.value === 'asc' ? cmp : -cmp
  })

  return rows
})

const timeColumnLabel = computed(() => {
  if (view.value === 'ghosts') return 'Seguido desde'
  if (view.value === 'fans') return 'Te sigue desde'
  return 'Solicitado'
})

const savedAtLabel = computed(() => {
  if (!props.savedAt) return ''
  return new Date(props.savedAt).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const profileUrl = computed(() => {
  const u = props.data.username
  return u ? `https://www.instagram.com/${u}` : ''
})

// ---- age indicator ----
const AGE_DOT = {
  '2y': 'bg-red-400',
  '1y': 'bg-amber-400',
}

function ageDot(ts) {
  return AGE_DOT[ageCategory(ts)] ?? null
}

// ---- helpers ----
function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function exportCsv() {
  const names = { ghosts: 'no_me_siguen', fans: 'no_sigo_de_vuelta', pending: 'pendientes' }
  downloadCsv(filtered.value, `${names[view.value] ?? 'lista'}.csv`)
}

// ---- compare file picker ----
const compareInputRef = ref(null)
function openComparePicker() {
  compareInputRef.value?.click()
}
function onCompareChange(e) {
  const file = e.target.files?.[0]
  if (file) emit('compare-pick', file)
  e.target.value = ''
}
</script>

<template>
  <section class="border-b border-[var(--color-line)]">
    <div class="mx-auto max-w-5xl px-6 py-16">

      <!-- header -->
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p class="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Resultados
          </p>
          <h2 class="mt-3 text-3xl font-medium tracking-tight" aria-live="polite">
            {{ headline }}
          </h2>
          <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]">
            <a
              v-if="data.username"
              :href="profileUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 font-medium text-[var(--color-ink)] underline decoration-[var(--color-line)] underline-offset-4 hover:decoration-[var(--color-ink)]"
            >
              @{{ data.username }}
              <ArrowUpRight class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
            </a>
            <span>
              {{ data.following.length }} seguidos &middot;
              {{ data.followers.length }} seguidores
            </span>
            <span v-if="savedAtLabel" class="inline-flex items-center gap-1.5 font-mono text-xs">
              <HardDriveDownload class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
              Guardado {{ savedAtLabel }}
            </span>
          </div>
        </div>

        <!-- acciones header -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- leyenda antiguedad -->
          <div class="flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs text-[var(--color-muted)]">
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0"></span>
              +1 ano
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2 w-2 rounded-full bg-red-400 flex-shrink-0"></span>
              +2 anos
            </span>
          </div>
          <input
            ref="compareInputRef"
            type="file"
            accept=".zip,.json,application/zip,application/json"
            class="hidden"
            @change="onCompareChange"
          />
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            @click="openComparePicker"
          >
            <GitCompareArrows class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
            Comparar
          </button>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-red-400 hover:text-red-700"
            @click="$emit('reset')"
          >
            <Trash2 class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
            Borrar y sube otro
          </button>
        </div>
      </div>

      <!-- tabs + search + csv -->
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <div class="inline-flex rounded-full border border-[var(--color-line)] bg-white p-1">
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="view === 'ghosts' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'"
            @click="view = 'ghosts'"
          >
            <UserMinus class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
            No me siguen ({{ ghosts.length }})
          </button>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="view === 'fans' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'"
            @click="view = 'fans'"
          >
            <UserPlus class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
            No sigo de vuelta ({{ fans.length }})
          </button>
          <button
            v-if="pending.length > 0"
            type="button"
            class="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            :class="view === 'pending' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'"
            @click="view = 'pending'"
          >
            <Clock class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
            Pendientes ({{ pending.length }})
          </button>
        </div>

        <div class="relative min-w-[200px] flex-1">
          <label for="search-usuario" class="sr-only">Buscar usuario</label>
          <Search
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
            :stroke-width="2"
            aria-hidden="true"
          />
          <input
            id="search-usuario"
            v-model="query"
            type="search"
            placeholder="Buscar usuario"
            class="w-full rounded-full border border-[var(--color-line)] bg-white py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-[var(--color-ink)]"
          />
        </div>

        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-[var(--color-paper)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="filtered.length === 0"
          @click="exportCsv"
        >
          <Download class="h-4 w-4" :stroke-width="2.5" aria-hidden="true" />
          Descargar CSV
        </button>
      </div>

      <!-- tabla -->
      <div class="mt-8 overflow-hidden rounded-xl border border-[var(--color-line)] bg-white">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-[var(--color-line)] bg-[var(--color-paper)]">
            <tr class="text-[var(--color-muted)]">
              <th class="w-10 px-4 py-3 font-mono text-xs uppercase tracking-wider">#</th>
              <th class="px-4 py-3 font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1.5 hover:text-[var(--color-ink)]"
                  @click="toggleSort('username')"
                >
                  Usuario
                  <component :is="sortIcon('username')" class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
                </button>
              </th>
              <th class="px-4 py-3 font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1.5 hover:text-[var(--color-ink)]"
                  @click="toggleSort('timestamp')"
                >
                  {{ timeColumnLabel }}
                  <component :is="sortIcon('timestamp')" class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
                </button>
              </th>
              <th class="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider">
                Perfil
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in filtered"
              :key="row.username"
              class="border-b border-[var(--color-line)] last:border-b-0 hover:bg-[var(--color-paper)]/70"
            >
              <td class="px-4 py-3 font-mono text-xs text-[var(--color-muted)]">{{ i + 1 }}</td>
              <td class="px-4 py-3 font-medium">@{{ row.username }}</td>
              <td class="px-4 py-3 text-[var(--color-muted)]">
                <span class="inline-flex items-center gap-2">
                  <span
                    v-if="ageDot(row.timestamp)"
                    :class="ageDot(row.timestamp)"
                    class="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    :title="ageCategory(row.timestamp) === '2y' ? 'Mas de 2 anos' : 'Mas de 1 ano'"
                  ></span>
                  {{ formatDate(row.timestamp) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <a
                  :href="row.url"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 underline decoration-[var(--color-line)] underline-offset-4 hover:decoration-[var(--color-ink)]"
                >
                  Abrir
                  <ArrowUpRight class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
                </a>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="4" class="px-4 py-10 text-center text-[var(--color-muted)]">
                Sin resultados
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </section>
</template>
