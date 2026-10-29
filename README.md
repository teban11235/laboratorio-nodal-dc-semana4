# Laboratorio Nodal DC — Circuitos Eléctricos (Semana 4)

Recurso educativo interactivo diseñado para la enseñanza, simulación y práctica del **Análisis Nodal y Supernodos en Corriente Continua (DC)**, basado en la Guía Didáctica de la Semana 4 de la asignatura **Circuitos Eléctricos (UTPL)**.

👉 **Abrir aplicación interactiva en línea (GitHub Pages):**  
**[https://teban11235.github.io/laboratorio-nodal-dc-semana4/](https://teban11235.github.io/laboratorio-nodal-dc-semana4/)**

---

## Descripción General

Esta aplicación web permite a docentes y estudiantes experimentar en tiempo real con circuitos resistivos en corriente continua (DC), visualizando cómo cambian los potenciales nodales, el sentido físico de las corrientes de rama y el planteamiento algebraico de las ecuaciones al modificar los parámetros del circuito.

### Módulos Interactivos Incluidos

1. **Módulo 01 — Fundamentos (`Fundamentos`)**:
   * Definición de nodo, nodo de referencia o tierra ($v = 0\text{ V}$) y Ley de Corrientes de Kirchhoff (LCK).
   * Simulador interactivo de potenciales nodales y comprobador de la convención de corriente en un resistor: $i = (v_{\text{mayor}} - v_{\text{menor}}) / R$.
2. **Módulo 02 — Procedimiento de Análisis Nodal (`Método Nodal`)**:
   * Resolución guiada en 4 pasos para circuitos con fuentes de corriente independientes y resistores.
   * Alternancia en vivo entre los criterios $\sum i_{\text{salen}} = 0$ y $\sum i_{\text{entran}} = \sum i_{\text{salen}}$, con verificación matricial $G \cdot v = I$.
3. **Módulo 03 — Fuentes de Tensión: Caso A y Supernodo (`Supernodo`)**:
   * Análisis comparativo entre el **Caso A** (fuente de tensión conectada al nodo de referencia) y el **Caso B** (fuente de tensión flotante entre dos nodos no referenciados formando un **Supernodo**).
   * Inspección visual de la frontera del supernodo, ecuación LCK global, ecuación de restricción LTK ($v_a - v_b = V_{\text{fuente}}$) y cálculo de la corriente interna de la fuente.
4. **Módulo 04 — Taller Práctico Guiado (`Taller Guiado`)**:
   * Constructor y verificador interactivo de signos para plantear las ecuaciones LCK y LTK de un supernodo con rama resistiva en paralelo.
5. **Módulo 05 — Mapa Conceptual Interactivo (`Mapa Conceptual`)**:
   * Explorador jerárquico del método de nodos y actividad interactiva para conectar las relaciones conceptuales clave.
6. **Módulo 06 — Retos y Práctica (`Retos y Práctica`)**:
   * Autoevaluación con retroalimentación inmediata sobre errores comunes de signos, polaridades y resolución numérica, acompañada de un glosario activo y visor integrado de la guía en PDF.

---

## Tecnologías Utilizadas

* **React 19** + **TypeScript**
* **Vite 8** (entorno de desarrollo y empaquetado rápido)
* **Tailwind CSS v4** (diseño técnico adaptable y modo proyección para aula)
* **Lucide React** (iconografía técnica)

---

## Ejecución Local

### Requisitos previos
* [Node.js](https://nodejs.org/) (v18 o superior)

### Pasos para iniciar la aplicación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/teban11235/laboratorio-nodal-dc-semana4.git
   cd laboratorio-nodal-dc-semana4
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   *(En Windows también puedes hacer doble clic directamente sobre el archivo `Iniciar_App.bat`)*.

4. Abrir en el navegador:
   ```text
   http://localhost:3000
   ```

---

## Scripts Disponibles

* `npm run dev`: Inicia el servidor de desarrollo local en el puerto `3000`.
* `npm run build`: Genera la versión optimizada de producción en la carpeta `dist/`.
* `npm run preview`: Previsualiza localmente la compilación de producción.
* `npm run lint`: Verifica los tipos de TypeScript sin emitir archivos.
