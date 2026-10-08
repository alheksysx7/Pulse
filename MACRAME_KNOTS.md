# Guía de Nudos de Macramé

Este documento recopila las instrucciones y detalles técnicos de los nudos de macramé implementados en la aplicación **Pulse**.

## Tejido Nudo Plano (2, 3 o 4 hilos)
*También conocido como Flat Square Knot.*

El nudo plano es uno de los nudos base más importantes del macramé. Su principal característica es que se teje entrelazando dos hilos de trabajo. Puede hacerse con **2, 3 o 4 hilos** (0, 1 o 2 hilos guía en el centro, y 2 hilos de trabajo en los extremos). Quitar los hilos guía no altera la estructura del nudo, simplemente lo hace más angosto y menos rígido.

### Anatomía Visual y Renderizado
Para lograr una simulación fotorrealista de este nudo, la aplicación lo renderiza utilizando una arquitectura de 3 capas superpuestas:
1. **Fondo (Hilos de Borde):** El hilo que cruza por **debajo** de las guías se dibuja primero como bucles asomándose por los costados izquierdo y derecho.
2. **Medio (Zigzag Central):** El hilo que cruza por **encima** de las guías se dibuja en el centro. Forma una textura visual en `>` o `<`. Al apilar los nudos uno debajo de otro, la punta inferior de un `>` conecta perfectamente con la punta superior del siguiente, formando un zigzag continuo y denso que oculta completamente los hilos guía.
3. **Frente (Bloqueo de Codos):** Para simular la tensión física del nudo, se dibujan pequeñas curvas del hilo de borde exactamente sobre las esquinas (codos) del zigzag central. Esto crea la ilusión 3D de que el hilo de fondo sale a la superficie y "abraza" o encierra la punta del zigzag.

**Caso Especial (2 hilos):** Cuando el nudo plano se teje sin hilos guía (solo 2 hilos), los dos hilos de trabajo se abrazan mutuamente. Estructuralmente es idéntico a una cadena de nudos rizos. Al no haber hilos fijos en el centro, los hilos se turnan para quedar en la parte frontal y en la parte posterior, lo que provoca que los colores del zigzag y de los bordes se **intercalen (alternen) en cada fila**.

### Instrucciones Paso a Paso (Cómo tejerlo en la vida real)

**1. Preparación de la Base:**
* Corta cuatro hilos largos (aproximadamente el doble de la longitud deseada para la pulsera).
* Sujeta los extremos superiores de los cuatro hilos juntos bajo el clip de una tabla.
* Separa los hilos: coloca los dos hilos de color en el centro, paralelos y juntos; estos serán los **hilos guía** y permanecerán estáticos durante todo el proceso.
* Coloca un hilo a la izquierda y otro hilo a la derecha. Estos serán los **hilos de trabajo**.

**2. Tejido del Primer Medio Nudo (comenzando por la izquierda):**
* Toma el hilo izquierdo, pásalo por encima de los dos hilos guía centrales y por debajo del hilo derecho.
* Toma el hilo derecho, pásalo por debajo de los hilos guía centrales y por encima del bucle formado por el hilo izquierdo.
* Tira de ambos hilos de trabajo hacia afuera y hacia arriba uniformemente para apretar el nudo contra la base.

**3. Completar el Nudo Plano (comenzando por la derecha):**
* Para terminar el nudo plano completo, repite el proceso en orden inverso.
* Pasa el hilo de la derecha por encima de los hilos guía. 
* Pasa el hilo de la izquierda por debajo de los hilos guía y por encima del bucle.
* Aprieta firmemente el nudo. Ahora tienes un nudo plano completo, que envuelve los hilos guía.

**4. Repetición del Patrón:**
* **Alterna:** Continúa tejiendo nudos planos completos, alternando el lado de inicio en cada nudo (un nudo comenzando por la izquierda, el siguiente comenzando por la derecha, y así sucesivamente). Esto evita que la pulsera se tuerza en espiral y la mantiene plana.
* Asegúrate de apretar cada nudo firmemente contra el anterior para crear un tejido denso y uniforme. Los hilos guía centrales deben permanecer rectos y ocultos dentro de los nudos.

