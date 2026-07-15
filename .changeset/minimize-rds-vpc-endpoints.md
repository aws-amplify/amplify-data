---
'@aws-amplify/data-schema-types': minor
---

Add optional `minimizeRdsVpcEndpoints` to the SQL data source configuration, allowing customers to opt into provisioning only the SSM VPC endpoint for the RDS-in-VPC SQL Lambda (reduces 5 endpoints to 1). Defaults to false (unchanged behavior); SQL data sources only.
