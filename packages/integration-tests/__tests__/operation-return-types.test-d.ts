import { a, ClientSchema } from '@aws-amplify/data-schema';
import {
  Expect,
  Equal,
  Prettify,
  AuthMode,
  CustomHeaders,
  SingularReturnValue,
  ListReturnValue,
} from '@aws-amplify/data-schema-types';
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
    .authorization([a.allow.public()]);

  type Schema = ClientSchema<typeof schema>;
  const client = generateClient<Schema>();

  type ExpectedBasicTypesInDoctorReturnType = {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    name: string;
    officeId?: string | null | undefined;
    officeLocationId?: string | null | undefined;
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
    doctorId?: string | null | undefined;
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

        type ResolvedDoctorType = Prettify<(typeof listedDoctors)[number]>;

        type BasicTypeResult = Equal<
          Omit<ResolvedDoctorType, 'license' | 'office' | 'doctorPatients'>,
          ExpectedBasicTypesInDoctorReturnType
        >;

        type LicenseGetterResult = Equal<
          Pick<ResolvedDoctorType, 'license'> extends Pick<
            ExpectedGetterSuperTypesInDoctorReturnType,
            'license'
          >
            ? true
            : false,
          true
        >;

        type _ = Expect<Equal<BasicTypeResult | LicenseGetterResult, true>>;
      });

      test('License return type contains readonly doctor getter', async () => {
        const { data: listedLicense } = await client.models.License.list();

        type ResolvedLicenseType = Prettify<(typeof listedLicense)[number]>;

        type BasicTypeResult = Equal<
          Omit<ResolvedLicenseType, 'doctor'>,
          ExpectedBasicTypesInLicenseReturnType
        >;

        type DoctorGetterResult = Equal<
          Pick<ResolvedLicenseType, 'doctor'> extends Pick<
            ExpectedGetterSuperTypesInLicenseReturnType,
            'doctor'
          >
            ? true
            : false,
          true
        >;

        type _ = Expect<Equal<BasicTypeResult | DoctorGetterResult, true>>;
      });
    });

    describe('create input type', () => {
      test('Doctor has correct create input type', async () => {
        type ResolveCreateDoctorInput = Parameters<
          typeof client.models.Doctor.create
        >[0];

        type ExpectedCreateDoctorInput = {
          id?: string | undefined;
          name: string;
          officeId?: string | null | undefined;
          officeLocationId?: string | null | undefined;
        };

        type _ = Expect<
          Equal<ResolveCreateDoctorInput, ExpectedCreateDoctorInput>
        >;
      });

      test('License has correct create input type', async () => {
        type ResolveLicenseDoctorInput = Parameters<
          typeof client.models.License.create
        >[0];

        type ExpectedLicenseDoctorInput = {
          id?: string | undefined;
          doctorId?: string | null | undefined;
          serial: string;
        };

        type _ = Expect<
          Equal<ResolveLicenseDoctorInput, ExpectedLicenseDoctorInput>
        >;
      });
    });

    describe('update input type', () => {
      test('Doctor has correct update input type', async () => {
        type ResolveUpdateDoctorInput = Parameters<
          typeof client.models.Doctor.update
        >[0];

        type ExpectedUpdateDoctorInput = {
          id: string;
          name?: string;
          officeId?: string | null | undefined;
          officeLocationId?: string | null | undefined;
        };

        type _ = Expect<
          Equal<ResolveUpdateDoctorInput, ExpectedUpdateDoctorInput>
        >;
      });

      test('License has correct update input type', async () => {
        type ResolveUpdateLicenseInput = Parameters<
          typeof client.models.License.update
        >[0];

        type ExpectedUpdateLicenseInput = {
          id: string;
          doctorId?: string | null | undefined;
          serial?: string | undefined;
        };

        type _ = Expect<
          Equal<ResolveUpdateLicenseInput, ExpectedUpdateLicenseInput>
        >;
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
        type ResolveCreateOfficeInput = Parameters<
          typeof client.models.Office.create
        >[0];

        type ExpectedCreateOfficeInput = {
          name: string;
          id: string;
          locationId: string;
        };

        type _ = Expect<
          Equal<ResolveCreateOfficeInput, ExpectedCreateOfficeInput>
        >;
      });

      // Doctor create input type has been verified above
    });

    describe('update input type', () => {
      test('Office has correct create input type', async () => {
        type ResolveUpdateOfficeInput = Parameters<
          typeof client.models.Office.update
        >[0];

        type ExpectedUpdateOfficeInput = {
          id: string;
          locationId: string;
          name?: string | undefined;
        };

        type _ = Expect<
          Equal<ResolveUpdateOfficeInput, ExpectedUpdateOfficeInput>
        >;
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
        type ResolveCreateDoctorPatientInput = Parameters<
          typeof client.models.DoctorPatient.create
        >[0];

        type ExpectedCreateDoctorPatientInput = {
          id?: string | undefined;
          doctorPatientId?: string | null | undefined;
          patientId?: string | null | undefined;
        };

        type _ = Expect<
          Equal<
            ResolveCreateDoctorPatientInput,
            ExpectedCreateDoctorPatientInput
          >
        >;
      });
    });

    describe('update input type', () => {
      test('DoctorPatient has correct update input type', async () => {
        type ResolveUpdateDoctorPatientInput = Parameters<
          typeof client.models.DoctorPatient.update
        >[0];

        type ExpectedUpdateDoctorPatientInput = {
          id: string;
          doctorPatientId?: string | null | undefined;
          patientId?: string | null | undefined;
        };

        type _ = Expect<
          Equal<
            ResolveUpdateDoctorPatientInput,
            ExpectedUpdateDoctorPatientInput
          >
        >;
      });
    });
  });
});
