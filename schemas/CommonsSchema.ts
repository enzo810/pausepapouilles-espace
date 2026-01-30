import { z } from "zod";

export const IdSchema = z.string();
export const IdsSchema = z.array(IdSchema);
