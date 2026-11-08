import { fileURLToPath } from "node:url";
import { publicationSQL } from "./content-publication.mjs";

// Emit reviewed SQL to stdout for an operator-controlled psql connection.
process.stdout.write(publicationSQL(fileURLToPath(new URL("../", import.meta.url))));
