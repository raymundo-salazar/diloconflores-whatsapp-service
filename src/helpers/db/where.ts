import { Op, Sequelize, Model, ModelStatic } from "sequelize";

// Función para procesar los parámetros de búsqueda
export const processSearchParams = <T extends Model>(
  search: any,
  model: ModelStatic<T>
): Record<string | symbol, any> => {
  if (!search) return {};

  // Obtener las columnas válidas del modelo automáticamente con getAttributes()
  const validColumns = Object.keys(model.getAttributes());

  // Definir el objeto where utilizando claves de tipo `symbol` y `string`
  const where: Record<string | symbol, any> = {};

  const and: any = [];
  const or: any = [];

  Object.entries(search).forEach(([key, val]) => {
    if (key === "or") {
      or.push(val);
    } else if (key === "and") {
      and.push(val);
    } else {
      and.push({ [key]: val });
    }
  });

  search = {};
  if (or.length > 0) search.or = or;
  if (and.length > 0) search.and = and;

  Object.keys(search).forEach((logicalOperator) => {
    if (logicalOperator === "and" || logicalOperator === "or") {
      where[Op[logicalOperator as keyof typeof Op]] = search[
        logicalOperator
      ].map((conditionArray: any) =>
        processConditions(conditionArray, validColumns)
      );
    }
  });

  return where;
};

// Procesar condiciones internas
const processConditions = (conditions: any[], validColumns: string[]): any => {
  if (!Array.isArray(conditions)) {
    conditions = [conditions];
  }

  return conditions.map((condition: Record<string, any>) => {
    const logicalOperator = Object.keys(condition)[0]; // "or" o "and"

    if (logicalOperator === "or" || logicalOperator === "and") {
      return {
        [Op[logicalOperator as keyof typeof Op]]: processConditions(
          condition[logicalOperator],
          validColumns
        ),
      };
    } else {
      return parseCondition(condition, validColumns);
    }
  });
};

const parseCondition = (
  condition: Record<string, any>,
  validColumns: string[]
): any => {
  const key = Object.keys(condition)[0]; // Ejemplo: "updated_at"
  const value = condition[key];

  // Remover corchetes de los operadores (por ejemplo "[ne]" a "ne")
  const subKeyWithBrackets = Object.keys(value)[0]; // Ejemplo: "[ne]"
  const subKey = subKeyWithBrackets.replace(/\[|\]/g, ""); // Eliminar corchetes

  let subValue = value[subKeyWithBrackets]; // Ejemplo: "created_at"

  // Verificamos si la clave es una columna válida del modelo
  if (!validColumns.includes(key)) {
    throw new Error(`Invalid column: ${key}`);
  }

  // Convertir valores especiales
  if (subValue === "") subValue = ""; // Mantener cadena vacía
  if (subValue === "null") subValue = null; // Convertir "null" string a valor null

  // Si el valor es el nombre de otra columna, usar Sequelize.col()
  if (validColumns.includes(subValue)) {
    subValue = Sequelize.col(subValue);
  }

  if (
    [
      "between",
      "notBetween",
      "in",
      "notIn",
      "any",
      "contains",
      "overlap",
      "contained",
    ].includes(subKey)
  )
    subValue = subValue.split(",");

  return { [key]: { [getSequelizeOperator(subKey)]: subValue } };
};

// Mapeo de operadores del query params a Sequelize
const getSequelizeOperator = (op: string): symbol => {
  const operators: Record<string, symbol> = {
    eq: Op.eq, // =
    ne: Op.ne, // !=
    is: Op.is, // IS (NULL, TRUE, etc.)
    not: Op.not, // NOT
    like: Op.like, // LIKE
    notLike: Op.notLike, // NOT LIKE
    iLike: Op.iLike, // ILIKE (PostgreSQL case-insensitive LIKE)
    notILike: Op.notILike, // NOT ILIKE (PostgreSQL case-insensitive)
    regexp: Op.regexp, // REGEXP (MySQL, MariaDB)
    notRegexp: Op.notRegexp, // NOT REGEXP (MySQL, MariaDB)
    iRegexp: Op.iRegexp, // IREGEXP (PostgreSQL, case-insensitive)
    notIRegexp: Op.notIRegexp, // NOT IREGEXP
    between: Op.between, // BETWEEN
    notBetween: Op.notBetween, // NOT BETWEEN
    in: Op.in, // IN
    notIn: Op.notIn, // NOT IN
    gt: Op.gt, // >
    gte: Op.gte, // >=
    lt: Op.lt, // <
    lte: Op.lte, // <=
    and: Op.and, // AND (combinar condiciones)
    or: Op.or, // OR (combinar condiciones)
    any: Op.any, // ANY (PostgreSQL)
    all: Op.all, // ALL (PostgreSQL)
    contains: Op.contains, // ARRAY CONTAINS (PostgreSQL)
    overlap: Op.overlap, // ARRAY OVERLAP (PostgreSQL)
    contained: Op.contained, // ARRAY CONTAINED (PostgreSQL)
    startsWith: Op.startsWith, // LIKE 'value%'
    endsWith: Op.endsWith, // LIKE '%value'
    substring: Op.substring, // LIKE '%value%'
    col: Op.col, // Referencia a otra columna
  };

  return operators[op] || Op.eq;
};
