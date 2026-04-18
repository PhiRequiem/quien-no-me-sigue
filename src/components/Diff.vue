<script setup>
import { computed, ref } from 'vue'
import {
  UserX,
  UserCheck,
  UserMinus,
  UserPlus,
  ArrowUpRight,
  Download,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-vue-next'
import { diffExports, downloadCsv } from '../lib/parseInstagram.js'

const props = defineProps({
  dataA: { type: Object, required: true },
  dataB: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const diff = computed(() => diffExports(props.dataA, props.dataB))

const sections = computed(() => [
  {
    key: 'lostFollowers',
    label: 'Te dejaron de seguir',
    sublabel: 'Estaban en el export anterior, ya no estan en el nuevo',
    icon: UserX,
    color: 'text-red-600',
    dot: 'bg-red-400',
    rows: diff.value.lostFollowers,
    filename: 'te_dejaron_de_seguir.csv',
  },
  {
    key: 'gainedFollowers',
    label: 'Nuevos seguidores',
    sublabel: 'No estaban en el export anterior, aparecen en el nuevo',
    icon: UserCheck,
    color: 'text-green-600',
    dot: 'bg-green-400',
    rows: diff.value.gainedFollowers,
    filename: 'nuevos_seguidores.csv',
  },
  {
    key: 'unfollowed',
    label: 'Dejaste de seguir',
    sublabel: 'Los seguias en el export anterior, ya no los sigues en el nuevo',
    icon: UserMinus,
    color: 'text-amber-600',
    dot: 'bg-amber-400',
    rows: diff.value.unfollowed,
    filename: 'dejaste_de_seguir.csv',
  },
  {
    key: 'newFollowing',
    label: 'Empezaste a seguir',
    sublabel: 'No los seguias en el export anterior, los sigues ahora',
    icon: UserPlus,
    color: 'text-blue-600',
    dot: 'bg-blue-400',
    rows: diff.value.newFollowing,
    filename: 'empezaste_a_seguir.csv',
  },
])

const totalChanges = computed(() =>
  sections.value.reduce((sum, s) => sum + s.rows.length, 0),
)

const labelA = computed(() => props.dataA.username ? `@${props.dataA.username} (export A)` : 'Export A')
const labelB = computed(() => props.dataB.username ? `@${props.dataB.username} (export B)` : 'Export B')

// collapsible sections
const open = ref({ lostFollowers: true, gainedFollowers: true, unfollowed: false, newFollowing: false })

function toggle(key) {
  open.value[key] = !open.value[key]
}

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <section class="border-b border-[var(--color-line)] bg-white">
    <div class="mx-auto max-w-5xl px-6 py-16">

      <!-- header -->
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Comparacion
          </p>
          <h2 class="mt-3 text-3xl font-medium tracking-tight">
            {{ totalChanges }} cambios detectados
          </h2>
          <p class="mt-2 text-sm text-[var(--color-muted)]">
            Entre
            <span class="font-medium text-[var(--color-ink)]">{{ labelA }}</span>
            y
            <span class="font-medium text-[var(--color-ink)]">{{ labelB }}</span>
          </p>
        </div>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
          @click="$emit('close')"
        >
          <X class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
          Cerrar comparacion
        </button>
      </div>

      <!-- stat cards -->
      <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          v-for="s in sections"
          :key="s.key"
          class="rounded-xl border border-[var(--color-line)] p-4"
        >
          <component :is="s.icon" class="h-5 w-5" :class="s.color" :stroke-width="2" aria-hidden="true" />
          <p class="mt-3 text-2xl font-medium tracking-tight">{{ s.rows.length }}</p>
          <p class="mt-0.5 text-sm text-[var(--color-muted)]">{{ s.label }}</p>
        </div>
      </div>

      <!-- listas colapsables -->
      <div class="mt-8 space-y-3">
        <div
          v-for="s in sections"
          :key="s.key"
          class="overflow-hidden rounded-xl border border-[var(--color-line)]"
        >
          <!-- section header -->
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--color-paper)]"
            @click="toggle(s.key)"
          >
            <span class="flex items-center gap-3">
              <span :class="s.dot" class="h-2.5 w-2.5 flex-shrink-0 rounded-full"></span>
              <span class="font-medium">{{ s.label }}</span>
              <span class="rounded-full bg-[var(--color-line)] px-2 py-0.5 font-mono text-xs">
                {{ s.rows.length }}
              </span>
            </span>
            <ChevronUp v-if="open[s.key]" class="h-4 w-4 text-[var(--color-muted)]" :stroke-width="2" />
            <ChevronDown v-else class="h-4 w-4 text-[var(--color-muted)]" :stroke-width="2" />
          </button>

          <!-- section body -->
          <div v-if="open[s.key]" class="border-t border-[var(--color-line)]">
            <!-- empty state -->
            <p
              v-if="s.rows.length === 0"
              class="px-5 py-8 text-center text-sm text-[var(--color-muted)]"
            >
              Sin cambios en esta categoria
            </p>

            <template v-else>
              <!-- subheader with csv -->
              <div class="flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-paper)] px-5 py-2">
                <p class="text-xs text-[var(--color-muted)]">{{ s.sublabel }}</p>
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3 py-1 text-xs font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                  @click="downloadCsv(s.rows, s.filename)"
                >
                  <Download class="h-3.5 w-3.5" :stroke-width="2.5" aria-hidden="true" />
                  CSV
                </button>
              </div>

              <!-- rows (max 100 visible) -->
              <table class="w-full text-left text-sm">
                <tbody>
                  <tr
                    v-for="row in s.rows.slice(0, 100)"
                    :key="row.username"
                    class="border-b border-[var(--color-line)] last:border-b-0 hover:bg-[var(--color-paper)]/60"
                  >
                    <td class="px-5 py-2.5 font-medium">@{{ row.username }}</td>
                    <td class="px-5 py-2.5 text-[var(--color-muted)]">{{ formatDate(row.timestamp) }}</td>
                    <td class="px-5 py-2.5 text-right">
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
                  <tr v-if="s.rows.length > 100">
                    <td colspan="3" class="px-5 py-3 text-center text-xs text-[var(--color-muted)]">
                      Mostrando 100 de {{ s.rows.length }}. Descarga el CSV para ver todos.
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
