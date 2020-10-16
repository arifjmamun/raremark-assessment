import { MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual } from "typeorm";
import { format } from "date-fns";

// TypeORM query operators polyfills
export enum EDateType {
  Date = "yyyy-MM-dd",
  Datetime = "yyyy-MM-dd HH:mm:ss"
};

export const MoreThanDate = (date: Date, type: EDateType) => MoreThan(format(date, type));
export const MoreThanOrEqualDate = (date: Date, type: EDateType) => MoreThanOrEqual(format(date, type));
export const LessThanDate = (date: Date, type: EDateType) => LessThan(format(date, type));
export const LessThanOrEqualDate = (date: Date, type: EDateType) => LessThanOrEqual(format(date, type));