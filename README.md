# Jarvis · OpenClaw — Centro de operaciones retro

Interfaz tipo videojuego retro (oficina pixel-art top-down) para **controlar, observar y comunicarse** con el agente de IA **Jarvis**, conectado a **OpenClaw**.

![estilo](https://img.shields.io/badge/estilo-pixel--art-green) ![stack](https://img.shields.io/badge/stack-Next.js%20%2B%20TS%20%2B%20Tailwind-blue)

## Qué incluye

- **Oficina pixel-art top-down** dibujada 100% con SVG + CSS (sin assets externos ni protegidos).
- **Jarvis** como personaje principal, con estados visuales: `idle` (respira), `thinking` (burbuja de puntos), `running` (camina hacia el módulo relacionado con la tarea), `done` (✓) y `error` (!).
- **5 estaciones de módulos** con NPCs y etiquetas flotantes: `OpenClaw`, `Memory`, `Tools`, `Browser`, `Status`.
- **Consola de comandos** con historial (↑/↓), respuestas del agente y botón limpiar.
- **Panel de estado**: conexión, gateway token, modelo, tokens, contexto, tarea y cronómetro.
- **Panel de tareas**: tarea actual, subtareas, barra de progreso pixel y resultado.
- **Login con Gateway Token** (mock: cualquier token de 4+ caracteres).
- **Marco tipo CRT** con scanlines sutiles.

## Comandos disponibles

```
status              resumen del sistema
run task <texto>    ejecuta una tarea simulada (Jarvis camina al módulo adecuado)
stop                detiene la tarea actual
clear               limpia la consola
memory              consulta la memoria del agente
logs                eventos recientes
tokens              uso de tokens
context             ventana de contexto
connect             reconectar con el gateway
help                lista de comandos
```

`run task` elige el módulo destino según el texto: menciona "web/buscar" → Browser, "memoria" → Memory, "conexión/api/openclaw" → OpenClaw, "estado" → Status, resto → Tools.

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:3000
# producción:
npm run build && npm start
```

En el login usa cualquier token de 4+ caracteres (ej. `demo-token`).

## Arquitectura

```
src/
  app/
    page.tsx            # composición: login → oficina + consola + paneles
    layout.tsx
    globals.css
  components/
    RetroOfficeMap.tsx  # mapa 18x13 tiles, paredes, muebles, estaciones
    JarvisCharacter.tsx # sprite pixel + indicadores de estado
    CommandConsole.tsx
    StatusPanel.tsx
    TaskPanel.tsx
    GatewayLogin.tsx
    FloatingLabel.tsx
  hooks/
    useAgentStatus.ts   # suscripción al stream del agente
    useCommandConsole.ts
    useGatewayAuth.ts
  lib/
    openclawClient.ts   # ← capa de integración (hoy mock, mañana real)
    mockAgent.ts        # máquina de estados + simulación de tareas/logs
    commandParser.ts
  types/
    agent.ts
  styles/
    retro.css           # animaciones pixel + CRT
```

**Flujo de datos:** la UI solo habla con `openclawClient.ts`. Este delega hoy en `mockAgent` (un singleton observable con patrón suscripción). `useAgentStatus` se suscribe al stream y cada cambio de estado re-renderiza mapa y paneles.

## Conectar con OpenClaw real

Todos los puntos de conexión están marcados con `TODO(openclaw)` en `src/lib/openclawClient.ts`:

1. `connectWithGatewayToken(token)` → `POST {GATEWAY_URL}/auth`.
2. `getAgentStatus()` → `GET {GATEWAY_URL}/status`.
3. `sendCommand(command)` → `POST {GATEWAY_URL}/command`.
4. `streamAgent(cb)` → reemplazar la suscripción al mock por WebSocket/SSE del gateway.

La UI no requiere cambios: consume la misma interfaz tipada (`AgentStatus`, `CommandLog`, `TaskInfo` en `src/types/agent.ts`). Define `NEXT_PUBLIC_OPENCLAW_URL` en `.env.local` cuando exista el backend.
