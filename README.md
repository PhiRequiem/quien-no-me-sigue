# Quien no me sigue

**🔗 [quien-no-me-sigue.vercel.app](https://quien-no-me-sigue.vercel.app/)**

Analiza tus seguidores de Instagram de forma segura y privada. Descubre quién no te sigue de vuelta, identifica a tus fans (gente que te sigue pero a quienes no sigues), y compara cambios entre diferentes fechas. Todo se procesa localmente en tu navegador, sin enviar datos a servidores.

## Inicio rápido

1. Ve a https://quien-no-me-sigue.vercel.app/
2. Descarga tu información desde [Instagram Accounts Center](https://accountscenter.instagram.com/info_and_permissions/)
3. Sube el ZIP y analiza tus seguidores
4. ¡Listo! Totalmente privado, sin datos compartidos

## Características

- **100% privado**: Todo se procesa en tu navegador. Tu información nunca sale de tu dispositivo.
- **Tres vistas principales**:
  - **No me siguen**: Cuentas que sigues pero no te siguen de vuelta
  - **Fans**: Gente que te sigue pero a quienes no sigues (seguir de vuelta)
  - **Pendientes**: Solicitudes de seguimiento que aún no han sido aceptadas
- **Comparación de fechas**: Carga dos exports en diferentes fechas para ver quién te dejó de seguir, nuevos seguidores, y cambios en tu actividad
- **Filtros inteligentes**: Busca por nombre o filtra por antigüedad (últimos 30 días, 3 meses, 6 meses, 1 año, 2 años)
- **Indicadores visuales**: Puntos de color para mostrar antigüedad (+1 año, +2 años) y marca púrpura para perfiles visitados
- **Exporta resultados**: Descarga como CSV con datos de visitados para seguimiento externo
- **Estadísticas**: Visualiza gráficos de distribución y análisis de tu actividad
- **Persistencia**: Los datos y visitados se guardan localmente - al recargar, todo sigue disponible
- **Dark mode**: Modo oscuro para comodidad visual
- **100% responsive**: Funciona perfectamente en móviles, tablets y desktop

## Cómo usar

Ve a **[quien-no-me-sigue.vercel.app](https://quien-no-me-sigue.vercel.app/)** y sigue estos pasos:

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

1. Abre [quien-no-me-sigue.vercel.app](https://quien-no-me-sigue.vercel.app)
2. Sube el ZIP descargado desde Instagram
3. Explora automáticamente tres vistas:
   - **No me siguen** (Ghosts): Cuentas que sigues pero no te siguen de vuelta
   - **No sigo de vuelta** (Fans): Gente que te sigue pero a quienes no sigues (considera seguirlos)
   - **Pendientes**: Solicitudes de seguimiento que enviaste y aún no aceptan
4. **Funcionalidades**:
   - Click en cualquier usuario para copiar `@usuario` al clipboard
   - Filtra por antigüedad (últimos 30 días, 90 días, 6 meses, 1 año, 2 años)
   - Marca perfiles como visitados (punto púrpura) para tracking
   - Compara con otro export para ver cambios históricos
   - Descarga resultados como CSV
   - Visualiza estadísticas y gráficos de distribución

### 3. Comparar cambios (Opcional)

Para ver cómo han cambiado tus seguidores:
1. Descarga dos exports en diferentes fechas
2. Carga el primero normalmente
3. Haz clic en "Comparar" y sube el segundo
4. Verás automáticamente:
   - Quién te dejó de seguir
   - Nuevos seguidores
   - A quién dejaste de seguir
   - A quién empezaste a seguir

## Stack

- **Vue 3** - Framework reactivo
- **Vite** - Build tool rápido
- **Tailwind CSS** - Estilos minimalistas
- **Lucide Icons** - Iconografía consistente
- **JSZip** - Procesamiento de archivos ZIP en el navegador

## Deployment

### ✅ Vercel (En producción)

La app está deployada en **[quien-no-me-sigue.vercel.app](https://quien-no-me-sigue.vercel.app/)**

El deployment automático está configurado:
- Cada push a `main` se despliega automáticamente
- Los cambios están disponibles inmediatamente
- Puedes ver el historial de deployments en [Vercel Dashboard](https://vercel.com/phirequiem/quien-no-me-sigue)

### Deploy manual

Si quieres hostear en otro servicio:

```bash
npm run build
```

Sube la carpeta `dist/` a:
- Netlify
- GitHub Pages
- Tu servidor estático preferido

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

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
