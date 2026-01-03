CSV Cleaner Pro | Enterprise Data Quality Engine
CSV Cleaner Pro es una solución de ingeniería de datos orientada a la purificación y curaduría de datasets a gran escala. A diferencia de los formateadores convencionales, esta herramienta implementa una arquitectura de procesamiento en serie para garantizar la integridad referencial, la normalización estructural y la validez lógica de los registros antes de su ingesta en entornos de producción (Data Warehouses, RDBMS o Data Lakes).

🧬 Arquitectura del Sistema
El software implementa un diseño desacoplado basado en Patrones de Comportamiento y principios SOLID:

1. Pipeline & Filters Pattern
El procesamiento de datos se gestiona mediante una tubería de transformación donde el output de un nodo (Cleaner) sirve como input para el siguiente. Esto permite una trazabilidad completa de la mutación del dato.

2. Clase Abstracta y Herencia (ES6+)
Cada módulo de limpieza extiende de una clase base BaseCleaner, asegurando polimorfismo en el método execute(). Esto facilita la extensión del motor sin modificar el núcleo del sistema (Open/Closed Principle).

3. Orchestrator & Registry
Un componente centralizado gestiona el ciclo de vida de la limpieza, permitiendo una ejecución condicional basada en los parámetros de configuración (Checklist) definidos por el usuario.

🛠️ Especificaciones Técnicas de Limpieza
Deduplicación por Fingerprinting: Algoritmo que genera una clave única basada en atributos semánticos (ej. nombre + ciudad), superando la detección básica de filas idénticas.

Sanitización mediante Regex Avanzado: Validación de sintaxis de correo electrónico y normalización de cadenas de texto (Trim, Lowercase, Capitalize).

Integridad de Tipos y Rangos: Cast de tipos de datos en tiempo de ejecución para asegurar precisión decimal en valores monetarios y filtrado de outliers biológicos mediante lógica booleana estricta.

Manejo de Valores Nulos (Null Handling): Identificación y estandarización de diversos formatos de ausencia de datos (NaN, undefined, null, "") a un estado consistente.

📊 Casos de Uso en Big Data
ETL Pre-processing: Preparación de archivos para procesos de Bulk Insert en motores como PostgreSQL, MySQL o Oracle.

Data Wrangling: Reducción del ruido en datasets para entrenamiento de modelos de Machine Learning.

Marketing Intelligence: Depuración de bases de datos de clientes para mejorar la entregabilidad de campañas.

💻 Stack Tecnológico
Lenguaje: JavaScript (ES6+ Clean Code).

Arquitectura: Modular / Object-Oriented.

Procesamiento: Client-side (Privacidad de datos total, los datos no abandonan el navegador).

Interfaz: CSS Grid & Flexbox para un Dashboard reactivo.
