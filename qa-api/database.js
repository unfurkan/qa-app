import { postgres } from "./deps.js";


const config = {
    username: Deno.env.get('POSTGRES_USER'),
    password: Deno.env.get('POSTGRES_PASSWORD'),
    database: Deno.env.get('POSTGRES_DB'),
    host: Deno.env.get('POSTGRES_HOST'),
    port: Deno.env.get('POSTGRES_PORT')
  };
  
const sql = postgres(config);

export { sql };