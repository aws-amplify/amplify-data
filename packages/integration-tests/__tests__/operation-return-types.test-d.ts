import { a, ClientSchema } from '@aws-amplify/data-schema';
import {
  AuthMode,
  CustomHeaders,
  SingularReturnValue,
  ListReturnValue,
} from '@aws-amplify/data-schema/runtime';
import { Expect, Equal, Prettify } from '@aws-amplify/data-schema-types';
import { generateClient } from 'aws-amplify/api';

describe('operation return types', () => {
  const schema = a
    .schema({
      Doctor: a.model({
        name: a.string().required(),
        license: a.hasOne('License', 'doctorId'),
        officeId: a.id(),
        officeLocationId: a.id(),
        office: a.belongsTo('Office', ['officeId', 'officeLocationId']),
        doctorPatients: a.hasMany('DoctorPatient', 'doctorPatientId'),
      }),
      License: a.model({
        serial: a.string().required(),
        doctorId: a.id(),
        doctor: a.belongsTo('Doctor', 'doctorId'),
      }),
      Office: a
        .model({
          id: a.id().required(),
          locationId: a.string().required(),
          name: a.string().required(),
          doctors: a.hasMany('Doctor', ['officeId', 'officeLocationId']),
        })
        .identifier(['id', 'locationId']),
      Patient: a.model({
        name: a.string().required(),
        doctorPatients: a.hasMany('DoctorPatient', 'doctorPatientId'),
      }),
      DoctorPatient: a.model({
        doctorPatientId: a.id(),
        doctor: a.belongsTo('Doctor', 'doctorPatientId'),
        patientId: a.id(),
        patient: a.belongsTo('Patient', 'doctorPatientId'),
      }),
    })
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof schema>;
  const client = generateClient<Schema>();

  type ExpectedBasicTypesInDoctorReturnType = {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    name: string;
    officeId: string | null;
    officeLocationId: string | null;
  };

  type ExpectedGetterSuperTypesInDoctorReturnType = {
    license: (
      options?:
        | {
            authMode?: AuthMode | undefined;
            authToken?: string | undefined;
            headers?: CustomHeaders | undefined;
          }
        | undefined,
    ) => SingularReturnValue<any>;
    office: (
      options?:
        | {
            authMode?: AuthMode | undefined;
            authToken?: string | undefined;
            headers?: CustomHeaders | undefined;
          }
        | undefined,
    ) => SingularReturnValue<any>;
    doctorPatients: (
      options?:
        | {
            authMode?: AuthMode | undefined;
            authToken?: string | undefined;
            limit?: number | undefined;
            nextToken?: string | null | undefined;
            headers?: CustomHeaders | undefined;
          }
        | undefined,
    ) => ListReturnValue<any>;
  };

  type _ExpectedDoctorSuperReturnType = ExpectedBasicTypesInDoctorReturnType &
    ExpectedGetterSuperTypesInDoctorReturnType;

  type ExpectedBasicTypesInLicenseReturnType = {
    doctorId: string | null;
    serial: string;
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  };

  type ExpectedGetterSuperTypesInLicenseReturnType = {
    doctor: (
      options?:
        | {
            authMode?: AuthMode | undefined;
            authToken?: string | undefined;
            headers?: CustomHeaders | undefined;
          }
        | undefined,
    ) => SingularReturnValue<any>;
  };

  type ExpectedGetterSuperTypesInDoctorPatientReturnType =
    ExpectedGetterSuperTypesInLicenseReturnType;

  type _ExpectedLicenseReturnType = ExpectedBasicTypesInLicenseReturnType &
    ExpectedGetterSuperTypesInLicenseReturnType;

  describe('(License) belongsTo<=>hasOne (Doctor) relationships', () => {
    describe('list return type', () => {
      test('Doctor return type contains readonly license getter', async () => {
        const { data: listedDoctors } = await client.models.Doctor.list();

        type ActualGetter = (typeof listedDoctors)[number]['license'];
        type ExpectedGetter = (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => SingularReturnValue<Schema['License']['type']>;

        type test = Expect<Equal<ActualGetter, ExpectedGetter>>;
      });

      test('License return type contains readonly doctor getter', async () => {
        const { data: listedLicense } = await client.models.License.list();

        type ActualGetter = (typeof listedLicense)[number]['doctor'];
        type ExpectedGetter = (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => SingularReturnValue<Schema['Doctor']['type']>;

        type test = Expect<Equal<ActualGetter, ExpectedGetter>>;
      });
    });

    describe('create input type', () => {
      test('Doctor has correct create input type', async () => {
        type ExpectedCreateDoctorInput = {
          id?: string | undefined;
          name: string;
          officeId?: string | null | undefined;
          officeLocationId?: string | null | undefined;
        };
        type Expected = (input: ExpectedCreateDoctorInput, options: any) => any;

        type Actual = typeof client.models.Doctor.create;

        type ActualExtendsExpected = Actual extends Expected ? true : false;
        type _test = Expect<Equal<ActualExtendsExpected, true>>;
      });

      test('License has correct create input type', async () => {
        type ExpectedLicenseDoctorInput = {
          id?: string | undefined;
          doctorId?: string | null | undefined;
          serial: string;
        };
        type Expected = (
          input: ExpectedLicenseDoctorInput,
          options: any,
        ) => any;

        type Actual = typeof client.models.License.create;

        type ActualExtendsExpected = Actual extends Expected ? true : false;
        type _test = Expect<Equal<ActualExtendsExpected, true>>;
      });
    });

    describe('update input type', () => {
      test('Doctor has correct update input type', async () => {
        type ExpectedUpdateDoctorInput = {
          id: string;
          name?: string;
          officeId?: string | null | undefined;
          officeLocationId?: string | null | undefined;
        };
        type Expected = (input: ExpectedUpdateDoctorInput, options: any) => any;

        type Actual = typeof client.models.Doctor.update;

        type ActualExtendsExpected = Actual extends Expected ? true : false;
        type _test = Expect<Equal<ActualExtendsExpected, true>>;
      });

      test('License has correct update input type', async () => {
        type ExpectedUpdateLicenseInput = {
          id: string;
          doctorId?: string | null | undefined;
          serial?: string | undefined;
        };
        type Expected = (
          input: ExpectedUpdateLicenseInput,
          options: any,
        ) => any;

        type Actual = typeof client.models.License.update;

        type ActualExtendsExpected = Actual extends Expected ? true : false;
        type _test = Expect<Equal<ActualExtendsExpected, true>>;
      });
    });
  });

  describe('(Office) hasMany<=>belongsTo (Doctor) relationships', () => {
    describe('list return type', () => {
      it('generates correct return types (containing readonly doctors getter) for model Office', async () => {
        const { data: listedOffices } = await client.models.Office.list();

        type ResolvedOfficeType = Prettify<(typeof listedOffices)[number]>;

        type ExpectedOfficeTypeSuper = {
          id: string;
          locationId: string;
          name: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          doctors: (
            options?:
              | {
                  authMode?: AuthMode | undefined;
                  authToken?: string | undefined;
                  limit?: number | undefined;
                  nextToken?: string | null | undefined;
                  headers?: CustomHeaders | undefined;
                }
              | undefined,
          ) => ListReturnValue<any>;
        };

        type Result = ResolvedOfficeType extends ExpectedOfficeTypeSuper
          ? true
          : false;

        type _ = Expect<Equal<Result, true>>;
      });

      it('generates correct return types (containing readonly office getter) for model Doctor', async () => {
        const { data: listedDoctors } = await client.models.Doctor.list();

        type ResolvedDoctorType = Prettify<(typeof listedDoctors)[number]>;

        type ExpectedDoctorTypeSuper = {
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          name: string;
          officeId?: string | null | undefined;
          officeLocationId?: string | null | undefined;
          office: (
            options?:
              | {
                  authMode?: AuthMode | undefined;
                  authToken?: string | undefined;
                  headers?: CustomHeaders | undefined;
                }
              | undefined,
          ) => SingularReturnValue<any>;
        };

        type Result = ResolvedDoctorType extends ExpectedDoctorTypeSuper
          ? true
          : false;

        type _ = Expect<Equal<Result, true>>;
      });
    });

    describe('create input type', () => {
      test('Office has correct create input type', async () => {
        type ExpectedCreateOfficeInput = {
          name: string;
          id: string;
          locationId: string;
        };
        type Expected = (input: ExpectedCreateOfficeInput, options: any) => any;

        type Actual = typeof client.models.Office.create;

        type ActualExtendsExpected = Actual extends Expected ? true : false;
        type _test = Expect<Equal<ActualExtendsExpected, true>>;
      });

      // Doctor create input type has been verified above
    });

    describe('update input type', () => {
      test('Office has correct create input type', async () => {
        type ExpectedUpdateOfficeInput = {
          id: string;
          locationId: string;
          name?: string | undefined;
        };
        type Expected = (input: ExpectedUpdateOfficeInput, options: any) => any;

        type Actual = typeof client.models.Office.update;

        type ActualExtendsExpected = Actual extends Expected ? true : false;
        type _test = Expect<Equal<ActualExtendsExpected, true>>;
      });

      // Doctor update input type has been verified above
    });
  });

  describe('Manual (Doctor) many<-(DoctorPatient)->many (Patient) relationships', () => {
    describe('list return type', () => {
      test('Doctor return type contains readonly doctorPatients getter', async () => {
        const { data: listedDoctors } = await client.models.Doctor.list();

        type ResolvedDoctorType = Prettify<(typeof listedDoctors)[number]>;

        type DoctorPatientsResult = Equal<
          Pick<ResolvedDoctorType, 'doctorPatients'> extends Pick<
            ExpectedGetterSuperTypesInDoctorReturnType,
            'doctorPatients'
          >
            ? true
            : false,
          true
        >;

        type _ = Expect<Equal<DoctorPatientsResult, true>>;
      });

      test('Patient return type contains readonly doctorPatients getter', async () => {
        const { data: listedPatients } = await client.models.Patient.list();

        type ResolvedPatientType = Prettify<(typeof listedPatients)[number]>;

        type ExpectedPatientTypeSuper = {
          name: string;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          doctorPatients: (
            options?:
              | {
                  authMode?: AuthMode | undefined;
                  authToken?: string | undefined;
                  limit?: number | undefined;
                  nextToken?: string | null | undefined;
                  headers?: CustomHeaders | undefined;
                }
              | undefined,
          ) => ListReturnValue<any>;
        };

        type Result = ResolvedPatientType extends ExpectedPatientTypeSuper
          ? true
          : false;

        type _ = Expect<Equal<Result, true>>;
      });

      test('DoctorPatient return type contains readonly Doctor and Patient getters', async () => {
        const { data: listedDoctorPatients } =
          await client.models.DoctorPatient.list();

        type ResolvedDoctorPatientType = Prettify<
          (typeof listedDoctorPatients)[number]
        >;

        type ExpectedDoctorPatientTypeSuper = {
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          doctorPatientId?: string | null | undefined;
          patientId?: string | null | undefined;
          patient: (
            options?:
              | {
                  authMode?: AuthMode | undefined;
                  authToken?: string | undefined;
                  headers?: CustomHeaders | undefined;
                }
              | undefined,
          ) => SingularReturnValue<any>;
        } & ExpectedGetterSuperTypesInDoctorPatientReturnType;

        type DoctorGetterResult = Equal<
          ResolvedDoctorPatientType extends ExpectedDoctorPatientTypeSuper
            ? true
            : false,
          true
        >;

        type _ = Expect<Equal<DoctorGetterResult, true>>;
      });
    });

    describe('create input type', () => {
      test('DoctorPatient has correct create input type', async () => {
        type ExpectedCreateDoctorPatientInput = {
          id?: string | undefined;
          doctorPatientId?: string | null | undefined;
          patientId?: string | null | undefined;
        };
        type Expected = (
          input: ExpectedCreateDoctorPatientInput,
          options: any,
        ) => any;

        type Actual = typeof client.models.DoctorPatient.create;

        type ActualExtendsExpected = Actual extends Expected ? true : false;
        type _test = Expect<Equal<ActualExtendsExpected, true>>;
      });
    });

    describe('update input type', () => {
      test('DoctorPatient has correct update input type', async () => {
        type ExpectedUpdateDoctorPatientInput = {
          id: string;
          doctorPatientId?: string | null | undefined;
          patientId?: string | null | undefined;
        };
        type Expected = (
          input: ExpectedUpdateDoctorPatientInput,
          options: any,
        ) => any;

        type Actual = typeof client.models.DoctorPatient.update;

        type ActualExtendsExpected = Actual extends Expected ? true : false;
        type _test = Expect<Equal<ActualExtendsExpected, true>>;
      });
    });
  });
});
