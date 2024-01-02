
# current directory
directory=$(dirname "$0")

bun run $directory/generateKyselyEnvFile.ts

bunx kysely-codegen --env-file kysely.env --out-file packages/backend/src/adapter/ampt/sql/dbTypes.d.ts --dialect postgres
