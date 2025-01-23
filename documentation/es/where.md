# **Guía de Uso de Parámetros de Búsqueda en la API**

Esta guía describe cómo enviar consultas avanzadas y básicas a la API utilizando parámetros de búsqueda (`search`) en las solicitudes HTTP. La API permite realizar filtros mediante operadores lógicos (`AND`, `OR`) y operadores de comparación como `LIKE`, `BETWEEN`, `IN`, etc.

---

## **Estructura de los parámetros de búsqueda**

La API permite dos formas de realizar consultas:

1. **Consultas básicas (forma simplificada):**

   - Se pueden enviar condiciones de búsqueda simples, las cuales se combinarán automáticamente con el operador `AND`.

2. **Consultas avanzadas (definiendo operadores manualmente):**
   - Se debe especificar la estructura completa utilizando operadores lógicos.

---

## **1. Consultas básicas (forma simplificada)**

Si se envían parámetros en formato simple, estos se combinarán automáticamente con el operador `AND`.

### **Ejemplo de consulta:**

```
GET /permissions?search[code][like]=%COUNTRIES%&search[name][like]=%countries%
```

### **SQL Generado:**

```sql
SELECT * FROM permissions
WHERE code LIKE '%COUNTRIES%'
  AND name LIKE '%countries%';
```

---

### **Ejemplo adicional:**

```
GET /users?search[status][eq]=active&search[role][ne]=admin
```

#### **SQL Generado:**

```sql
SELECT * FROM users WHERE status = 'active' AND role != 'admin';
```

---

## **2. Consultas avanzadas (definiendo operadores manualmente)**

Para consultas más complejas, puedes definir manualmente operadores lógicos `AND`, `OR` y agrupar múltiples condiciones.

### **Estructura general:**

```
search[logical_operator][index][or/and][index][column][[operator]]=value
```

### **Ejemplo de consulta avanzada:**

```
GET /permissions?search[and][0][or][0][code][[like]]=CREATE_%&
search[and][0][or][1][code][[like]]=DELETE_%&
search[and][1][status][[ne]]=inactive
```

### **SQL Generado:**

```sql
SELECT * FROM permissions
WHERE (code LIKE 'CREATE_%' OR code LIKE 'DELETE_%')
  AND status != 'inactive';
```

---

## **Operadores soportados**

| Operador  | Descripción                     | Ejemplo en URL                                        |
| --------- | ------------------------------- | ----------------------------------------------------- |
| `eq`      | Igual a (`=`)                   | `search[name][[eq]]=John`                             |
| `ne`      | Diferente de (`!=`)             | `search[status][[ne]]=inactive`                       |
| `gt`      | Mayor que (`>`)                 | `search[age][[gt]]=18`                                |
| `gte`     | Mayor o igual que (`>=`)        | `search[score][[gte]]=75`                             |
| `lt`      | Menor que (`<`)                 | `search[price][[lt]]=1000`                            |
| `lte`     | Menor o igual que (`<=`)        | `search[quantity][[lte]]=50`                          |
| `like`    | Coincidencia de patrón (`LIKE`) | `search[name][[like]]=%John%`                         |
| `notLike` | No coincidencia (`NOT LIKE`)    | `search[category][[notLike]]=electronics`             |
| `between` | Rango de valores (`BETWEEN`)    | `search[created_at][[between]]=2023-01-01,2025-12-31` |
| `in`      | Dentro de una lista (`IN`)      | `search[id][[in]]=1,2,3`                              |
| `notIn`   | Fuera de una lista (`NOT IN`)   | `search[type][[notIn]]=admin,guest`                   |

---

## **Errores comunes y soluciones**

| Error                        | Causa                                               | Solución                                                   |
| ---------------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `Invalid column: field_name` | Se usó una columna no existente en la base de datos | Verificar nombres de columna válidos                       |
| `Cannot read property 'map'` | La estructura de la consulta está mal formada       | Verificar que las condiciones estén anidadas correctamente |
| `Invalid date`               | Formato de fecha incorrecto                         | Usar el formato `YYYY-MM-DD` para fechas                   |

---

Espero que esta documentación ayude a los desarrolladores a utilizar los parámetros de búsqueda en la API de manera eficiente. ¡No dudes en consultar si necesitas más información o ejemplos específicos!
