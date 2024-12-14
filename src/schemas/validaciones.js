import z from 'zod';
const ISO_DATETIME_REGEX = /\d{4}-[01]\d-[0-3]\d/;

const actividadSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'Actividad tiene que ser un string',
        required_error: 'Actividad es requerido'
    }),
    descripcion: z.string({
        invalid_type_error: 'Descripcion tiene que ser un string',
        required_error: 'descripcion es requerido'
    })
});

const anunciosSchema = z.object({
    duracion: z.coerce.number().int().positive(),
    actividad_ofrecida_id: z.coerce.number().int().positive(),
    salario_propuesto: z.coerce.number().positive(),
    fecha_hora: z.string().regex(ISO_DATETIME_REGEX, 'date must be a valid ISO date'),
    //fecha_hora: z.coerce.string().datetime({ offset: true }),
});

const claseSchema = z.object({
/*     duracion: z.coerce.number().int().positive(),
    fecha_hora: z.string().regex(ISO_DATETIME_REGEX, 'date must be a valid ISO date'), */
});

const usuariosSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'Actividad tiene que ser un string',
        required_error: 'Actividad es requerido'
    }),
    apellidos: z.string({
        invalid_type_error: 'Actividad tiene que ser un string',
        required_error: 'Actividad es requerido'
    }),
    email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email.")    //.refine((e) => e === "abcd@fg.com", "This email is not in our database")
    ,
    fecha_nacimiento: z.string().regex(ISO_DATETIME_REGEX, 'date must be a valid ISO date'),
});

const asistenciaSchema = z.object({
   
});

const calendarioSchema = z.object({
   
});


export function validateActividad(object) {
    return actividadSchema.safeParse(object);
}

export function validateAnuncio(object) {
    return anunciosSchema.safeParse(object);
}

export function validateAsistencia(object) {
    return asistenciaSchema.safeParse(object);
}

export function validateUsuario(object) {
    return usuariosSchema.safeParse(object);
}

export function validateClase(object) {
    return claseSchema.safeParse(object);
}

export function validateCalendario(object) {
    return calendarioSchema.safeParse(object);
}


export function validatePartialActividad(object) {
    return actividadSchema.partial().safeParse(object);
}

export function validatePartialAnuncio(object) {
    return anunciosSchema.partial().safeParse(object);
}

export function validatePartialAsistencia(object) {
    return asistenciaSchema.partial().safeParse(object);
}

export function validatePartialUsuario(object) {
    return usuariosSchema.partial().safeParse(object);
}

export function validatePartialClase(object) {
    return claseSchema.partial().safeParse(object);
}

export function validatePartialCalendario(object) {
    return calendarioSchema.partial().safeParse(object);
}