**5. Finalización:**
* Teje hasta alcanzar la longitud deseada para la pulsera (aproximadamente 14-15 cm para una muñeca estándar).

## Tejido Nudo Plano Alternado
*También conocido como Alternating Square Knot o Macramé Red.*

Este patrón se crea utilizando filas entrelazadas de nudos planos. En lugar de tejer nudos planos en una sola columna vertical, los nudos se desplazan horizontalmente en cada fila, uniendo grupos de hilos adyacentes para formar una malla o red. Requiere un mínimo de 4 hilos, pero es ideal para pulseras anchas con 6, 8 o más hilos.

### Anatomía Visual y Renderizado
A nivel de software, el renderizado reutiliza el componente visual del nudo plano normal (`SQUARE`), pero la lógica de simulación (`square-alternating.ts`) aplica un desfase en las filas impares:
1. **Fila Par (0, 2, 4...):** Se tejen nudos planos usando los hilos en grupos de 4, comenzando desde el borde izquierdo (hilos 1-4, 5-8, etc.).
2. **Fila Impar (1, 3, 5...):** Se ignora un par de hilos en los bordes. Se tejen nudos planos con los hilos restantes (hilos 3-6, 7-10, etc.). Esto crea la conexión diagonal entre las columnas de nudos, produciendo el patrón de red.
3. **Medios Nudos Laterales (Simulación):** En nuestra simulación (`HALF_SQUARE_L` y `HALF_SQUARE_R`), para mantener bordes visualmente alineados y evitar que los hilos se crucen sobre el vacío de manera abrupta, se dibuja un bucle grueso sobre los hilos de borde inactivos de las filas impares.

### Instrucciones Paso a Paso (Cómo tejerlo en la vida real)

**1. Preparación de la Base:**
* Corta al menos 6 u 8 hilos largos (para hacer un patrón visible).
* Sujeta todos los hilos juntos bajo el clip de la tabla en paralelo.

**2. Primera Fila (Nudos Completos):**
* Toma los primeros 4 hilos de la izquierda. Usa los hilos 1 y 4 como hilos de trabajo, y los hilos 2 y 3 como hilos guía.
* Haz un nudo plano completo.
* Toma los siguientes 4 hilos (5, 6, 7, 8) y haz otro nudo plano completo.
* Repite hasta llegar al borde derecho.

**3. Segunda Fila (Nudos Alternados):**
* Deja sin usar los primeros 2 hilos de la izquierda.
* Toma los siguientes 4 hilos (los hilos 3 y 4 del primer nudo de arriba, y los hilos 5 y 6 del segundo nudo de arriba).
* Haz un nudo plano completo uniéndolos. Esto enlaza los dos nudos superiores.
* Repite a lo largo de la fila y deja sin usar los últimos 2 hilos de la derecha.

**4. Repetición del Patrón:**
* **Tercera Fila:** Usa todos los hilos nuevamente, igual que en la primera fila. Los primeros 2 hilos que quedaron sueltos se unen con los siguientes 2.
* Continúa alternando entre la "Fila 1" (todos los hilos en grupos de 4) y la "Fila 2" (dejando 2 hilos sueltos en cada borde).
* Asegúrate de mantener la tensión uniforme para que los "agujeros" de la red tengan el mismo tamaño.

## Tejido Nudo Festón en Zigzag Alterno
*También conocido como Alternating Zigzag Half-Hitch Pattern.*

Este patrón clásico utiliza nudos festón (half-hitch knots) sobre un único hilo guía que viaja de un lado a otro en zigzag, mientras los demás hilos actúan como hilos de trabajo. Ideal para pulseras de 3 hilos donde se desea destacar franjas diagonales intercaladas.

