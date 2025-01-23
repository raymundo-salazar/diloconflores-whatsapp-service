# **API Search Parameters Usage Guide**

This guide describes how to send advanced and basic queries to the API using search parameters (`search`) in HTTP requests. The API allows filtering using logical operators (`AND`, `OR`) and comparison operators such as `LIKE`, `BETWEEN`, `IN`, etc.

---

## **Structure of Search Parameters**

The API allows two ways to perform queries:

1. **Basic Queries (Simplified Form):**

   - Simple search conditions can be sent, and they will automatically be combined using the `AND` operator.

2. **Advanced Queries (Manually Defining Operators):**
   - The complete structure must be specified using logical operators.

---

## **1. Basic Queries (Simplified Form)**

If parameters are sent in a simple format, they will automatically be combined using the `AND` operator.

### **Example Query:**

```
GET /permissions?search[code][like]=%COUNTRIES%&search[name][like]=%countries%
```

### **Generated SQL:**

```sql
SELECT * FROM permissions
WHERE code LIKE '%COUNTRIES%'
  AND name LIKE '%countries%';
```

---

### **Additional Example:**

```
GET /users?search[status][eq]=active&search[role][ne]=admin
```

#### **Generated SQL:**

```sql
SELECT * FROM users WHERE status = 'active' AND role != 'admin';
```

---

## **2. Advanced Queries (Manually Defining Operators)**

For more complex queries, you can manually define logical operators `AND`, `OR`, and group multiple conditions.

### **General Structure:**

```
search[logical_operator][index][or/and][index][column][[operator]]=value
```

### **Example of an Advanced Query:**

```
GET /permissions?search[and][0][or][0][code][[like]]=CREATE_%&
search[and][0][or][1][code][[like]]=DELETE_%&
search[and][1][status][[ne]]=inactive
```

### **Generated SQL:**

```sql
SELECT * FROM permissions
WHERE (code LIKE 'CREATE_%' OR code LIKE 'DELETE_%')
  AND status != 'inactive';
```

---

## **Supported Operators**

| Operator  | Description                     | Example in URL                                        |
| --------- | ------------------------------- | ----------------------------------------------------- |
| `eq`      | Equal to (`=`)                  | `search[name][[eq]]=John`                             |
| `ne`      | Not equal to (`!=`)             | `search[status][[ne]]=inactive`                       |
| `gt`      | Greater than (`>`)              | `search[age][[gt]]=18`                                |
| `gte`     | Greater than or equal to (`>=`) | `search[score][[gte]]=75`                             |
| `lt`      | Less than (`<`)                 | `search[price][[lt]]=1000`                            |
| `lte`     | Less than or equal to (`<=`)    | `search[quantity][[lte]]=50`                          |
| `like`    | Pattern matching (`LIKE`)       | `search[name][[like]]=%John%`                         |
| `notLike` | Not matching (`NOT LIKE`)       | `search[category][[notLike]]=electronics`             |
| `between` | Value range (`BETWEEN`)         | `search[created_at][[between]]=2023-01-01,2025-12-31` |
| `in`      | Within a list (`IN`)            | `search[id][[in]]=1,2,3`                              |
| `notIn`   | Not within a list (`NOT IN`)    | `search[type][[notIn]]=admin,guest`                   |

---

## **Common Errors and Solutions**

| Error                        | Cause                                          | Solution                               |
| ---------------------------- | ---------------------------------------------- | -------------------------------------- |
| `Invalid column: field_name` | A non-existent column was used in the database | Verify valid column names              |
| `Cannot read property 'map'` | The query structure is malformed               | Ensure conditions are correctly nested |
| `Invalid date`               | Incorrect date format                          | Use `YYYY-MM-DD` format for dates      |

---

I hope this documentation helps developers use search parameters in the API efficiently. Feel free to ask if you need more information or specific examples!
