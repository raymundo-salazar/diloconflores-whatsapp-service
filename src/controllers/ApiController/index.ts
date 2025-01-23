import { Request, Response, NextFunction } from "express";
import { successResponse } from "@helpers/response";
import { CreationError, MissingParametersError, NotFoundError } from "@helpers/errors";
import { Association, Model, ModelStatic, Op, UUIDV4, WhereOptions } from "sequelize";
import { processFields, processSubQuery } from "@helpers/db/processSubQuery";
import { calculateOffset, processInfo } from "@helpers/info";
import { processSearchParams } from "@helpers/db/where";
import { AttributesRelation, IncludeOptions } from "./types";
import Joi from "joi";
import path from "path";
import { plural, singular } from "pluralize";
import { get } from "http";

export class ApiController<T extends Model> {
  protected methodsAllowed: string[] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
  protected model!: ModelStatic<T>;
  protected entity!: string;
  protected association!: string;
  protected associations?: IncludeOptions[];
  protected attributes!: AttributesRelation;
  protected uniqueAttributes!: AttributesRelation;
  protected schema!: Joi.ObjectSchema;
  protected createSchema!: Joi.ObjectSchema;
  protected updateSchema!: Joi.ObjectSchema;
  protected createAssociationSchema!: Record<string, Joi.ObjectSchema>;
  protected deleteAssociationSchema!: Record<string, Joi.ObjectSchema>;

  public get logicalDelete() {
    return this.model.options.paranoid;
  }

  public getInclude = (query: Record<string, any>, attributes: Record<string, any>) => {
    const associations: IncludeOptions[] = Object.keys(query)
      .map((key) => {
        let associate = Object.entries(this.model.associations)?.find(
          ([_, association]) => association.as === key
        ) as IncludeOptions;
        return associate;
      })
      .filter(Boolean)
      .map((obj: any) => {
        const associate = obj[1] as Association;
        return {
          model: associate.target,
          as: associate.as,
          attributes: attributes[associate.as],
          foreignKey: associate.foreignKey,
          associationType: associate.associationType,
        };
      });
    const include = associations.length > 0 ? associations : undefined;
    return include;
  };

  public options = async (req: Request, res: Response) => {
    res.setHeader("Allow", this.methodsAllowed);
    successResponse(res, null, `Available methods: ${this.methodsAllowed}`);
  };

  protected setCreationError = (error: any) => {
    if (error.parent.code === "ER_DUP_ENTRY") {
      const sql = error.parent?.sql;
      const type = error.errors[0].type.replace(/\s/g, "_").toUpperCase();
      const errors = error.errors.map((err: any) => ({
        type: err.type,
        message: err.message,
        field: err.path,
        value: err.value,
      }));
      error = new CreationError(`${this.entity} already exists.`);
      error.sql = sql;
      error.errors = errors;
      error.database_code = type;
    }
    return error;
  };

  public getAll = async (
    req: Request<Record<string, string>, {}, {}, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        limit: _limit,
        page: _page,
        offset: _offset,
        fields,
        search: _search,
        ...query
      } = req.query;
      const { limit, page, offset } = calculateOffset(_limit, _page, _offset);
      const attributes = processFields(fields, this.entity);
      const where = processSearchParams(_search, this.model);

      const include = this.getInclude(query, attributes);

      const totalRecords = await this.model.count({ where });
      const records = await this.model.findAll({
        attributes: attributes[this.entity],
        include,
        limit,
        offset,
        where,
      });

      const info = processInfo(page, records.length, totalRecords, limit, offset);

