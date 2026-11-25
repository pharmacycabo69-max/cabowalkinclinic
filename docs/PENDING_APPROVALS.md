# Aprobaciones pendientes (V4) — 2026-11-25

Nada de esto está publicado. Todo vive en la rama `dev/v4-redesign`.

| # | Decisión | Qué hice en desarrollo | Por qué necesita aprobación |
|---|---|---|---|
| A1 | ~~Médico a domicilio $189 vs $199~~ **Resuelto 2026-11-25: $189 (propietario)** | $189 en checkout, reservas, páginas y schema | Al publicar: alinear anuncios que digan $199 |
| A2 | Publicar la rama en producción | Nada publicado | Regla de V4 y CLAUDE.md |
| A3 | Rayos X en hotel | Ahora dice "a solicitud, sujeto a confirmación" | V4 pide validar equipo, alcance y permisos antes de ofrecerlo |
| A4 | Precios de estética **+ impuestos** (los demás servicios dicen impuestos incluidos) | Sin cambios (tú los confirmaste el 24-nov) | V4 dice "estética sin precio confirmado: cotización"; tú los confirmaste. Confirma que siguen vigentes. |
| A5 | Procedimientos de estética fuera de las 4 categorías estrictas (hilos PDO, bioestimuladores, masetero, sonrisa gingival) | Sin cambios | V4 §7: solo 4 categorías. Decide si se quedan dentro de "Facial rejuvenation" / "Facial botulinum". |
| A6 | Título de Luis Camacho | Mantengo "Técnico Radiólogo" (tu respuesta) | V4 dice "título pendiente" |
| A7 | Fotos reales (fachada, recepción, consultorio, equipo con uniforme) | Uso la foto real del Dr. Kevin; las de recepción quedan marcadas como ilustrativas | Necesito tus fotos y autorización de uso |
| A8 | Etiquetas de conversión de Google Ads | `LABELS` vacíos en `track.v3.js` | Las da la cuenta de Ads |
| A9 | Revisar URLs finales y textos de anuncios (24/7, $199, precios viejos) antes de publicar | Sin cambios en Ads | No modifico campañas |
| A10 | Horario en Google Business Profile = 9–17 | — | Lo cambias tú en el perfil |
| A11 | Documentos del proveedor de radiología (sede, estudios, equipo, permisos, tiempos, tarifas) | Página de rayos X sin instalaciones propias, todo por cotización | Sin esos documentos no se publican sede, precios ni disponibilidad |
| A12 | Qué campañas usar: walk-in, médico bilingüe, turistas, domicilio, seguros, laboratorio, rayos X. IV con prueba pequeña; video y estética solo orgánico | Landings listas en dev | Política de Google Ads (medicamentos con receta y telemedicina) |
