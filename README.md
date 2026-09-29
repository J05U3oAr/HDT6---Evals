# HDT 6 — Evals con Promptfoo

Agente determinista en español para Parachute S.A. con dos capacidades:

- Agendar citas de lunes a viernes, de 08:00 a 17:00 (hora de Guatemala).
- Resolver preguntas frecuentes de horario, cancelación/reprogramación y contacto.

Cada respuesta conserva la traza de herramientas en `metadata.toolCalls`. Esto permite evaluar no solo el texto final, sino que el calendario o la base de conocimiento se hayan llamado con los argumentos correctos.

## Instalación y pruebas

```powershell
npm.cmd install
npm.cmd test
```

## Evals y reporte

La entrega incluye dos configuraciones de Promptfoo:

- `promptfooconfig.yaml`: contiene el assertion nativo `factuality` de Promptfoo, además de `regex`, `latency` y validación JavaScript de ejecución de herramientas. Usa NVIDIA Nemotron mediante una API compatible con OpenAI y requiere `NVIDIA_API_KEY`.
- `promptfooconfig.local.yaml`: suite totalmente reproducible sin credenciales. Contrasta la factualidad contra hechos canónicos mediante un assertion JavaScript y conserva los evals deterministas, de latencia y tool execution. Es la que genera el reporte incluido.

```powershell
# Reporte reproducible, sin API key
npm.cmd run eval:local

# Suite con el grader factuality nativo (NVIDIA)
$env:NVIDIA_API_KEY = '...'
npm.cmd run eval
```

Se usa --no-cache en ambos comandos porque Promptfoo requiere desactivar la caché para que el assertion latency mida la ejecución real. Los resultados se exportan a reports/promptfoo-local.json y reports/promptfoo-factuality.json.
Los scripts configuran `PROMPTFOO_CONFIG_DIR` dentro del repositorio y desactivan telemetría/actualizaciones para que la ejecución sea reproducible y no necesite escribir fuera del proyecto.

## Cobertura de la evaluación

| Categoría | Implementación |
| --- | --- |
| Factuality | Grader `factuality` nativo y alternativa reproducible contra hechos canónicos. |
| Determinística | `regex`/`contains` para formato, contenido y confirmación de citas. |
| Latencia | Assertion `latency` con máximo de 500 ms. |
| Tool execution | Assertion JavaScript que valida nombre, error y argumentos de cada herramienta. |