### Anatomía Visual y Renderizado
En el simulador, este nudo se teje usando dos nudos festón fundamentales (`F` y `B`) y técnicas visuales específicas para darle un aspecto ultra-realista:
1. **Nudo Forward (`F`):** El hilo de trabajo cruza por la izquierda sobre el hilo guía que está a la derecha. 
2. **Nudo Backward (`B`):** El hilo de trabajo cruza por la derecha sobre el hilo guía que está a la izquierda.

**Detalles del Renderizado:**
* **Forma:** Cada nudo festón (doble) se dibuja como una forma de "píldora" aplastada y compacta inclinada diagonalmente.
* **Hebra Central:** En medio de las dos vueltas del nudo, se dibuja un trazo grueso del mismo color cruzando en diagonal. En los nudos `F`, la hebra sube de abajo-izquierda hacia arriba-derecha. En los nudos `B`, baja de arriba-izquierda a abajo-derecha, replicando fielmente la anatomía de un nudo real.
* **Vértices (Ojales):** En los puntos extremos del zigzag, se dibuja un pequeño ojal del color del hilo guía asomando por debajo del nudo. Esto representa el punto exacto donde el hilo guía da la vuelta para cambiar de dirección (en el nudo `B` más a la derecha y en el nudo `F` más a la izquierda).
* **Fondo:** Los hilos guía interiores que bajan verticalmente se dibujan por detrás, dejándose ver sutilmente en los huecos (gaps) formados al aumentar la separación de las filas, mientras que los hilos libres de los bordes externos se ocultan para mantener limpio el contorno del zigzag.

La simulación (ver `zigzag-festoon.ts`) realiza un ciclo repetitivo:
* **Fase 1 (Guía hacia la derecha):** Teje una cadena de nudos `B` (Backward) inclinados hacia la derecha.
* **Fila de descanso (`NONE`):** Un espacio vacío para escalar el movimiento.
* **Fase 2 (Guía hacia la izquierda):** Teje una cadena de nudos `F` (Forward) inclinados hacia la izquierda.

### Instrucciones Paso a Paso (Cómo tejerlo en la vida real)

**Preparación de la Base:**
* Sujeta tres hilos largos juntos bajo el clip de la tabla en paralelo.
* Identifica tus hilos de izquierda a derecha: Hilo 1 (Ej. blanco), Hilo 2 (Ej. amarillo) e Hilo 3 (Ej. plomo).

**Fase 1: Movimiento hacia la Derecha (con el Hilo Guía Blanco):**
* Toma el Hilo 1 (blanco); este actuará como el hilo guía y se mantendrá tenso, inclinado diagonalmente sobre los otros dos hilos hacia la derecha.
* Teje el primer nudo festón (haciendo un "4" o lazo y pasando la punta por el bucle) sobre el hilo guía utilizando el Hilo 2 (amarillo). Hazlo dos veces para asegurar el nudo completo.
* Teje el segundo nudo festón sobre el mismo hilo guía utilizando el Hilo 3 (plomo).
* Ahora el hilo guía blanco ha quedado en la posición más a la derecha.

**Fase 2: Movimiento hacia la Izquierda (con el Hilo Guía Blanco):**
* Ahora, el hilo guía (blanco) cambia de dirección y se inclina hacia la izquierda por encima de los otros hilos.
* Teje un nudo festón sobre el hilo guía utilizando primero el Hilo 3 (plomo).
* Teje el siguiente nudo festón sobre el hilo guía utilizando el Hilo 2 (amarillo).
* El hilo guía ha regresado a la posición inicial izquierda.

**Repetición del Patrón:**
* Vuelve a repetir la Fase 1 (llevando el hilo guía blanco hacia la derecha para anudar primero el amarillo y luego el plomo).
* Continúa alternando: guía a la derecha y guía a la izquierda para formar el diseño de franjas de festones entrelazados en zigzag.