      successResponse(res, records, `${this.entity} retrieved successfully`, 200, info);
    } catch (error: any) {
      if (error.resource) error.resource = this.entity;
      next(error);
    }
  };

  public getById = async (
    req: Request<Record<string, string>, {}, {}, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { fields, ...query } = req.query;
      const attributes = processFields(fields, this.entity);

      const include = this.getInclude(query, attributes);

      const record = await this.model.findByPk(id, {
        attributes: attributes[this.entity],
        include,
      });

      if (!record) throw new NotFoundError(`${this.entity} with ID "${id}"`, this.entity);

      successResponse(res, record, `${singular(this.entity)} "${id}" retrieved successfully`, 200);
    } catch (error: any) {
      if (error.resource) error.resource = this.entity;
      next(error);
    }
  };
  public setSchemaValidation = (schema: Joi.ObjectSchema) => {
    this.schema = schema;
    return this;
  };

  public setUniqueAttributes = (attributes: string[]) => {
    this.uniqueAttributes = attributes;
    return this;
  };

  public createRecord = async (
    req: Request<Record<string, string>, {}, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { body } = req;

      if (this.createSchema) {
        const { error } = this.createSchema.validate(body);
        if (error) throw new MissingParametersError(error.message);
      }

      const record = await this.model.create({
        ...body,
      });
      successResponse(res, record, `${this.entity} created successfully`, 201);
    } catch (error: any) {
      console.log(error);
      if (error.parent?.code === "ER_DUP_ENTRY") error = this.setCreationError(error);

      if (error.resource) error.resource = this.entity;
      next(error);
    }
  };

  public updateRecord = async (
    req: Request<Record<string, string>, {}, any, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { body } = req;

      if (this.updateSchema) {
        const { error } = this.updateSchema.validate(body);
        if (error) throw new MissingParametersError(error.message);
      }

      const record = await this.model.findByPk(id);
      if (!record) throw new NotFoundError(`${this.entity} with ID "${id}"`, this.entity);

      await record.update(body);
      successResponse(res, record, `${this.entity} updated successfully`, 200);
    } catch (error: any) {
      if (error.parent?.code === "ER_DUP_ENTRY") error = this.setCreationError(error);

      if (error.resource) error.resource = this.entity;
      next(error);
    }
  };

  public deleteRecord = async (
    req: Request<Record<string, string>, {}, {}, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const record = await this.model.findByPk(id);
      if (!record) throw new NotFoundError(`${this.entity} with ID "${id}"`, this.entity);

      if (this.logicalDelete) {
        await record.destroy();
      } else {
        await record.destroy({ force: true });
      }

      successResponse(res, null, `${this.entity} deleted successfully`, 200);
    } catch (error: any) {
      if (error.resource) error.resource = this.entity;
      next(error);
    }
  };

  public getModelAssociations = (): Record<string, IncludeOptions> => {
    if (!this.model.associations) {
      return {};
    }

    const associations: Record<string, IncludeOptions> = {};
    Object.keys(this.model.associations).forEach((key) => {
      const association = this.model.associations[key];
      associations[association.as] = {
        model: association.target,
        as: association.as,
        foreignKey: association.foreignKey,
        associationType: association.associationType,
        through: (association as any)?.options?.through?.model,
      };
    });

    return associations;
  };

  public getAssociation = async (
    req: Request<Record<string, string>, {}, {}, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, associationName } = req.params;
      this.association = associationName;

      const { limit: _limit, page: _page, offset: _offset, fields, search } = req.query;

      const attributes = processFields(fields, this.association);
      const { limit, page, offset } = calculateOffset(_limit, _page, _offset);
      const where = processSearchParams(search, this.model);

      const associations = this.getModelAssociations();
      const association = associations[associationName];

      if (!association) {
        throw new NotFoundError(`Association ${associationName} in module`);
      }

      const getAssociation = `get${this.association
        .replace(/^\w/g, (char) => char.toUpperCase())
        .replace(/\s/g, "")}`;
      const countAssociation = `count${this.association
        .replace(/^\w/g, (char) => char.toUpperCase())
        .replace(/\s/g, "")}`;

      const parentEntity: any = await this.model.findByPk(id);

      if (!parentEntity) {
        return res.status(404).json({
          message: `${this.entity} with ID ${id} not found.`,
        });
      }

      const count = await parentEntity[countAssociation]?.();
      const response = await parentEntity[getAssociation]?.({
        where,
        attributes: attributes[this.association],
        limit,
        offset,
      });

      const info = Array.isArray(response)
        ? processInfo(page, response.length, count, limit, offset)
        : undefined;

      successResponse(res, response, "Associated records retrieved successfully", 200, info);
    } catch (error) {
      next(error);
    }
  };

  public setAssociation = async (
    req: Request<Record<string, string>, {}, {}, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, associationName } = req.params;
      const { body } = req;
      this.association = associationName;

      const { limit: _limit, page: _page, offset: _offset, fields } = req.query;
      const attributes = processFields(fields, this.association);
      const { limit, page, offset } = calculateOffset(_limit, _page, _offset);

      const associations = this.getModelAssociations();
      const association = associations[associationName];

      if (!association) {
        throw new NotFoundError(`Association ${associationName} in module`);
      }

      const parentEntity: any = await this.model.findByPk(id);
      if (!parentEntity) throw new NotFoundError(`${this.entity} with ID ${id}`);

      if (this.createAssociationSchema[associationName]) {
        const { error } = this.createAssociationSchema[associationName].validate(body);
        if (error) throw new MissingParametersError(error.message);
      }

      const pluralAssociation = plural(associationName);
      const singularAssociation = singular(associationName);
      const belongsTo = association.associationType === "BelongsTo";
      const associationNameFn = belongsTo ? singularAssociation : pluralAssociation;
      const addPrefix = belongsTo ? "set" : "add";

      const addAssociation = `${addPrefix}${associationNameFn
        .replace(/^\w/g, (char) => char.toUpperCase())
        .replace(/\s/g, "")}`;
      const getAssociation = `get${associationNameFn
        .replace(/^\w/g, (char) => char.toUpperCase())
        .replace(/\s/g, "")}`;
      const countAssociation = `count${associationNameFn
        .replace(/^\w/g, (char) => char.toUpperCase())
        .replace(/\s/g, "")}`;

      const count = await parentEntity[countAssociation]?.();
      await parentEntity[addAssociation]?.(
        Array.isArray((body as any)[associationName])
          ? (body as any)[associationName].map((item: any) => item.id)
          : (body as any)[associationName].id
      );

      const response = await parentEntity[getAssociation]?.({
        where: {
          id: {
            [Op.in]: Array.isArray((body as any)[associationName])
              ? (body as any)[associationName].map((item: any) => item.id)
              : (body as any)[associationName].id,
          },
        },
        attributes: attributes[this.association],
        limit,
        offset,
      });

      const info = Array.isArray(response)
        ? processInfo(page, response.length, count, limit, offset)
        : undefined;

      successResponse(res, response, "Associated records added successfully", 200, info);
    } catch (error) {
      next(error);
    }
  };

  public deleteAssociation = async (
    req: Request<Record<string, string>, {}, {}, any>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, associationName } = req.params;
      const { body } = req;
      this.association = associationName;

      const associations = this.getModelAssociations();
      const association = associations[associationName];

      if (!association) {
        throw new NotFoundError(`Association ${associationName} in module`);
      }

      const parentEntity: any = await this.model.findByPk(id);
      if (!parentEntity) throw new NotFoundError(`${this.entity} with ID ${id}`);

      if (this.deleteAssociationSchema[associationName]) {
        const { error } = this.deleteAssociationSchema[associationName].validate(body);
        console.log("error", error, associationName);
        if (error) throw new MissingParametersError(error.message);
      }

      if (association.associationType === "BelongsTo") {
        const addAssociation = `set${associationName
          .replace(/^\w/g, (char) => char.toUpperCase())
          .replace(/\s/g, "")}`;

        await parentEntity[addAssociation]?.(null);
        successResponse(res, null, `Associated records removed successfully`, 200);
      } else {
        const removeAssociation = `remove${associationName
          .replace(/^\w/g, (char) => char.toUpperCase())
          .replace(/\s/g, "")}`;

        await parentEntity[removeAssociation]?.(
          (body as any)[associationName].map((item: any) => item.id)
        );

        successResponse(res, null, `Associated records removed successfully`, 200);
      }
    } catch (error) {
      next(error);
    }
  };
}
