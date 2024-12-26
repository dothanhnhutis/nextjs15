export type Policy = {
  id: string;
  description: string;
  action: string;
  resource: string;
  condition:
    | null
    | BaseCondition
    | { and: BaseCondition[] }
    | { or: BaseCondition[] }
    | { not: BaseCondition };
  createdAt: string;
  updatedAt: string;
};

type BaseCondition = {
  attribute: string;
  operator:
    | "equals"
    | "not_equal"
    | "greater_than"
    | "greater_than_or_equal"
    | "less_than"
    | "less_than_or_equal"
    | "in"
    | "not_in"
    | "contains";
  value: string | number | boolean;
};
