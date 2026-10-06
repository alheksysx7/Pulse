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
