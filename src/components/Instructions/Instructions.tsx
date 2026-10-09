import { useDesignStore } from '../../store/useDesignStore';
import styles from './Instructions.module.css';

export function Instructions() {
  const { patternId } = useDesignStore();

  if (patternId === 'square') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Instrucciones: Tejido Nudo Plano</h2>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Preparación</h3>
            <p>Para el nudo plano necesitas un hilo central (o grupo de hilos que sirvan como guía) y dos hilos laterales para anudar.</p>
            <ul>
              <li>Fija los hilos centrales a tu tabla de trabajo. Estos deben mantenerse tensos.</li>
              <li>Coloca el hilo anudador por detrás de los hilos centrales de manera que tengas la misma longitud de hilo a la izquierda y a la derecha.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>Paso 1: Medio nudo plano (Lado izquierdo)</h3>
            <ol>
              <li>Toma el hilo del <strong>lado izquierdo</strong> y pásalo por <strong>encima</strong> de los hilos centrales, formando una forma de "4".</li>
              <li>Toma el hilo del <strong>lado derecho</strong>, pásalo por <strong>encima</strong> de la cola del hilo izquierdo, luego por <strong>debajo</strong> de los hilos centrales.</li>
              <li>Sácalo por el bucle (el "4") que formó el hilo izquierdo de abajo hacia arriba.</li>
              <li>Tira de ambos hilos laterales simultáneamente para apretar el nudo hacia arriba. Mantén los hilos centrales tensos.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Paso 2: Completar el nudo plano (Lado derecho)</h3>
            <ol>
              <li>Ahora, toma el hilo del <strong>lado derecho</strong> y pásalo por <strong>encima</strong> de los hilos centrales, formando una forma de "P" o un "4" invertido.</li>
              <li>Toma el hilo del <strong>lado izquierdo</strong>, pásalo por <strong>encima</strong> de la cola del hilo derecho, luego por <strong>debajo</strong> de los hilos centrales.</li>
              <li>Sácalo por el bucle que formó el hilo derecho de abajo hacia arriba.</li>
              <li>Tira de ambos hilos para apretar el nudo y completar el primer nudo plano completo.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Continuación</h3>
            <p>Repite los Pasos 1 y 2 alternando siempre entre izquierda y derecha. Si olvidas de qué lado te toca, fíjate en el pequeño bulto vertical que se forma en el costado del último nudo completo; el hilo que sale de ese lado es el que debe hacer la forma de "4" (o "4" invertido) para iniciar el siguiente medio nudo.</p>
          </section>
        </div>
      </div>
    );
  }


  if (patternId === 'zigzag-festoon') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Instrucciones: Nudo Festón Zigzag Alterno</h2>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Materiales Necesarios</h3>
            <p>Necesitarás 3 hilos para este patrón básico. Cada hilo debe ser de diferente color para facilitar la guía (por ejemplo: hilo 1 izquierdo, hilo 2 central e hilo 3 derecho).</p>
            <p>Una tabla con clip (portapapeles) para sujetar y tensar los hilos desde la parte superior.</p>
          </section>

          <section className={styles.section}>
            <h3>Fase 1: Zigzag hacia la derecha</h3>
            <ol>
              <li>Toma el <strong>hilo de la extrema izquierda (hilo 1)</strong>. Este será tu <strong>hilo guía</strong> para esta fase. Sosténlo diagonalmente hacia abajo y a la derecha, por encima de los otros dos hilos.</li>
              <li>Con el hilo siguiente (hilo 2), teje un <strong>nudo festón doble</strong> sobre el hilo guía. (Pasa el hilo 2 por encima del guía, rodeándolo por debajo y sacándolo por el bucle hacia arriba, repite este paso dos veces para completar un nudo festón).</li>
              <li>A continuación, toma el hilo de la extrema derecha (hilo 3) y teje otro nudo festón doble sobre el mismo hilo guía.</li>
              <li>Ahora tu hilo guía original (hilo 1) ha quedado en la posición de la extrema derecha.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Fase 2: Zigzag hacia la izquierda</h3>
            <ol>
              <li>Toma el hilo que ahora está en la extrema derecha (tu hilo guía original) y sostenlo diagonalmente hacia abajo y a la izquierda, por encima de los otros dos hilos.</li>
              <li>Con el hilo que quedó en el centro, teje un nudo festón doble sobre el hilo guía, apretando bien hacia la izquierda.</li>
              <li>Toma el hilo de la extrema izquierda y teje el siguiente nudo festón doble sobre el hilo guía.</li>
              <li>Tu hilo guía original ha regresado a la extrema izquierda.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Continuación</h3>
            <p><strong>Alterna:</strong> Repite constantemente la Fase 1 y la Fase 2. Verás cómo el hilo guía va rebotando de izquierda a derecha formando el patrón en zigzag, mientras que los hilos interiores se asoman llenando el tejido.</p>
          </section>
        </div>
      </div>
    );
  }

  if (patternId === 'diagonal-festoon') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Instrucciones: Pulsera de Macramé (Nudo Festón en Cadena / Diagonal)</h2>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Materiales Necesarios</h3>
            <p>5 hilos de diferentes colores (por ejemplo: blanco, celeste/turquesa, lila, gris y rojo) para formar una franja diagonal multicolor.</p>
          </section>

          <section className={styles.section}>
            <h3>Paso 1: Preparación y Orden de los Hilos</h3>
            <ul>
              <li>Sujeta los extremos superiores de los 5 hilos bajo el clip de la tabla.</li>
              <li>Extiende los hilos hacia abajo y organízalos de izquierda a derecha según el orden de los colores que deseas mostrar en la diagonal (por ejemplo: blanco, celeste, lila, gris y rojo).</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>Paso 2: Inicio de la Primera Hilera Diagonal (De Izquierda a Derecha)</h3>
            <ol>
              <li>Toma el primer hilo de la extrema izquierda (en este ejemplo, el hilo blanco); este funcionará como tu <strong>hilo guía</strong>.</li>
              <li>Inclina el hilo guía hacia la derecha, pasándolo por encima del siguiente hilo adyacente (el celeste).</li>
              <li>Teje dos nudos festón (doble nudo) con el hilo celeste sobre el hilo guía blanco.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Paso 3: Continuación de la Hilera</h3>
            <ol>
              <li>Desplaza tu hilo guía blanco un paso más hacia la derecha, pasándolo por encima del siguiente hilo (el lila) y teje un nudo festón sobre él.</li>
              <li>Repite el proceso avanzando hacia la derecha: haz un nudo festón con el hilo gris sobre la guía blanca, y finalmente otro nudo festón con el hilo rojo sobre la misma guía blanca.</li>
              <li>Al terminar esta fila, el hilo blanco habrá cruzado todo el ancho hacia la derecha.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Paso 4: Repetición del Patrón</h3>
            <p>Una vez que completas la primera hilera diagonal, el nuevo hilo que quedó en la extrema izquierda (el celeste) se convierte en tu nuevo hilo guía. Repite exactamente el mismo procedimiento: inclínalo hacia la derecha y teje nudos festón sucesivos sobre él con cada uno de los hilos que le siguen (lila, gris, rojo y el blanco anterior).</p>
            <p>Continúa este ciclo de manera constante para formar las franjas diagonales características de este tejido. Ajusta bien cada nudo para que el diseño quede firme, compacto y ordenado.</p>
          </section>
        </div>
      </div>
    );
  }

  if (patternId === 'jumping-festoon') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Instrucciones: Pulsera de Macramé (Patrón de Festón con Saltos)</h2>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Preparación Inicial</h3>
            <ul>
              <li>Sujeta los 5 hilos juntos en la parte superior con el clip de la tabla.</li>
              <li>Extiende los hilos hacia abajo para organizarlos y comenzar el tejido.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>Paso 1: Primera Hilera Completa hacia la Derecha</h3>
            <ol>
              <li>Toma el primer hilo de la extrema izquierda y pásalo sobre los demás hilos hacia la derecha para usarlo como hilo guía.</li>
              <li>Cada uno de los hilos restantes hace un nudo festón sobre este hilo guía.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Paso 2: Segunda Hilera (Saltando el Cuarto Hilo)</h3>
            <ol>
              <li>Toma el nuevo hilo que quedó en el borde izquierdo y pásalo sobre los otros hilos para que sea el nuevo hilo guía.</li>
              <li>Teje nudos festón con los siguientes 3 hilos, pero <strong>deja el 4to hilo libre</strong> sin anudar.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Paso 3: Tercera Hilera (Desplazamiento)</h3>
            <ol>
              <li>Aparta el primer hilo de la izquierda.</li>
              <li>Utiliza el 2do hilo como el nuevo hilo guía.</li>
              <li>Con los otros 3 hilos restantes, haz nudos festón sobre este hilo guía.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Repetición del Patrón</h3>
            <p>Vuelve a repetir el <strong>Paso 2</strong>. Luego, repite el <strong>Paso 3</strong>.</p>
            <p>Continúa alternando y repitiendo este ciclo constante para formar la estructura característica de la pulsera.</p>
          </section>
        </div>
      </div>
    );
  }

  if (patternId === 'alternating-half-hitch') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Instrucciones: Pulsera de Macramé (Medio Nudo Festón Alterno a un Hilo)</h2>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Materiales Necesarios</h3>
            <p>3 hilos de colores contrastantes.</p>
          </section>

          <section className={styles.section}>
            <h3>Preparación de la Base</h3>
            <ul>
              <li>Sujeta los tres hilos en la parte superior con el clip de la tabla.</li>
              <li>Coloca el hilo gris (o el color que prefieras) en el centro; este funcionará como el hilo guía estático y vertical.</li>
              <li>Coloca el hilo rojo a la izquierda y el hilo amarillo a la derecha; ambos funcionarán como hilos de trabajo.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>Paso 1: Primer Nudo (Lado Izquierdo)</h3>
            <ol>
              <li>Toma el hilo rojo de la izquierda y pásalo por encima del hilo guía central, formando un bucle hacia la derecha.</li>
              <li>Pasa el extremo del hilo rojo por debajo del hilo guía y por dentro del bucle para cerrar el nudo hacia la izquierda.</li>
              <li>Ajusta firmemente el nudo en la parte superior.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Paso 2: Segundo Nudo (Lado Derecho)</h3>
            <ol>
              <li>Toma el hilo amarillo de la derecha y pásalo por encima del hilo guía central, formando un bucle hacia la izquierda.</li>
              <li>Pasa el extremo del hilo amarillo por debajo del hilo guía y por dentro del bucle para cerrar el nudo hacia la derecha.</li>
              <li>Ajusta firmemente justo debajo del nudo anterior.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Repetición del Patrón</h3>
            <p><strong>Alterna:</strong> Continúa repitiendo este ciclo: un nudo con el hilo izquierdo (rojo), seguido de un nudo con el hilo derecho (amarillo), y así sucesivamente.</p>
          </section>
        </div>
      </div>
    );
  }
  if (patternId === 'chevron') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Instrucciones: Patrón Chevron / Festón Cruzado</h2>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Materiales Necesarios</h3>
            <p>5 hilos de diferentes colores (o más, siempre que sea un número impar o se dividan en dos grupos con un centro claro).</p>
          </section>

          <section className={styles.section}>
            <h3>Preparación Inicial</h3>
            <ul>
              <li>Sujeta los 5 hilos juntos en la parte superior con el clip de la tabla.</li>
              <li>Extiende los hilos hacia abajo para organizarlos antes de comenzar el tejido.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>Paso 1 (Lado Izquierdo hacia el Centro)</h3>
            <ol>
              <li>Toma el primer hilo de la extrema izquierda y úsalo como hilo guía, pasándolo sobre los demás hilos hacia la derecha.</li>
              <li>Haz un nudo festón con el 2do hilo sobre esta guía.</li>
              <li>Haz un segundo nudo festón con el 3er hilo sobre la misma guía, deteniéndote en el centro.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Paso 2 (Lado Derecho hacia el Centro)</h3>
            <ol>
              <li>Toma el hilo del extremo derecho y úsalo como hilo guía, pasándolo sobre los otros hilos hacia la izquierda.</li>
              <li>Haz el primer nudo festón con el 4to hilo sobre esta guía.</li>
              <li>Haz el siguiente nudo festón con el 3er hilo (que ahora es el centro) sobre la misma guía para cerrar el centro y unir ambas mitades.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h3>Repetición</h3>
            <p>Vuelve a repetir el ciclo completo desde el Paso 1 alternando los lados para formar el patrón continuo. Ajusta firmemente cada nudo para mantener la forma simétrica de "V".</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.emptyState}>
        <h2>Instrucciones no disponibles</h2>
        <p>Aún no tenemos instrucciones detalladas para este patrón. Por favor, selecciona el patrón "Tejido nudo plano", "Tejido nudo plano alternado" o "Nudo festón zigzag alterno" para ver un ejemplo.</p>
      </div>
    </div>
  );
}
