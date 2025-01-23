import { Model, ModelStatic } from "sequelize";

export const processSubQuery = <T extends Model>(
  response: any,
  subQuery: string,
  model: ModelStatic<T>
): any => {
  const statesFields = Object.keys(model.getAttributes());
  return response[subQuery].map((state: any) => {
    const stateObj: any = {};
    statesFields.forEach((field) => {
      stateObj[field] = state[field];
    });
    return stateObj;
  });
};

interface Fields {
  primary?: string[] | undefined;
  [key: string]: string[] | undefined;
}

// This function receives fields as string seperated by commas and returns an object with subqeury fields example: fields = 'name,states.name' => { "primary":["name"], states: ["name"] }
export const processFields = (
  fields: string,
  primary: string = "primary"
): Fields => {
  if (!fields) return { [primary]: undefined };
  const fieldsArr = fields.replace(/\s/g, "").split(",");
  const fieldsObj: Fields = {
    [primary]: [],
  };
  fieldsArr.forEach((field) => {
    const [key, value] = field.split(".");
    if (value) {
      if (fieldsObj[key]) {
        fieldsObj[key]?.push(value);
      } else {
        fieldsObj[key] = [value];
      }
    } else {
      fieldsObj[primary]?.push(key);
    }
  });
  return fieldsObj;
};
