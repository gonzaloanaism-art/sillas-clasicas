# Modelos 3D — Sillas Clásicas

Coloca aquí los archivos `.stl` o `.obj` y luego edita una línea en `data/chairs.ts`.

## Paso a paso

1. **Pon el archivo** en esta carpeta (`public/models/tu-archivo.stl` o `.obj`)
2. **Abre** `data/chairs.ts`
3. **Agrega** el campo `modelFile` a la silla correspondiente:

```ts
{
  slug: 'wassily-chair',
  name: 'Wassily Chair',
  // ... resto de campos
  modelFile: 'wassily-chair.stl',   // ← agrega esto
}
```

4. **Guarda** y haz `git push` — Vercel despliega automáticamente.

## Nombres de archivo sugeridos

| Silla                | Archivo sugerido            |
|----------------------|-----------------------------|
| Wassily Chair        | `wassily-chair.stl`         |
| Silla Roja y Azul    | `red-blue-chair.obj`        |
| Barcelona Chair      | `barcelona-chair.stl`       |
| Eames Lounge Chair   | `eames-lounge-chair.stl`    |
| Tulip Chair          | `tulip-chair.stl`           |
| Womb Chair           | `womb-chair.obj`            |
| Egg Chair            | `egg-chair.stl`             |
| Panton Chair         | `panton-chair.obj`          |

Puedes mezclar STL y OBJ libremente — el visor detecta la extensión automáticamente.
