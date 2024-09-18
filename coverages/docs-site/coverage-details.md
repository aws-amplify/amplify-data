[<- Back to summary](summary.md)

# Covered Docs Snippets

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox secret set SQL_CONNECTION_STRING

~~~

| | |
| -- | -- |
| Hash | `c51525983af82763` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
mysql://user:password@hostname:port/db-name

~~~

| | |
| -- | -- |
| Hash | `28870705b76cb2ef` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
postgres://user:password@hostname:port/db-name

~~~

| | |
| -- | -- |
| Hash | `635b91f7a060cdf5` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
npx ampx generate schema-from-database --connection-uri-secret SQL_CONNECTION_STRING --out amplify/data/schema.sql.ts

~~~

| | |
| -- | -- |
| Hash | `7d93bdb952442e03` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Terminal`

~~~
npx ampx sandbox secret set CUSTOM_SSL_CERT < /path/to/custom/ssl/public-ca-cert.pem
npx ampx generate schema-from-database --connection-uri-secret SQL_CONNECTION_STRING --ssl-cert-secret CUSTOM_SSL_CERT --out amplify/data/schema.sql.ts

~~~

| | |
| -- | -- |
| Hash | `4945f33e55d33118` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/cli-commands.ts#3)

---

[<- Back to summary](summary.md)
