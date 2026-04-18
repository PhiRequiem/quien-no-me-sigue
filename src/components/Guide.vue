<script setup>
import { ExternalLink } from 'lucide-vue-next'
</script>

<template>
  <section id="manual" class="border-b border-[var(--color-line)] bg-white">
    <div class="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-5">
      <div class="md:col-span-2">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Manual
        </p>
        <h2 class="mt-4 text-3xl font-medium tracking-tight">
          Como bajar tu informacion de Instagram
        </h2>
        <p class="mt-4 text-[var(--color-muted)]">
          Instagram te deja exportar tus datos desde el Accounts Center de Meta. Tarda unos
          minutos en estar disponible y te avisa por correo.
        </p>
      </div>

      <ol class="md:col-span-3 space-y-6 text-left">
        <li class="flex gap-4">
          <span class="font-mono text-sm text-[var(--color-muted)]">01</span>
          <div>
            <p class="font-medium">Abre Accounts Center</p>
            <p class="mt-1 text-sm text-[var(--color-muted)]">
              Entra a
              <a
                href="https://accountscenter.instagram.com/info_and_permissions/"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 underline decoration-[var(--color-line)] underline-offset-4 hover:decoration-[var(--color-ink)]"
              >
                accountscenter.instagram.com
                <ExternalLink class="h-3 w-3" :stroke-width="2" aria-hidden="true" />
              </a>
              y haz clic en "Your information and permissions".
            </p>
          </div>
        </li>

        <li class="flex gap-4">
          <span class="font-mono text-sm text-[var(--color-muted)]">02</span>
          <div>
            <p class="font-medium">Elige "Export your information"</p>
            <p class="mt-1 text-sm text-[var(--color-muted)]">
              Selecciona la cuenta de Instagram y pide un nuevo export.
            </p>
          </div>
        </li>

        <li class="flex gap-4">
          <span class="font-mono text-sm text-[var(--color-muted)]">03</span>
          <div>
            <p class="font-medium">Personaliza la seleccion</p>
            <p class="mt-1 text-sm text-[var(--color-muted)]">
              En "Select types of information" marca solo "Followers and following". Bajo formato
              elige
              <span class="rounded bg-[var(--color-line)]/60 px-1.5 py-0.5 font-mono text-xs"
                >JSON</span
              >
              y como destino "Download to device".
            </p>
          </div>
        </li>

        <li class="flex gap-4">
          <span class="font-mono text-sm text-[var(--color-muted)]">04</span>
          <div>
            <p class="font-medium">Descarga el ZIP</p>
            <p class="mt-1 text-sm text-[var(--color-muted)]">
              Cuando recibas el aviso de Instagram, vuelve al Accounts Center y descarga el
              archivo. Es un
              <span class="rounded bg-[var(--color-line)]/60 px-1.5 py-0.5 font-mono text-xs"
                >.zip</span
              >
              con una carpeta
              <span class="rounded bg-[var(--color-line)]/60 px-1.5 py-0.5 font-mono text-xs"
                >connections/followers_and_following</span
              >.
            </p>
          </div>
        </li>

        <li class="flex gap-4">
          <span class="font-mono text-sm text-[var(--color-muted)]">05</span>
          <div>
            <p class="font-medium">Sube el ZIP arriba</p>
            <p class="mt-1 text-sm text-[var(--color-muted)]">
              No hace falta descomprimirlo. Se procesa en tu navegador y no se envia a ningun
              lado.
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
