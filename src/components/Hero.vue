<script setup>
import { ref } from 'vue'
import { Upload, Lock, AlertCircle, Loader2 } from 'lucide-vue-next'

const emit = defineEmits(['file'])
const isDragging = ref(false)
const inputRef = ref(null)

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) emit('file', file)
}

function onChange(e) {
  const file = e.target.files?.[0]
  if (file) emit('file', file)
  e.target.value = ''
}

function openPicker() {
  inputRef.value?.click()
}
</script>

<template>
  <section class="border-b border-[var(--color-line)]">
    <div class="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20 lg:py-28">
      <p
        class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]"
      >
        <Lock class="h-3.5 w-3.5" :stroke-width="2" aria-hidden="true" />
        Analisis local, sin subir nada a ningun servidor
      </p>
      <h1 class="mt-4 text-3xl font-medium tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
        Quien sigues y no te sigue en
        <span class="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] bg-clip-text text-transparent">
          Instagram
        </span>
      </h1>
      <p class="mt-4 text-base text-[var(--color-muted)] sm:mt-5 sm:text-lg">
        Descubre quién no te sigue de vuelta, quiénes son tus fans (te siguen pero no les sigues),
        y compara cambios entre diferentes fechas. Todo 100% local en tu navegador.
      </p>

      <div
        class="mt-12 rounded-2xl border border-dashed p-10 transition-colors"
        :class="[
          isDragging
            ? 'border-[var(--color-ink)] bg-white'
            : 'border-[var(--color-line)] bg-white/60 hover:bg-white',
        ]"
        role="region"
        aria-label="Zona de carga de archivo (arrastra o haz clic)"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <input
          ref="inputRef"
          type="file"
          accept=".zip,.json,application/zip,application/json"
          class="hidden"
          aria-label="Seleccionar archivo ZIP o JSON de Instagram"
          @change="onChange"
        />
        <Upload
          class="mx-auto h-8 w-8 text-[var(--color-muted)]"
          :stroke-width="1.5"
          aria-hidden="true"
        />
        <p class="mt-4 font-medium">Arrastra tu export de Instagram aqui</p>
        <p class="mt-1 text-sm text-[var(--color-muted)]">
          Sube el .zip completo descargado desde Meta o los archivos JSON individuales
        </p>
        <button
          type="button"
          class="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="loading"
          :aria-busy="loading"
          aria-label="Seleccionar y cargar archivo"
          @click="openPicker"
        >
          <template v-if="loading">
            <Loader2 class="h-4 w-4 animate-spin" :stroke-width="2.5" aria-hidden="true" />
            Analizando
          </template>
          <template v-else>
            <Upload class="h-4 w-4" :stroke-width="2.5" aria-hidden="true" />
            Seleccionar archivo
          </template>
        </button>
        <p class="mt-4 font-mono text-xs text-[var(--color-muted)]">
          Todo corre en tu navegador. El archivo nunca sale de tu dispositivo.
        </p>
      </div>

      <p v-if="error" class="mt-6 inline-flex items-center gap-2 text-sm text-red-700" role="alert">
        <AlertCircle class="h-4 w-4" :stroke-width="2" aria-hidden="true" />
        {{ error }}
      </p>
    </div>
  </section>
</template>
