# Regla de Mantenimiento de Patrones

Cada vez que agregues o hagas commit de un nuevo patrón de macramé (en `src/core/patterns/`), estás obligado a realizar una fase de limpieza de código (Garbage Collection & Refactoring) en todo el repositorio. Esta fase debe incluir:

1. **Revisión de Condicionales Acumulativos**: Revisar `BraceletCanvas.tsx` y cualquier otro componente visual para simplificar o remover condicionales (ej. `if (patternId !== ... && patternId !== ...)`) que hayan crecido innecesariamente debido a los nuevos patrones.
2. **Eliminación de Código Muerto**: Buscar archivos `.ts` redundantes, variables sin usar, o imports que ya no se necesiten en `Instructions.tsx`, `index.ts` y componentes.
3. **Limpieza de Tipos**: Asegurar que las interfaces en `types.ts` no tengan propiedades deprecadas o que solo se usaron temporalmente y ya no son relevantes.
4. **Validación de Markdown**: Confirmar que la documentación (`MACRAME_KNOTS.md`) no mantenga referencias a IDs antiguos o nombres de variables incorrectas si se refactorizaron.
