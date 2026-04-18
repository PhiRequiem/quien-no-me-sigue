<script setup>
import { onMounted, ref } from 'vue'
import { CircleDot, ExternalLink, Github, MessageCircle, Scale, Moon, Sun } from 'lucide-vue-next'

// Actualiza esta URL una vez que subas el repositorio a GitHub
const GITHUB_URL = 'https://github.com/phirequiem/quien-no-me-sigue'
const INSTAGRAM_URL = 'https://www.instagram.com/phirequiem/'
const IG_DM_URL = 'https://ig.me/m/phirequiem'
const APP_VERSION = __APP_VERSION__
import Hero from './components/Hero.vue'
import Guide from './components/Guide.vue'
import Results from './components/Results.vue'
import Diff from './components/Diff.vue'
import Insights from './components/Insights.vue'
import { parseInstagramFile } from './lib/parseInstagram.js'
import { clearExport, clearVisited, loadExport, saveExport } from './lib/storage.js'

const data = ref(null)
const compareData = ref(null)
const savedAt = ref(null)
const loading = ref(false)
const error = ref('')
const isDarkMode = ref(false)

onMounted(() => {
  // dark mode setup
  const stored = localStorage.getItem('unfollow.local:dark-mode')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = stored ? stored === 'true' : prefersDark
  applyDarkMode()

  const cached = loadExport()
  if (cached) {
    data.value = {
      username: cached.username,
      followers: cached.followers,
      following: cached.following,
      pending: cached.pending,
    }
    savedAt.value = cached.savedAt
  }
})

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('unfollow.local:dark-mode', String(isDarkMode.value))
  applyDarkMode()
}

function applyDarkMode() {
  const html = document.documentElement
  if (isDarkMode.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

async function handleFile(file) {
  error.value = ''
  loading.value = true
  try {
    const parsed = await parseInstagramFile(file)
    if (parsed.following.length === 0 && parsed.followers.length === 0) {
      throw new Error('No se encontraron seguidores ni seguidos en el archivo.')
    }
    data.value = parsed
    compareData.value = null
    saveExport(parsed)
    savedAt.value = Date.now()
    requestAnimationFrame(() => {
      document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' })
    })
  } catch (e) {
    error.value = e?.message || 'No se pudo procesar el archivo.'
  } finally {
    loading.value = false
  }
}

async function handleCompare(file) {
  try {
    const parsed = await parseInstagramFile(file)
    if (parsed.following.length === 0 && parsed.followers.length === 0) {
      throw new Error('El segundo archivo no contiene datos validos.')
    }
    compareData.value = parsed
    requestAnimationFrame(() => {
      document.getElementById('comparacion')?.scrollIntoView({ behavior: 'smooth' })
    })
  } catch (e) {
    // silently log - non-critical action
    console.warn('Compare parse error:', e?.message)
  }
}

function reset() {
  data.value = null
  compareData.value = null
  savedAt.value = null
  error.value = ''
  clearExport()
  clearVisited()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-[var(--color-line)]">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="#" class="flex items-center gap-2 text-sm font-medium tracking-tight">
          <CircleDot class="h-4 w-4" :stroke-width="2.5" aria-hidden="true" />
          Quien no me sigue
        </a>
        <nav class="flex items-center gap-4 text-sm text-[var(--color-muted)]">
          <a href="#manual" class="hover:text-[var(--color-ink)]">Manual</a>
          <a
            href="https://accountscenter.instagram.com/info_and_permissions/"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 hover:text-[var(--color-ink)]"
          >
            Export en Meta
            <ExternalLink class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
          </a>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-[var(--color-paper)]"
            :title="isDarkMode ? 'Light mode' : 'Dark mode'"
            @click="toggleDarkMode"
            aria-label="Cambiar modo oscuro"
          >
            <Sun v-if="isDarkMode" class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
            <Moon v-else class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <Hero :loading="loading" :error="error" @file="handleFile" />

      <div v-if="data" id="resultados">
        <Results
          :data="data"
          :saved-at="savedAt"
          @reset="reset"
          @compare-pick="handleCompare"
        />
      </div>

      <div v-if="data">
        <Insights :data="data" />
      </div>

      <div v-if="data && compareData" id="comparacion">
        <Diff :data-a="data" :data-b="compareData" @close="compareData = null" />
      </div>

      <Guide />
    </main>

    <footer class="border-t border-[var(--color-line)] bg-white">
      <!-- fila principal -->
      <div class="mx-auto max-w-5xl px-6 py-6">
        <div class="flex flex-wrap items-center justify-between gap-4">

          <!-- creditos + version -->
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
              <CircleDot class="h-4 w-4" :stroke-width="2.5" aria-hidden="true" />
              Quien no me sigue
            </span>
            <span class="rounded-full border border-[var(--color-line)] px-2.5 py-0.5 font-mono text-xs text-[var(--color-muted)]">
              v{{ APP_VERSION }}
            </span>
          </div>

          <!-- botones -->
          <div class="flex flex-wrap items-center gap-2">
            <a
              :href="IG_DM_URL"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              <MessageCircle class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
              Sugerencias y reportes
            </a>
            <a
              :href="GITHUB_URL"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              <Github class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>

        <!-- fila secundaria -->
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)] pt-4 text-xs text-[var(--color-muted)]">
          <p>
            Hecho por
            <a
              :href="INSTAGRAM_URL"
              target="_blank"
              rel="noopener"
              class="font-medium text-[var(--color-ink)] underline decoration-[var(--color-line)] underline-offset-4 hover:decoration-[var(--color-ink)]"
            >@phirequiem</a>
            &middot;
            Procesamiento 100% local, ningun dato sale de tu dispositivo
          </p>
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
            title="Creative Commons Zero v1.0 Universal"
          >
            <Scale class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
            <span class="font-mono">CC0 1.0</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
