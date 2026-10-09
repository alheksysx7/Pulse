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
A nivel de software, la lógica de simulación (`square-alternating.ts`) genera una malla real utilizando nudos planos completos (`SQUARE`), exigiendo un mínimo de 8 hilos (número par) para garantizar que el efecto de entrelazado sea visible y no se degrade a una columna simple.
1. **Fila Par (0, 2, 4...):** El simulador agrupa los hilos de 4 en 4, tejiendo múltiples nudos `SQUARE` uno al lado del otro. Para lograr esto, `simulate.ts` está programado para limitar la envergadura (`threadSpan`) del nudo plano a un máximo de 4 hilos cuando forma parte de una secuencia, evitando que un solo nudo se apropie de todo el ancho de la pulsera.
2. **Fila Impar (1, 3, 5...):** La secuencia inserta explícitamente un nudo vacío (`NONE`) al inicio de la fila, lo que provoca un desfase estructural de 2 hilos. Los hilos centrales restantes se agrupan en nudos `SQUARE` de 4 hilos. Al llegar al extremo derecho, los hilos sobrantes también se dejan libres. Esto enlaza los nudos de la fila anterior, produciendo la red.
3. **Conexiones Orgánicas (Curvas de Bezier):** Para evitar que el desfase diagonal luzca rígido o artificial (como un cableado recto), el renderizador de la pulsera (`BraceletCanvas.tsx`) dibuja los hilos que viajan entre las filas utilizando curvas de Bezier cúbicas (`ctx.bezierCurveTo`). Esto otorga a los enlaces diagonales una caída y tensión natural.

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

## Pulsera de Macramé (Nudo Festón en Cadena / Diagonal)

### Materiales Necesarios
5 hilos de diferentes colores (por ejemplo: blanco, celeste/turquesa, lila, gris y rojo) para formar una franja diagonal multicolor.

### Paso a Paso del Patrón

**1. Preparación y Orden de los Hilos:**
* Sujeta los extremos superiores de los 5 hilos bajo el clip de la tabla.
* Extiende los hilos hacia abajo y organízalos de izquierda a derecha según el orden de los colores que deseas mostrar en la diagonal (por ejemplo: blanco, celeste, lila, gris y rojo).

**2. Inicio de la Primera Hilera Diagonal (De Izquierda a Derecha):**
* Toma el primer hilo de la extrema izquierda (en este ejemplo, el hilo blanco); este funcionará como tu hilo guía.
* Inclina el hilo guía hacia la derecha, pasándolo por encima del siguiente hilo adyacente (el celeste).
* Teje dos nudos festón (doble nudo) con el hilo celeste sobre el hilo guía blanco.

**3. Continuación de la Hilera:**
* Desplaza tu hilo guía blanco un paso más hacia la derecha, pasándolo por encima del siguiente hilo (el lila) y teje un nudo festón sobre él.
* Repite el proceso avanzando hacia la derecha: haz un nudo festón con el hilo gris sobre la guía blanca, y finalmente otro nudo festón con el hilo rojo sobre la misma guía blanca. Al terminar esta fila, el hilo blanco habrá cruzado todo el ancho hacia la derecha.

**4. Repetición del Patrón con el Siguiente Hilo:**
* Una vez que completas la primera hilera diagonal, el nuevo hilo que quedó en la extrema izquierda (el celeste) se convierte en tu nuevo hilo guía.
* Repite exactamente el mismo procedimiento: inclínalo hacia la derecha y teje nudos festón sucesivos sobre él con cada uno de los hilos que le siguen (lila, gris, rojo y el blanco anterior).
* Continúa este ciclo de manera constante para formar las franjas diagonales características de este tejido. Ajusta bien cada nudo para que el diseño quede firme, compacto y ordenado.

## Pulsera de Macramé (Patrón de Festón con Saltos)

Este diseño especializado utiliza nudos festón sobre un hilo guía móvil, pero a diferencia del festón clásico, se caracteriza por omitir (saltar) de manera intencional el anudado en los hilos de los extremos durante ciertas hileras. Al hacerlo, el hilo de trabajo queda "en espera" (tensado verticalmente en el borde) hasta que el tejido regresa a él. 

