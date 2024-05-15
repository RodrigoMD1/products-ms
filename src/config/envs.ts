import 'doten/config';
import * as joi from 'joi';


interface EnvVars {
    PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required()
})
    .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`config validation error : ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
}
////////////////////////////////////
// lo que es lo de arriba se pude hacer un snipet y llamarlo cada vez que se tenga que usar ya que rara vez cambia esta config