import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { configure } from '@aws-amplify/data-schema/internals';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

bench('complex SQL', async () => {
  // From: https://github.com/aws-amplify/amplify-category-api/issues/2551#issuecomment-2140807302

  const generatedSqlSchema = configure({
    database: {
      identifier: 'some-identifier',
      engine: 'postgresql',
      // backend not in repo. shouldn't be relevant to the bench.
      connectionUri: '' as any,
    },
  }).schema({
    assignments: a
      .model({
        id: a.id().required(),
        contract_id: a.id().required(),
        start_date: a.date(),
        end_date: a.date(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        user_id: a.id().required(),
        owner: a.string(),
      })
      .identifier(['id']),
    billing_details: a
      .model({
        id: a.id().required(),
        contract_id: a.id().required(),
        billing_address: a.string(),
        payment_method: a.string(),
        card_number: a.string(),
        card_expiry_date: a.date(),
        card_cvc: a.string(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
      })
      .identifier(['id']),
    certifications: a
      .model({
        id: a.id().required(),
        certification_name: a.string().required(),
        issued_by: a.string(),
        issue_date: a.date().required(),
        expiry_date: a.date(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        user_id: a.id().required(),
      })
      .identifier(['id']),
    contracts: a
      .model({
        id: a.id().required(),
        start_date: a.date(),
        end_date: a.date(),
        client_type: a.string().required(),
        user_id: a.id().required(),
        organisation_id: a.id(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
      })
      .identifier(['id']),
    employments: a
      .model({
        id: a.id().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        user_id: a.id().required(),
      })
      .identifier(['id']),
    identity_verifications: a
      .model({
        id: a.id().required(),
        user_id: a.id().required(),
        status: a.string(),
        errormsg: a.string(),
        errorcode: a.integer(),
        owner: a.string(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        order_ref: a.string(),
        auto_start_token: a.string(),
        qr_start_token: a.string(),
      })
      .identifier(['id']),
    invoice_rows: a
      .model({
        id: a.id().required(),
        invoice_id: a.id().required(),
        description: a.string().required(),
        quantity: a.integer().required(),
        unit_price: a.float().required(),
        unit_type: a.string().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
      })
      .identifier(['id']),
    invoices: a
      .model({
        id: a.id().required(),
        contract_id: a.id(),
        issue_date: a.date().required(),
        due_date: a.date().required(),
        amount: a.float().required(),
        status: a.string().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        user_id: a.id().required(),
      })
      .identifier(['id']),
    organisation_users: a
      .model({
        id: a.id().required(),
        organisation_id: a.id().required(),
        user_id: a.id().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
      })
      .identifier(['id']),
    organisations: a
      .model({
        id: a.id().required(),
        organisation_name: a.string().required(),
        type: a.string().required(),
        contact_person_id: a.id().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
      })
      .identifier(['id']),
    payments: a
      .model({
        id: a.id().required(),
        invoice_id: a.id(),
        payment_date: a.date().required(),
        amount: a.float().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        user_id: a.id().required(),
      })
      .identifier(['id']),
    salaries: a
      .model({
        id: a.id().required(),
        payment_date: a.date().required(),
        amount: a.float().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        user_id: a.id().required(),
      })
      .identifier(['id']),
    salary_rows: a
      .model({
        id: a.id().required(),
        salary_id: a.id().required(),
        description: a.string(),
        quantity: a.integer().required(),
        unit_price: a.float().required(),
        unit_type: a.string().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
      })
      .identifier(['id']),
    shifts: a
      .model({
        id: a.id().required(),
        assignment_id: a.id().required(),
        start_time: a.datetime().required(),
        end_time: a.datetime().required(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        user_id: a.id().required(),
      })
      .identifier(['id']),
    time_reports: a
      .model({
        id: a.id().required(),
        shift_id: a.id().required(),
        start_time: a.datetime().required(),
        end_time: a.datetime().required(),
        note: a.string(),
        owners: a.string().array(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        user_id: a.id().required(),
      })
      .identifier(['id']),
    users: a
      .model({
        id: a.id().required(),
        username: a.string().required(),
        role: a.string().required(),
        first_name: a.string(),
        last_name: a.string(),
        email: a.string().required(),
        phone_number: a.string(),
        identity_verified: a.boolean(),
        created_at: a.datetime(),
        updated_at: a.datetime(),
        stripe_customer_id: a.string(),
      })
      .identifier(['id']),
  });

  const sqlSchema = generatedSqlSchema
    .renameModels(() => [
      ['assignments', 'Assignment'],
      ['billing_details', 'BillingDetail'],
      ['contracts', 'Contract'],
      ['employments', 'Employment'],
      ['identity_verifications', 'IdentityVerification'],
      ['invoices', 'Invoice'],
      ['invoice_rows', 'InvoiceRow'],
      ['organisation_users', 'OrganisationUser'],
      ['organisations', 'Organisation'],
      ['payments', 'Payment'],
      ['salaries', 'Salary'],
      ['salary_rows', 'SalaryRow'],
      ['shifts', 'Shift'],
      ['time_reports', 'TimeReport'],
      ['users', 'User'],
    ])
    .setRelationships((models) => [
      models.Assignment.relationships({
        contract: a.belongsTo('Contract', 'contract_id'),
        shifts: a.hasMany('Shift', 'assignment_id'),
        user: a.belongsTo('User', 'user_id'),
      }),
      models.Contract.relationships({
        assignments: a.hasMany('Assignment', 'contract_id'),
        user: a.belongsTo('User', 'user_id'),
        invoices: a.hasMany('Invoice', 'contract_id'),
      }),
      models.Employment.relationships({
        user: a.belongsTo('User', 'user_id'),
      }),
      models.IdentityVerification.relationships({
        user: a.belongsTo('User', 'user_id'),
      }),
      models.Invoice.relationships({
        contract: a.belongsTo('Contract', 'contract_id'),
      }),
      models.Organisation.relationships({
        contact_person: a.belongsTo('User', 'contact_person_id'),
        users: a.hasMany('OrganisationUser', 'organisation_id'),
      }),
      models.OrganisationUser.relationships({
        organisation: a.belongsTo('Organisation', 'organisation_id'),
        user: a.belongsTo('User', 'user_id'),
      }),
      models.TimeReport.relationships({
        shift: a.belongsTo('Shift', 'shift_id'),
      }),
      models.Shift.relationships({
        assignment: a.belongsTo('Assignment', 'assignment_id'),
        time_reports: a.hasMany('TimeReport', 'shift_id'),
        user: a.belongsTo('User', 'user_id'),
      }),
      models.User.relationships({
        assignments: a.hasMany('Assignment', 'user_id'),
        contracts: a.hasMany('Contract', 'user_id'),
        employents: a.hasMany('Employment', 'user_id'),
        identity_verifications: a.hasMany('IdentityVerification', 'user_id'),
        main_contact_organisations: a.hasMany(
          'Organisation',
          'contact_person_id',
        ),
        organisations: a.hasMany('OrganisationUser', 'user_id'),
        shifts: a.hasMany('Shift', 'user_id'),
      }),
    ])
    .setAuthorization((models) => [
      models.User.authorization((allow) => [
        allow.ownerDefinedIn('username'),
        allow.groups(['admin']),
        allow.authenticated().to(['read']),
      ]),
      models.Assignment.authorization((allow) => [
        allow.ownerDefinedIn('owner'),
        allow.groups(['admin']),
      ]),
      models.BillingDetail.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.Contract.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
        allow.custom(),
      ]),
      models.IdentityVerification.authorization((allow) => [
        allow.ownerDefinedIn('owner'),
        allow.authenticated().to(['listen']),
      ]),
      models.Invoice.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.InvoiceRow.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.OrganisationUser.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.Organisation.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.Payment.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.Salary.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.SalaryRow.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.Shift.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
      models.TimeReport.authorization((allow) => [
        allow.authenticated(),
        allow.groups(['admin']),
      ]),
    ]);

  type Schema = ClientSchema<typeof sqlSchema>;

  Amplify.configure({
    API: {
      GraphQL: {
        apiKey: 'apikey',
        defaultAuthMode: 'apiKey',
        endpoint: 'https://0.0.0.0/graphql',
        region: 'us-east-1',
      },
    },
  });

  const client = generateClient<Schema>();

  const { data: createdAssignment } = await client.models.Assignment.create({
    user_id: 'some-user-id',
    contract_id: 'some-id',
  });

  const { data: updatedAssignment } = await client.models.Assignment.update({
    ...createdAssignment!,
  });

  const { data: _deletedAssignment } = await client.models.Assignment.delete(
    updatedAssignment!,
  );

  const { data: _listedAssignments } = await client.models.Assignment.list();

  const { data: _lazyLoadedContract } = await createdAssignment!.contract();
}).types([7942623, 'instantiations']);