### Anatomía Visual y Renderizado
En el simulador (`jumping-festoon.ts`), este patrón presenta desafíos visuales únicos debido a los hilos tensados en los bordes y la posibilidad de añadirles adornos:
1. **Barrido de Inicialización:** El tejido siempre comienza con un barrido completo de todos los hilos (`K+1` nudos) para establecer una base firme.
2. **Ciclo Asimétrico (Saltos):** Después de la base, el tejido entra en un ciclo de saltos. El hilo en el extremo opuesto a la dirección de tejido se salta intencionalmente (renderizado como `NONE`), formándose una línea vertical tensa a lo largo del borde por múltiples filas.
3. **Nudos Backward (`B`):** Todo el patrón se simula utilizando nudos de tipo `B`. Esto asegura que el hilo transversal actúe como una guía "pasiva" oculta por debajo, mientras que los hilos verticales que lo envuelven dictan el color real del nudo visible en la pulsera (tal como lo reportó el usuario).
4. **Visibilidad de Hilos Libres:** A diferencia de otros patrones donde los hilos `NONE` en los bordes se ocultan automáticamente, en este diseño se desactivó el ocultamiento preventivo (en `BraceletCanvas.tsx`) para permitir que la línea vertical tensa sea completamente visible.
5. **Abalorios / Balines en los Bordes:**
   * Al tener un hilo vertical tensado durante varias filas, se aprovecha ese espacio "hueco" para insertar abalorios. 
   * **Prevención de Superposición:** En lugar de dibujar un abalorio por cada fila inactiva o saltada, la lógica de simulación rastrea las secuencias continuas de inactividad (conteo de `consecutiveLeftNones` y `consecutiveRightNones`) y dibuja exactamente **un solo abalorio perfectamente centrado** en el punto medio del salto de cada segmento.
   * **Supresión en el Arranque:** Para evitar que el primer abalorio quede flotando de forma antinatural sin soporte visual, el simulador omite su dibujo en las primeras filas de inicialización comprobando que se haya pasado la base (`rowIndex >= threadsCount - 1`).
   * **Tipos de Materiales:** Se implementaron tres estilos de renderizado que modifican el color base, el trazo perimetral y el tipo de luz especular para simular distintos materiales físicos: Dorado (metálico y amarillo), Plateado (metálico con reflejos blancos intensos) y Madera (colores café mate con un brillo especular muy tenue).

### Instrucciones Paso a Paso (Cómo tejerlo en la vida real)

**Preparación Inicial:**
* Corta 5 hilos y sujétalos juntos en la parte superior con el clip de la tabla. 
* Extiéndelos hacia abajo para organizarlos de izquierda a derecha y comenzar el tejido.

**Paso 1: Primera Hilera Completa hacia la Derecha:**
* Toma el primer hilo de la extrema izquierda (ej. rojo) y pásalo sobre los demás hilos hacia la derecha para usarlo como hilo guía. 
* Cada uno de los hilos restantes hace un nudo festón doble sobre este hilo guía. 

**Paso 2: Segunda Hilera (Saltando el Cuarto Hilo):**
* Toma el nuevo hilo que quedó en el borde izquierdo y pásalo sobre los otros hilos para que sea el nuevo hilo guía. 
* Teje nudos festón con los siguientes 3 hilos, pero **deja el 4to hilo (el último a la derecha) libre sin anudar**. Al quedar tenso y libre, aquí es donde podrás ensartar físicamente un abalorio real.

**Paso 3: Tercera Hilera (Desplazamiento a la Izquierda):**
* Aparta el primer hilo de la izquierda (déjalo libre y ensarta otro abalorio si lo deseas). 
* Utiliza el 2do hilo de la izquierda como el nuevo hilo guía. 
* Con los otros 3 hilos restantes, haz nudos festón dobles en sentido contrario.
* El patrón continúa alternando entre estos "saltos" asimétricos por el resto de la pulsera, uniendo y liberando hilos en los extremos, logrando encapsular los abalorios entre el tejido central.

## Festón en V (Variante Chevron)

Este patrón es una variante del popular diseño "Chevron". En el Chevron tradicional, los hilos de colores se entrelazan usando los hilos activos como guías y moviéndolos hacia el centro. En esta **variante**, los hilos de los extremos funcionan como guías estáticas ("Festón Cruzado" o "Convergente"), mientras que los hilos interiores se anudan sobre ellas, formando una característica V o flecha, pero con una técnica estructuralmente diferente.

### Materiales Necesarios
5 hilos de diferentes colores (o más, siempre que sea un número impar o se dividan en dos grupos con un centro claro).

### Paso a Paso del Patrón

**Preparación Inicial:**
* Sujeta los 5 hilos juntos en la parte superior con el clip de la tabla.
* Extiende los hilos hacia abajo para organizarlos antes de comenzar el tejido.

**Paso 1 (Lado Izquierdo hacia el Centro):**
* Toma el primer hilo de la extrema izquierda y úsalo como hilo guía estático, cruzándolo por encima de los demás hilos hacia la derecha.
* Toma el 2do hilo (que queda a la derecha del guía) y haz un **Nudo Festón Hacia Atrás (Backward Knot)** sobre el hilo guía.
* Toma el 3er hilo y repite el nudo hacia atrás sobre la misma guía, deteniéndote en el centro.

**Paso 2 (Lado Derecho hacia el Centro):**
* Toma el hilo del extremo derecho y úsalo como hilo guía estático, cruzándolo por encima de los otros hilos hacia la izquierda.
* Toma el 4to hilo (que queda a la izquierda del guía) y haz un **Nudo Festón Hacia Adelante (Forward Knot)** sobre esta guía.
* Toma el 3er hilo (que ahora es el centro) y haz el siguiente nudo hacia adelante sobre la misma guía para cerrar el centro y unir ambas mitades.

**Repetición:**
* Vuelve a repetir el ciclo completo desde el Paso 1 alternando los lados para formar el patrón continuo. 
* Ajusta firmemente cada nudo para mantener la forma simétrica de "V".
