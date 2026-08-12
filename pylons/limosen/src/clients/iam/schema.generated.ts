/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { SchemaUnionsKey, type ScalarsEnumsHash } from 'pgqty';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Custom scalar that handles both integers and floats */
  Number: { input: number; output: number };
  Any: { input: any; output: any };
  /** Represents NULL values */
  Void: { input: any; output: any };
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any };
  File: { input: any; output: any };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
}

export interface ArgsInput {
  id: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_1 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Number']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_2 {
  roleKey: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Number']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_3 {
  projectId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Number']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_4 {
  loginName: Scalars['String']['input'];
}

export interface ArgsInput_5 {
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_6 {
  values: ValuesInput;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  createProfile?: InputMaybe<Scalars['Boolean']['input']>;
  skipEmailVerification?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface ValuesInput {
  emailAddress: Scalars['String']['input'];
  username: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  hashedPassword?: InputMaybe<Scalars['String']['input']>;
  details?: InputMaybe<DetailsInput>;
}

export interface DetailsInput {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_7 {
  userId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_8 {
  userId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_9 {
  userId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_10 {
  userId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_11 {
  userId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_12 {
  userId: Scalars['String']['input'];
  changes: ZitadelUserUpdateInputInput;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ZitadelUserUpdateInputInput {
  username?: InputMaybe<Scalars['String']['input']>;
  profile?: InputMaybe<ProfileInput>;
  email?: InputMaybe<EmailInput>;
  phone?: InputMaybe<PhoneInput>;
  password?: InputMaybe<PasswordInput>;
}

export interface ProfileInput {
  givenName?: InputMaybe<Scalars['String']['input']>;
  familyName?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  preferredLanguage?: InputMaybe<Scalars['String']['input']>;
}

export interface EmailInput {
  email: Scalars['String']['input'];
}

export interface PhoneInput {
  phone: Scalars['String']['input'];
}

export interface PasswordInput {
  password: Scalars['String']['input'];
  changeRequired?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface ArgsInput_13 {
  userId: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  changeRequired?: InputMaybe<Scalars['Boolean']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_14 {
  userId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_15 {
  userId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_16 {
  userId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_17 {
  userId: Scalars['String']['input'];
  code: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_18 {
  userId: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_19 {
  input: ZitadelAuthorizationCreateInputInput;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ZitadelAuthorizationCreateInputInput {
  userId: Scalars['String']['input'];
  projectId?: InputMaybe<Scalars['String']['input']>;
  projectGrantId?: InputMaybe<Scalars['String']['input']>;
  roleKeys: Array<Scalars['String']['input']>;
}

export interface ArgsInput_20 {
  input: ZitadelAuthorizationUpdateInputInput;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ZitadelAuthorizationUpdateInputInput {
  authorizationId: Scalars['String']['input'];
  roleKeys: Array<Scalars['String']['input']>;
}

export interface ArgsInput_21 {
  authorizationId: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_22 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_23 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_24 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_25 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_26 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_27 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_28 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export enum UserState {
  USER_STATE_UNSPECIFIED = 'USER_STATE_UNSPECIFIED',
  USER_STATE_ACTIVE = 'USER_STATE_ACTIVE',
  USER_STATE_INACTIVE = 'USER_STATE_INACTIVE',
  USER_STATE_DELETED = 'USER_STATE_DELETED',
  USER_STATE_LOCKED = 'USER_STATE_LOCKED',
  USER_STATE_INITIAL = 'USER_STATE_INITIAL'
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Any: true,
  Boolean: true,
  DateTimeISO: true,
  File: true,
  ID: true,
  JSON: true,
  JSONObject: true,
  Number: true,
  String: true,
  UserState: true,
  Void: true
};
export const generatedSchema = {
  ArgsInput: {
    id: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_1: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' },
    limit: { __type: 'Number' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_10: {
    userId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_11: {
    userId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_12: {
    userId: { __type: 'String!' },
    changes: { __type: 'ZitadelUserUpdateInputInput!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_13: {
    userId: { __type: 'String!' },
    newPassword: { __type: 'String!' },
    changeRequired: { __type: 'Boolean' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_14: {
    userId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_15: {
    userId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_16: {
    userId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_17: {
    userId: { __type: 'String!' },
    code: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_18: {
    userId: { __type: 'String!' },
    phone: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_19: {
    input: { __type: 'ZitadelAuthorizationCreateInputInput!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_2: {
    roleKey: { __type: 'String!' },
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' },
    limit: { __type: 'Number' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_20: {
    input: { __type: 'ZitadelAuthorizationUpdateInputInput!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_21: {
    authorizationId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_22: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_23: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_24: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_25: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_26: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_27: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_28: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_3: {
    projectId: { __type: 'String!' },
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' },
    limit: { __type: 'Number' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_4: { loginName: { __type: 'String!' } },
  ArgsInput_5: { organizationId: { __type: 'String' } },
  ArgsInput_6: {
    values: { __type: 'ValuesInput!' },
    organizationId: { __type: 'String' },
    createProfile: { __type: 'Boolean' },
    skipEmailVerification: { __type: 'Boolean' }
  },
  ArgsInput_7: {
    userId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_8: {
    userId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_9: {
    userId: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  AuthorizationMutationResult: {
    __typename: { __type: 'String!' },
    ok: { __type: 'Boolean!' },
    message: { __type: 'String' },
    authorizationId: { __type: 'String' }
  },
  DataConnection: {
    __typename: { __type: 'String!' },
    edges: { __type: '[DataEdge!]!' },
    pageInfo: { __type: 'PageInfo!' },
    totalCount: { __type: 'Number!' }
  },
  DataEdge: {
    __typename: { __type: 'String!' },
    cursor: { __type: 'String!' },
    node: { __type: 'UserDataNode!' }
  },
  DetailsInput: {
    firstName: { __type: 'String' },
    lastName: { __type: 'String' }
  },
  EmailInput: { email: { __type: 'String!' } },
  Grant: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    organizationId: { __type: 'String' },
    creationDate: { __type: 'String' },
    changeDate: { __type: 'String' },
    projectId: { __type: 'String' },
    projectName: { __type: 'String' },
    state: { __type: 'String' }
  },
  GrantConnection: {
    __typename: { __type: 'String!' },
    edges: { __type: '[GrantEdge!]!' },
    pageInfo: { __type: 'PageInfo!' },
    totalCount: { __type: 'Number!' }
  },
  GrantEdge: {
    __typename: { __type: 'String!' },
    cursor: { __type: 'String!' },
    node: { __type: 'Grant!' }
  },
  HumanUser: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    state: { __type: 'UserState!' },
    userName: { __type: 'String!' },
    loginNames: { __type: '[String!]!' },
    preferredLoginName: { __type: 'String!' },
    resourceOwner: { __type: 'String!' },
    creationDate: { __type: 'String!' },
    changeDate: { __type: 'String!' },
    sequence: { __type: 'String!' },
    preferences: { __type: 'Preferences!' },
    profiles: {
      __type: 'ProfileConnection!',
      __args: { args: 'ArgsInput_22' }
    },
    data: { __type: 'DataConnection!', __args: { args: 'ArgsInput_23' } },
    grants: { __type: 'GrantConnection!', __args: { args: 'ArgsInput_24' } },
    roles: { __type: 'RoleConnection!', __args: { args: 'ArgsInput_25' } }
  },
  MachineUser: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    state: { __type: 'UserState!' },
    userName: { __type: 'String!' },
    loginNames: { __type: '[String!]!' },
    preferredLoginName: { __type: 'String!' },
    resourceOwner: { __type: 'String!' },
    creationDate: { __type: 'String!' },
    changeDate: { __type: 'String!' },
    sequence: { __type: 'String!' },
    data: { __type: 'DataConnection!', __args: { args: 'ArgsInput_26' } },
    grants: { __type: 'GrantConnection!', __args: { args: 'ArgsInput_27' } },
    roles: { __type: 'RoleConnection!', __args: { args: 'ArgsInput_28' } }
  },
  MutationResult: {
    __typename: { __type: 'String!' },
    ok: { __type: 'Boolean!' },
    message: { __type: 'String' }
  },
  PageInfo: {
    __typename: { __type: 'String!' },
    hasNextPage: { __type: 'Boolean!' },
    hasPreviousPage: { __type: 'Boolean!' },
    startCursor: { __type: 'String' },
    endCursor: { __type: 'String' }
  },
  PasswordInput: {
    password: { __type: 'String!' },
    changeRequired: { __type: 'Boolean' }
  },
  PhoneInput: { phone: { __type: 'String!' } },
  Preferences: {
    __typename: { __type: 'String!' },
    preferredLanguage: { __type: 'String' }
  },
  ProfileConnection: {
    __typename: { __type: 'String!' },
    edges: { __type: '[ProfileEdge!]!' },
    pageInfo: { __type: 'PageInfo!' },
    totalCount: { __type: 'Number!' }
  },
  ProfileEdge: {
    __typename: { __type: 'String!' },
    cursor: { __type: 'String!' },
    node: { __type: 'UserProfileNode!' }
  },
  ProfileInput: {
    givenName: { __type: 'String' },
    familyName: { __type: 'String' },
    displayName: { __type: 'String' },
    preferredLanguage: { __type: 'String' }
  },
  Role: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    key: { __type: 'String!' },
    displayName: { __type: 'String' }
  },
  RoleConnection: {
    __typename: { __type: 'String!' },
    edges: { __type: '[RoleEdge!]!' },
    pageInfo: { __type: 'PageInfo!' },
    totalCount: { __type: 'Number!' }
  },
  RoleEdge: {
    __typename: { __type: 'String!' },
    cursor: { __type: 'String!' },
    node: { __type: 'Role!' }
  },
  UserConnection: {
    __typename: { __type: 'String!' },
    edges: { __type: '[UserEdge!]!' },
    pageInfo: { __type: 'PageInfo!' },
    totalCount: { __type: 'Number!' }
  },
  UserDataNode: { __typename: { __type: 'String!' }, id: { __type: 'ID!' } },
  UserEdge: {
    __typename: { __type: 'String!' },
    cursor: { __type: 'String!' },
    node: { __type: 'UserNode!' }
  },
  UserMutationResult: {
    __typename: { __type: 'String!' },
    ok: { __type: 'Boolean!' },
    message: { __type: 'String' },
    userId: { __type: 'String' },
    user: { __type: 'UserNode' }
  },
  UserNode: {
    __typename: { __type: 'String!' },
    state: { __type: 'UserState!' },
    userName: { __type: 'String!' },
    loginNames: { __type: '[String!]!' },
    preferredLoginName: { __type: 'String!' },
    resourceOwner: { __type: 'String!' },
    creationDate: { __type: 'String!' },
    changeDate: { __type: 'String!' },
    sequence: { __type: 'String!' },
    id: { __type: 'ID!' },
    $on: { __type: '$UserNode!' }
  },
  UserProfileNode: {
    __typename: { __type: 'String!' },
    avatarUrl: { __type: 'String' },
    preferredLanguage: { __type: 'String' },
    displayName: { __type: 'String' },
    email: { __type: 'String' },
    phone: { __type: 'String' },
    firstName: { __type: 'String' },
    lastName: { __type: 'String' },
    id: { __type: 'ID!' }
  },
  ValuesInput: {
    emailAddress: { __type: 'String!' },
    username: { __type: 'String!' },
    password: { __type: 'String' },
    hashedPassword: { __type: 'String' },
    details: { __type: 'DetailsInput' }
  },
  ZitadelAuthorizationCreateInputInput: {
    userId: { __type: 'String!' },
    projectId: { __type: 'String' },
    projectGrantId: { __type: 'String' },
    roleKeys: { __type: '[String!]!' }
  },
  ZitadelAuthorizationUpdateInputInput: {
    authorizationId: { __type: 'String!' },
    roleKeys: { __type: '[String!]!' }
  },
  ZitadelUserUpdateInputInput: {
    username: { __type: 'String' },
    profile: { __type: 'ProfileInput' },
    email: { __type: 'EmailInput' },
    phone: { __type: 'PhoneInput' },
    password: { __type: 'PasswordInput' }
  },
  mutation: {
    __typename: { __type: 'String!' },
    createUser: {
      __type: 'UserMutationResult!',
      __args: { args: 'ArgsInput_6!' }
    },
    deleteUser: {
      __type: 'UserMutationResult!',
      __args: { args: 'ArgsInput_7!' }
    },
    deactivateUser: {
      __type: 'UserMutationResult!',
      __args: { args: 'ArgsInput_8!' }
    },
    reactivateUser: {
      __type: 'UserMutationResult!',
      __args: { args: 'ArgsInput_9!' }
    },
    lockUser: {
      __type: 'UserMutationResult!',
      __args: { args: 'ArgsInput_10!' }
    },
    unlockUser: {
      __type: 'UserMutationResult!',
      __args: { args: 'ArgsInput_11!' }
    },
    updateUser: {
      __type: 'UserMutationResult!',
      __args: { args: 'ArgsInput_12!' }
    },
    setUserPassword: {
      __type: 'MutationResult!',
      __args: { args: 'ArgsInput_13!' }
    },
    requestUserPasswordReset: {
      __type: 'MutationResult!',
      __args: { args: 'ArgsInput_14!' }
    },
    sendUserEmailVerification: {
      __type: 'MutationResult!',
      __args: { args: 'ArgsInput_15!' }
    },
    resendUserEmailVerification: {
      __type: 'MutationResult!',
      __args: { args: 'ArgsInput_16!' }
    },
    verifyUserEmail: {
      __type: 'MutationResult!',
      __args: { args: 'ArgsInput_17!' }
    },
    setUserPhone: {
      __type: 'UserMutationResult!',
      __args: { args: 'ArgsInput_18!' }
    },
    createAuthorization: {
      __type: 'AuthorizationMutationResult!',
      __args: { args: 'ArgsInput_19!' }
    },
    updateAuthorization: {
      __type: 'AuthorizationMutationResult!',
      __args: { args: 'ArgsInput_20!' }
    },
    deleteAuthorization: {
      __type: 'AuthorizationMutationResult!',
      __args: { args: 'ArgsInput_21!' }
    }
  },
  query: {
    __typename: { __type: 'String!' },
    user: { __type: 'UserNode!', __args: { args: 'ArgsInput!' } },
    users: { __type: 'UserConnection!', __args: { args: 'ArgsInput_1' } },
    usersByRole: {
      __type: 'UserConnection!',
      __args: { args: 'ArgsInput_2!' }
    },
    projectRoles: {
      __type: 'RoleConnection!',
      __args: { args: 'ArgsInput_3!' }
    },
    isUnique: { __type: 'Boolean', __args: { args: 'ArgsInput_4!' } },
    currentUser: { __type: 'UserNode!', __args: { args: 'ArgsInput_5' } }
  },
  subscription: {},
  [SchemaUnionsKey]: { UserNode: ['HumanUser', 'MachineUser'] }
} as const;

export interface AuthorizationMutationResult {
  __typename?: 'AuthorizationMutationResult';
  ok: ScalarsEnums['Boolean'];
  message?: Maybe<ScalarsEnums['String']>;
  authorizationId?: Maybe<ScalarsEnums['String']>;
}

export interface DataConnection {
  __typename?: 'DataConnection';
  edges: Array<DataEdge>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums['Number'];
}

export interface DataEdge {
  __typename?: 'DataEdge';
  cursor: ScalarsEnums['String'];
  node: UserDataNode;
}

/**
 * Represents one grant assignment returned by Zitadel.
 * The id is synthesized from stable fields so this can be used like a Relay node.
 */
export interface Grant {
  __typename?: 'Grant';
  id: ScalarsEnums['ID'];
  organizationId?: Maybe<ScalarsEnums['String']>;
  creationDate?: Maybe<ScalarsEnums['String']>;
  changeDate?: Maybe<ScalarsEnums['String']>;
  projectId?: Maybe<ScalarsEnums['String']>;
  projectName?: Maybe<ScalarsEnums['String']>;
  state?: Maybe<ScalarsEnums['String']>;
}

/**
 * Wraps grant edges plus pagination state.
 * Having edges + pageInfo makes schema tools detect this as Relay connection.
 */
export interface GrantConnection {
  __typename?: 'GrantConnection';
  edges: Array<GrantEdge>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums['Number'];
}

export interface GrantEdge {
  __typename?: 'GrantEdge';
  cursor: ScalarsEnums['String'];
  node: Grant;
}

/**
 * Represents a human user coming from Zitadel.
 * The instance holds normalized base fields and resolves related collections lazily.
 */
export interface HumanUser {
  __typename?: 'HumanUser';
  id: ScalarsEnums['ID'];
  state: ScalarsEnums['UserState'];
  userName: ScalarsEnums['String'];
  loginNames: Array<ScalarsEnums['String']>;
  preferredLoginName: ScalarsEnums['String'];
  resourceOwner: ScalarsEnums['String'];
  creationDate: ScalarsEnums['String'];
  changeDate: ScalarsEnums['String'];
  sequence: ScalarsEnums['String'];
  preferences: Preferences;
  /**
   * Resolves the user’s profiles as a Relay connection.
   */
  profiles: (args?: { args?: Maybe<ArgsInput_22> }) => ProfileConnection;
  /**
   * Resolves the user’s data as a Relay connection.
   */
  data: (args?: { args?: Maybe<ArgsInput_23> }) => DataConnection;
  grants: (args?: { args?: Maybe<ArgsInput_24> }) => GrantConnection;
  roles: (args?: { args?: Maybe<ArgsInput_25> }) => RoleConnection;
}

/**
 * Represents a machine user coming from Zitadel.
 * The instance type is what makes `... on MachineUser` resolve correctly.
 */
export interface MachineUser {
  __typename?: 'MachineUser';
  id: ScalarsEnums['ID'];
  state: ScalarsEnums['UserState'];
  userName: ScalarsEnums['String'];
  loginNames: Array<ScalarsEnums['String']>;
  preferredLoginName: ScalarsEnums['String'];
  resourceOwner: ScalarsEnums['String'];
  creationDate: ScalarsEnums['String'];
  changeDate: ScalarsEnums['String'];
  sequence: ScalarsEnums['String'];
  /**
   * Resolves the user’s data as a Relay connection.
   */
  data: (args?: { args?: Maybe<ArgsInput_26> }) => DataConnection;
  /**
   * Resolves grants as a Relay connection.
   * The underlying Zitadel request is cached per request.
   */
  grants: (args?: { args?: Maybe<ArgsInput_27> }) => GrantConnection;
  /**
   * Resolves roles as a Relay connection.
   * Roles are derived from cached grants to avoid extra HTTP.
   */
  roles: (args?: { args?: Maybe<ArgsInput_28> }) => RoleConnection;
}

/**
 * Mutation payloads (return OBJECTS, not raw JSON/void).
 * Keep these tiny and stable so Pylon generates predictable schema types.
 */
export interface MutationResult {
  __typename?: 'MutationResult';
  ok: ScalarsEnums['Boolean'];
  message?: Maybe<ScalarsEnums['String']>;
}

/**
 * Carries pagination state for a sliced collection.
 * This follows the Relay `PageInfo` shape so tooling can detect connections.
 */
export interface PageInfo {
  __typename?: 'PageInfo';
  hasNextPage: ScalarsEnums['Boolean'];
  hasPreviousPage: ScalarsEnums['Boolean'];
  startCursor?: Maybe<ScalarsEnums['String']>;
  endCursor?: Maybe<ScalarsEnums['String']>;
}

export interface Preferences {
  __typename?: 'Preferences';
  preferredLanguage?: Maybe<ScalarsEnums['String']>;
}

export interface ProfileConnection {
  __typename?: 'ProfileConnection';
  edges: Array<ProfileEdge>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums['Number'];
}

export interface ProfileEdge {
  __typename?: 'ProfileEdge';
  cursor: ScalarsEnums['String'];
  node: UserProfileNode;
}

/**
 * Represents a single project role derived from Zitadel grants.
 * The id is deterministic so the object can behave like a Relay node.
 */
export interface Role {
  __typename?: 'Role';
  id: ScalarsEnums['ID'];
  key: ScalarsEnums['String'];
  displayName?: Maybe<ScalarsEnums['String']>;
}

/**
 * Wraps role edges plus pagination state.
 * Keeping exact field names enables Relay/Voyager auto-detection.
 */
export interface RoleConnection {
  __typename?: 'RoleConnection';
  edges: Array<RoleEdge>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums['Number'];
}

export interface RoleEdge {
  __typename?: 'RoleEdge';
  cursor: ScalarsEnums['String'];
  node: Role;
}

/**
 * Wraps a list of edges plus pagination state in Relay connection format.
 * Keeping exact field names makes schema tools detect it as a Relay connection.
 */
export interface UserConnection {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums['Number'];
}

export interface UserDataNode {
  __typename?: 'UserDataNode';
  id: ScalarsEnums['ID'];
}

export interface UserEdge {
  __typename?: 'UserEdge';
  cursor: ScalarsEnums['String'];
  node: UserNode;
}

export interface UserMutationResult {
  __typename?: 'UserMutationResult';
  ok: ScalarsEnums['Boolean'];
  message?: Maybe<ScalarsEnums['String']>;
  userId?: Maybe<ScalarsEnums['String']>;
  user?: Maybe<UserNode>;
}

export interface UserNode {
  __typename?: 'HumanUser' | 'MachineUser';
  state: ScalarsEnums['UserState'];
  userName: ScalarsEnums['String'];
  loginNames: Array<ScalarsEnums['String']>;
  preferredLoginName: ScalarsEnums['String'];
  resourceOwner: ScalarsEnums['String'];
  creationDate: ScalarsEnums['String'];
  changeDate: ScalarsEnums['String'];
  sequence: ScalarsEnums['String'];
  id: ScalarsEnums['ID'];
  $on: $UserNode;
}

export interface UserProfileNode {
  __typename?: 'UserProfileNode';
  avatarUrl?: Maybe<ScalarsEnums['String']>;
  preferredLanguage?: Maybe<ScalarsEnums['String']>;
  displayName?: Maybe<ScalarsEnums['String']>;
  email?: Maybe<ScalarsEnums['String']>;
  phone?: Maybe<ScalarsEnums['String']>;
  firstName?: Maybe<ScalarsEnums['String']>;
  lastName?: Maybe<ScalarsEnums['String']>;
  id: ScalarsEnums['ID'];
}

export interface Mutation {
  __typename?: 'Mutation';
  createUser: (args: { args: ArgsInput_6 }) => UserMutationResult;
  deleteUser: (args: { args: ArgsInput_7 }) => UserMutationResult;
  deactivateUser: (args: { args: ArgsInput_8 }) => UserMutationResult;
  reactivateUser: (args: { args: ArgsInput_9 }) => UserMutationResult;
  lockUser: (args: { args: ArgsInput_10 }) => UserMutationResult;
  unlockUser: (args: { args: ArgsInput_11 }) => UserMutationResult;
  updateUser: (args: { args: ArgsInput_12 }) => UserMutationResult;
  setUserPassword: (args: { args: ArgsInput_13 }) => MutationResult;
  requestUserPasswordReset: (args: { args: ArgsInput_14 }) => MutationResult;
  sendUserEmailVerification: (args: { args: ArgsInput_15 }) => MutationResult;
  resendUserEmailVerification: (args: { args: ArgsInput_16 }) => MutationResult;
  verifyUserEmail: (args: { args: ArgsInput_17 }) => MutationResult;
  setUserPhone: (args: { args: ArgsInput_18 }) => UserMutationResult;
  createAuthorization: (args: {
    args: ArgsInput_19;
  }) => AuthorizationMutationResult;
  updateAuthorization: (args: {
    args: ArgsInput_20;
  }) => AuthorizationMutationResult;
  deleteAuthorization: (args: {
    args: ArgsInput_21;
  }) => AuthorizationMutationResult;
}

export interface Query {
  __typename?: 'Query';
  user: (args: { args: ArgsInput }) => UserNode;
  users: (args?: { args?: Maybe<ArgsInput_1> }) => UserConnection;
  usersByRole: (args: { args: ArgsInput_2 }) => UserConnection;
  projectRoles: (args: { args: ArgsInput_3 }) => RoleConnection;
  isUnique: (args: { args: ArgsInput_4 }) => Maybe<ScalarsEnums['Boolean']>;
  currentUser: (args?: { args?: Maybe<ArgsInput_5> }) => UserNode;
}

export interface Subscription {
  __typename?: 'Subscription';
}

export interface $UserNode {
  HumanUser?: HumanUser;
  MachineUser?: MachineUser;
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends { output: unknown }
    ? Scalars[Key]['output']
    : never;
} & {
  UserState: UserState;
};

/**
 * Contains code for parameter to argument conversion.
 */

export interface MutationTypes {
  createUser: {
    params: [args: ArgsInput_6];
    return: UserMutationResult;
  };
  deleteUser: {
    params: [args: ArgsInput_7];
    return: UserMutationResult;
  };
  deactivateUser: {
    params: [args: ArgsInput_8];
    return: UserMutationResult;
  };
  reactivateUser: {
    params: [args: ArgsInput_9];
    return: UserMutationResult;
  };
  lockUser: {
    params: [args: ArgsInput_10];
    return: UserMutationResult;
  };
  unlockUser: {
    params: [args: ArgsInput_11];
    return: UserMutationResult;
  };
  updateUser: {
    params: [args: ArgsInput_12];
    return: UserMutationResult;
  };
  setUserPassword: {
    params: [args: ArgsInput_13];
    return: MutationResult;
  };
  requestUserPasswordReset: {
    params: [args: ArgsInput_14];
    return: MutationResult;
  };
  sendUserEmailVerification: {
    params: [args: ArgsInput_15];
    return: MutationResult;
  };
  resendUserEmailVerification: {
    params: [args: ArgsInput_16];
    return: MutationResult;
  };
  verifyUserEmail: {
    params: [args: ArgsInput_17];
    return: MutationResult;
  };
  setUserPhone: {
    params: [args: ArgsInput_18];
    return: UserMutationResult;
  };
  createAuthorization: {
    params: [args: ArgsInput_19];
    return: AuthorizationMutationResult;
  };
  updateAuthorization: {
    params: [args: ArgsInput_20];
    return: AuthorizationMutationResult;
  };
  deleteAuthorization: {
    params: [args: ArgsInput_21];
    return: AuthorizationMutationResult;
  };
}

export interface QueryTypes {
  user: {
    params: [args: ArgsInput];
    return: UserNode;
  };
  users: {
    params: [args?: Maybe<ArgsInput_1>];
    return: UserConnection;
  };
  usersByRole: {
    params: [args: ArgsInput_2];
    return: UserConnection;
  };
  projectRoles: {
    params: [args: ArgsInput_3];
    return: RoleConnection;
  };
  isUnique: {
    params: [args: ArgsInput_4];
    return: Maybe<ScalarsEnums['Boolean']>;
  };
  currentUser: {
    params: [args?: Maybe<ArgsInput_5>];
    return: UserNode;
  };
}

export const MutationParamNames = {
  createUser: ['args'],
  deleteUser: ['args'],
  deactivateUser: ['args'],
  reactivateUser: ['args'],
  lockUser: ['args'],
  unlockUser: ['args'],
  updateUser: ['args'],
  setUserPassword: ['args'],
  requestUserPasswordReset: ['args'],
  sendUserEmailVerification: ['args'],
  resendUserEmailVerification: ['args'],
  verifyUserEmail: ['args'],
  setUserPhone: ['args'],
  createAuthorization: ['args'],
  updateAuthorization: ['args'],
  deleteAuthorization: ['args']
};
export const QueryParamNames = {
  user: ['args'],
  users: ['args'],
  usersByRole: ['args'],
  projectRoles: ['args'],
  isUnique: ['args'],
  currentUser: ['args']
};

export function convertParamsToArgsFn<T>(
  argNames: string[],
  params: unknown[]
): T {
  const result: Record<string, unknown> = {};

  argNames.forEach((key, index) => {
    const value = params[index];
    // Only set the property if it's not undefined
    if (value !== undefined) {
      result[key] = value;
    }
  });

  return result as T;
}

export const convertParamsToArgs = {
  Mutation: {
    createUser(
      params: MutationTypes['createUser']['params']
    ): Parameters<Mutation['createUser']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['createUser']>[0]>(
        MutationParamNames['createUser'],
        params
      );
    },
    deleteUser(
      params: MutationTypes['deleteUser']['params']
    ): Parameters<Mutation['deleteUser']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['deleteUser']>[0]>(
        MutationParamNames['deleteUser'],
        params
      );
    },
    deactivateUser(
      params: MutationTypes['deactivateUser']['params']
    ): Parameters<Mutation['deactivateUser']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['deactivateUser']>[0]>(
        MutationParamNames['deactivateUser'],
        params
      );
    },
    reactivateUser(
      params: MutationTypes['reactivateUser']['params']
    ): Parameters<Mutation['reactivateUser']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['reactivateUser']>[0]>(
        MutationParamNames['reactivateUser'],
        params
      );
    },
    lockUser(
      params: MutationTypes['lockUser']['params']
    ): Parameters<Mutation['lockUser']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['lockUser']>[0]>(
        MutationParamNames['lockUser'],
        params
      );
    },
    unlockUser(
      params: MutationTypes['unlockUser']['params']
    ): Parameters<Mutation['unlockUser']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['unlockUser']>[0]>(
        MutationParamNames['unlockUser'],
        params
      );
    },
    updateUser(
      params: MutationTypes['updateUser']['params']
    ): Parameters<Mutation['updateUser']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['updateUser']>[0]>(
        MutationParamNames['updateUser'],
        params
      );
    },
    setUserPassword(
      params: MutationTypes['setUserPassword']['params']
    ): Parameters<Mutation['setUserPassword']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['setUserPassword']>[0]>(
        MutationParamNames['setUserPassword'],
        params
      );
    },
    requestUserPasswordReset(
      params: MutationTypes['requestUserPasswordReset']['params']
    ): Parameters<Mutation['requestUserPasswordReset']>[0] {
      return convertParamsToArgsFn<
        Parameters<Mutation['requestUserPasswordReset']>[0]
      >(MutationParamNames['requestUserPasswordReset'], params);
    },
    sendUserEmailVerification(
      params: MutationTypes['sendUserEmailVerification']['params']
    ): Parameters<Mutation['sendUserEmailVerification']>[0] {
      return convertParamsToArgsFn<
        Parameters<Mutation['sendUserEmailVerification']>[0]
      >(MutationParamNames['sendUserEmailVerification'], params);
    },
    resendUserEmailVerification(
      params: MutationTypes['resendUserEmailVerification']['params']
    ): Parameters<Mutation['resendUserEmailVerification']>[0] {
      return convertParamsToArgsFn<
        Parameters<Mutation['resendUserEmailVerification']>[0]
      >(MutationParamNames['resendUserEmailVerification'], params);
    },
    verifyUserEmail(
      params: MutationTypes['verifyUserEmail']['params']
    ): Parameters<Mutation['verifyUserEmail']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['verifyUserEmail']>[0]>(
        MutationParamNames['verifyUserEmail'],
        params
      );
    },
    setUserPhone(
      params: MutationTypes['setUserPhone']['params']
    ): Parameters<Mutation['setUserPhone']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['setUserPhone']>[0]>(
        MutationParamNames['setUserPhone'],
        params
      );
    },
    createAuthorization(
      params: MutationTypes['createAuthorization']['params']
    ): Parameters<Mutation['createAuthorization']>[0] {
      return convertParamsToArgsFn<
        Parameters<Mutation['createAuthorization']>[0]
      >(MutationParamNames['createAuthorization'], params);
    },
    updateAuthorization(
      params: MutationTypes['updateAuthorization']['params']
    ): Parameters<Mutation['updateAuthorization']>[0] {
      return convertParamsToArgsFn<
        Parameters<Mutation['updateAuthorization']>[0]
      >(MutationParamNames['updateAuthorization'], params);
    },
    deleteAuthorization(
      params: MutationTypes['deleteAuthorization']['params']
    ): Parameters<Mutation['deleteAuthorization']>[0] {
      return convertParamsToArgsFn<
        Parameters<Mutation['deleteAuthorization']>[0]
      >(MutationParamNames['deleteAuthorization'], params);
    }
  },
  Query: {
    user(params: QueryTypes['user']['params']): Parameters<Query['user']>[0] {
      return convertParamsToArgsFn<Parameters<Query['user']>[0]>(
        QueryParamNames['user'],
        params
      );
    },
    users(
      params: QueryTypes['users']['params']
    ): Parameters<Query['users']>[0] {
      return convertParamsToArgsFn<Parameters<Query['users']>[0]>(
        QueryParamNames['users'],
        params
      );
    },
    usersByRole(
      params: QueryTypes['usersByRole']['params']
    ): Parameters<Query['usersByRole']>[0] {
      return convertParamsToArgsFn<Parameters<Query['usersByRole']>[0]>(
        QueryParamNames['usersByRole'],
        params
      );
    },
    projectRoles(
      params: QueryTypes['projectRoles']['params']
    ): Parameters<Query['projectRoles']>[0] {
      return convertParamsToArgsFn<Parameters<Query['projectRoles']>[0]>(
        QueryParamNames['projectRoles'],
        params
      );
    },
    isUnique(
      params: QueryTypes['isUnique']['params']
    ): Parameters<Query['isUnique']>[0] {
      return convertParamsToArgsFn<Parameters<Query['isUnique']>[0]>(
        QueryParamNames['isUnique'],
        params
      );
    },
    currentUser(
      params: QueryTypes['currentUser']['params']
    ): Parameters<Query['currentUser']>[0] {
      return convertParamsToArgsFn<Parameters<Query['currentUser']>[0]>(
        QueryParamNames['currentUser'],
        params
      );
    }
  }
};
