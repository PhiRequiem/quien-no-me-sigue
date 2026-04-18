# Quien no me sigue

Descubre quién no te sigue en Instagram. Analiza tus followers y following localmente, sin enviar datos a servidores.

## Características

- **Análisis local**: Todo el procesamiento ocurre en tu navegador. Tu información nunca sale de tu dispositivo.
- **Ordenamiento**: Ordena por usuario o fecha (ascendente/descendente).
- **Colores por antigüedad**: Visualiza qué cuentas llevan más de 1 o 2 años sin seguirte.
- **Comparación de exports**: Sube dos exports diferentes para ver quién te dejó de seguir, quiénes son nuevos seguidores, a quién dejaste de seguir, y a quién empezaste a seguir.
- **Búsqueda**: Filtra resultados en tiempo real.
- **Exporta a CSV**: Descarga los resultados como archivo CSV.
- **Persistencia local**: Los datos se guardan en tu navegador. Al recargar, los resultados siguen disponibles sin re-subir el ZIP.
- **Solicitudes pendientes**: Ve las cuentas a las que ya les pediste seguir pero aún no aceptan.

## Cómo usar

### 1. Descarga tu información de Instagram

1. Abre [Accounts Center](https://accountscenter.instagram.com/info_and_permissions/)
2. Haz clic en "Your information and permissions"
3. Elige "Export your information"
4. Selecciona tu cuenta de Instagram y pide un nuevo export
5. En "Select types of information" marca solo "Followers and following"
6. En formato elige **JSON** y como destino **Download to device**
7. Cuando recibas el aviso de Instagram, descarga el ZIP
8. El archivo contiene una carpeta `connections/followers_and_following/`

### 2. Analiza tus datos

1. Abre la app
2. Sube el ZIP descargado
3. Explora los resultados:
   - **No me siguen**: Cuentas que sigues pero no te siguen de vuelta
   - **No sigo de vuelta**: Seguidores a los que no sigues
   - **Pendientes**: Solicitudes de seguimiento aún sin respuesta
4. Ordena, busca, compara con otros exports, y exporta a CSV si quieres

## Stack

- **Vue 3** - Framework reactivo
- **Vite** - Build tool rápido
- **Tailwind CSS** - Estilos minimalistas
- **Lucide Icons** - Iconografía consistente
- **JSZip** - Procesamiento de archivos ZIP en el navegador

## Desarrollo local

```bash
cd app
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

### Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para desplegar.

## Privacidad

- **100% local**: No hay servidor. Tu información nunca sale de tu navegador.
- **No hay cookies de tracking**: La app solo usa localStorage para guardar tu último análisis.
- **Código abierto**: Puedes revisar exactamente qué hace la app.

## Licencia

[Creative Commons Zero v1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

Dominio público. Úsalo, modifícalo, compártelo sin restricciones.

## Sugerencias y reportes

¿Encontraste un bug? ¿Tienes una idea? Contacta a [@phirequiem](https://www.instagram.com/phirequiem/) por [Instagram DM](https://ig.me/m/phirequiem).

## Créditos

Hecho por [@phirequiem](https://www.instagram.com/phirequiem/)
