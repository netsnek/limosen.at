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

export interface ArgsInputInput {
  id: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_1Input {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Number']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_2Input {
  roleKey: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Number']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput {
  userId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_1 {
  userId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_4Input {
  loginName: Scalars['String']['input'];
}

export interface ArgsInput_5Input {
  organizationId?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_2 {
  customerId?: InputMaybe<Scalars['String']['input']>;
  driverId?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<TransferStateInput>;
  fromISO?: InputMaybe<Scalars['String']['input']>;
  toISO?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Number']['input']>;
  skip?: InputMaybe<Scalars['Number']['input']>;
}

export interface ArgsInput_3 {
  transferId?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Number']['input']>;
  skip?: InputMaybe<Scalars['Number']['input']>;
}

export interface ArgsInput_4 {
  driverId?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Number']['input']>;
  skip?: InputMaybe<Scalars['Number']['input']>;
}

export interface ArgsInput_5 {
  customerId: Scalars['String']['input'];
  transferDateISO: Scalars['String']['input'];
  transferTime: Scalars['String']['input'];
  pickup: Scalars['String']['input'];
  dropoff: Scalars['String']['input'];
  roomOrName?: InputMaybe<Scalars['String']['input']>;
  vehicle?: InputMaybe<Scalars['String']['input']>;
  amountEUR?: InputMaybe<Scalars['Number']['input']>;
  payment?: InputMaybe<Scalars['String']['input']>;
  carId?: InputMaybe<Scalars['String']['input']>;
  passengers?: InputMaybe<Array<PassengersInput>>;
  details?: InputMaybe<DetailsInput>;
}

export interface PassengersInput {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
}

export interface DetailsInput {
  flightNumber?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  transferCategory?: InputMaybe<TransferCategoryInput>;
  transferType?: InputMaybe<TransferTypeInput>;
  luggage?: InputMaybe<Scalars['String']['input']>;
  childSeats?: InputMaybe<Scalars['String']['input']>;
  extraTime?: InputMaybe<Scalars['String']['input']>;
  carClass?: InputMaybe<Scalars['String']['input']>;
  carTitle?: InputMaybe<Scalars['String']['input']>;
  paymentOption?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_6 {
  transferDateISO: Scalars['String']['input'];
  transferTime: Scalars['String']['input'];
  pickup: Scalars['String']['input'];
  dropoff: Scalars['String']['input'];
  roomOrName?: InputMaybe<Scalars['String']['input']>;
  vehicle?: InputMaybe<Scalars['String']['input']>;
  payment?: InputMaybe<Scalars['String']['input']>;
  passenger?: InputMaybe<PassengerInput>;
  details?: InputMaybe<DetailsInput_1>;
}

export interface PassengerInput {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
}

export interface DetailsInput_1 {
  flightNumber?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  transferCategory?: InputMaybe<TransferCategoryInput>;
  transferType?: InputMaybe<TransferTypeInput>;
  passengers?: InputMaybe<Scalars['String']['input']>;
  luggage?: InputMaybe<Scalars['String']['input']>;
  childSeats?: InputMaybe<Scalars['String']['input']>;
  extraTime?: InputMaybe<Scalars['String']['input']>;
  carClass?: InputMaybe<Scalars['String']['input']>;
  carTitle?: InputMaybe<Scalars['String']['input']>;
  paymentOption?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_7 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_8 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_9 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_10 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_11 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_12 {
  first?: InputMaybe<Scalars['Number']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Number']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}

export interface ArgsInput_13 {
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

export enum TransferState {
  pending = 'pending',
  assigned = 'assigned',
  rejected = 'rejected',
  aborted = 'aborted',
  on_the_way = 'on_the_way',
  at_pickup = 'at_pickup',
  no_show = 'no_show',
  failed = 'failed',
  canceled = 'canceled',
  terminated = 'terminated',
  ongoing = 'ongoing',
  completed = 'completed'
}

export enum TransferCategory {
  distance = 'distance',
  hourly = 'hourly',
  flatrate = 'flatrate'
}

export enum TransferType {
  one_way = 'one_way',
  return_trip = 'return_trip'
}

export enum CarClass {
  BUSINESS_CLASS = 'BUSINESS_CLASS',
  ELECTRIC_CLASS = 'ELECTRIC_CLASS',
  FIRST_CLASS = 'FIRST_CLASS',
  BUSINESS_VAN = 'BUSINESS_VAN'
}

export enum TransferStateInput {
  pending = 'pending',
  assigned = 'assigned',
  rejected = 'rejected',
  aborted = 'aborted',
  on_the_way = 'on_the_way',
  at_pickup = 'at_pickup',
  no_show = 'no_show',
  failed = 'failed',
  canceled = 'canceled',
  terminated = 'terminated',
  ongoing = 'ongoing',
  completed = 'completed'
}

export enum TransferCategoryInput {
  distance = 'distance',
  hourly = 'hourly',
  flatrate = 'flatrate'
}

export enum TransferTypeInput {
  one_way = 'one_way',
  return_trip = 'return_trip'
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Any: true,
  Boolean: true,
  CarClass: true,
  DateTimeISO: true,
  File: true,
  ID: true,
  JSON: true,
  JSONObject: true,
  Number: true,
  String: true,
  TransferCategory: true,
  TransferCategoryInput: true,
  TransferState: true,
  TransferStateInput: true,
  TransferType: true,
  TransferTypeInput: true,
  UserState: true,
  Void: true
};
export const generatedSchema = {
  ArgsInput: {
    userId: { __type: 'String!' },
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' },
    organizationId: { __type: 'String' }
  },
  ArgsInputInput: {
    id: { __type: 'String!' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_1: {
    userId: { __type: 'String!' },
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_10: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_11: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_12: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_13: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_1Input: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' },
    limit: { __type: 'Number' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_2: {
    customerId: { __type: 'String' },
    driverId: { __type: 'String' },
    state: { __type: 'TransferStateInput' },
    fromISO: { __type: 'String' },
    toISO: { __type: 'String' },
    take: { __type: 'Number' },
    skip: { __type: 'Number' }
  },
  ArgsInput_2Input: {
    roleKey: { __type: 'String!' },
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' },
    limit: { __type: 'Number' },
    organizationId: { __type: 'String' }
  },
  ArgsInput_3: {
    transferId: { __type: 'String' },
    take: { __type: 'Number' },
    skip: { __type: 'Number' }
  },
  ArgsInput_4: {
    driverId: { __type: 'String' },
    take: { __type: 'Number' },
    skip: { __type: 'Number' }
  },
  ArgsInput_4Input: { loginName: { __type: 'String!' } },
  ArgsInput_5: {
    customerId: { __type: 'String!' },
    transferDateISO: { __type: 'String!' },
    transferTime: { __type: 'String!' },
    pickup: { __type: 'String!' },
    dropoff: { __type: 'String!' },
    roomOrName: { __type: 'String' },
    vehicle: { __type: 'String' },
    amountEUR: { __type: 'Number' },
    payment: { __type: 'String' },
    carId: { __type: 'String' },
    passengers: { __type: '[PassengersInput!]' },
    details: { __type: 'DetailsInput' }
  },
  ArgsInput_5Input: { organizationId: { __type: 'String' } },
  ArgsInput_6: {
    transferDateISO: { __type: 'String!' },
    transferTime: { __type: 'String!' },
    pickup: { __type: 'String!' },
    dropoff: { __type: 'String!' },
    roomOrName: { __type: 'String' },
    vehicle: { __type: 'String' },
    payment: { __type: 'String' },
    passenger: { __type: 'PassengerInput' },
    details: { __type: 'DetailsInput_1' }
  },
  ArgsInput_7: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_8: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  ArgsInput_9: {
    first: { __type: 'Number' },
    after: { __type: 'String' },
    last: { __type: 'Number' },
    before: { __type: 'String' }
  },
  Car: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    licensePlate: { __type: 'String!' },
    color: { __type: 'String!' },
    carClass: { __type: 'CarClass' },
    carName: { __type: 'String' },
    driverId: { __type: 'String' },
    createdAt: { __type: 'DateTimeISO!' },
    updatedAt: { __type: 'DateTimeISO!' },
    driverName: { __type: 'String' },
    driver: { __type: 'UserNode' }
  },
  CustomerData: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    userId: { __type: 'String!' },
    createdAt: { __type: 'DateTimeISO!' },
    updatedAt: { __type: 'DateTimeISO!' },
    user: { __type: 'UserNode' },
    transfers: { __type: '[Transfer!]!' }
  },
  CustomerProfile: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    address: { __type: 'String!' },
    user: { __type: 'UserNode!' },
    avatarUrl: { __type: 'String' },
    preferredLanguage: { __type: 'String' },
    displayName: { __type: 'String' },
    email: { __type: 'String' },
    phone: { __type: 'String' },
    firstName: { __type: 'String' },
    lastName: { __type: 'String' }
  },
  DetailsInput: {
    flightNumber: { __type: 'String' },
    message: { __type: 'String' },
    transferCategory: { __type: 'TransferCategoryInput' },
    transferType: { __type: 'TransferTypeInput' },
    luggage: { __type: 'String' },
    childSeats: { __type: 'String' },
    extraTime: { __type: 'String' },
    carClass: { __type: 'String' },
    carTitle: { __type: 'String' },
    paymentOption: { __type: 'String' }
  },
  DetailsInput_1: {
    flightNumber: { __type: 'String' },
    message: { __type: 'String' },
    transferCategory: { __type: 'TransferCategoryInput' },
    transferType: { __type: 'TransferTypeInput' },
    passengers: { __type: 'String' },
    luggage: { __type: 'String' },
    childSeats: { __type: 'String' },
    extraTime: { __type: 'String' },
    carClass: { __type: 'String' },
    carTitle: { __type: 'String' },
    paymentOption: { __type: 'String' }
  },
  DriverData: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    userId: { __type: 'String!' },
    color: { __type: 'String!' },
    payoutPercent: { __type: 'Number!' },
    createdAt: { __type: 'DateTimeISO!' },
    updatedAt: { __type: 'DateTimeISO!' },
    user: { __type: 'UserNode' },
    cars: { __type: '[Car!]!' },
    transfers: { __type: '[Transfer!]!' },
    stats: { __type: 'JSONObject' }
  },
  DriverProfile: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    car: { __type: 'String' },
    user: { __type: 'UserNode!' },
    avatarUrl: { __type: 'String' },
    preferredLanguage: { __type: 'String' },
    displayName: { __type: 'String' },
    email: { __type: 'String' },
    phone: { __type: 'String' },
    firstName: { __type: 'String' },
    lastName: { __type: 'String' }
  },
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
    changeDate: { __type: 'String!' },
    creationDate: { __type: 'String!' },
    sequence: { __type: 'String!' },
    preferences: { __type: 'Preferences!' },
    profiles: { __type: 'ProfileConnection!', __args: { args: 'ArgsInput_7' } },
    data: { __type: 'UserDataConnection!', __args: { args: 'ArgsInput_8' } },
    grants: { __type: 'GrantConnection!', __args: { args: 'ArgsInput_9' } },
    roles: { __type: 'RoleConnection!', __args: { args: 'ArgsInput_10' } }
  },
  MachineUser: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    state: { __type: 'UserState!' },
    userName: { __type: 'String!' },
    loginNames: { __type: '[String!]!' },
    preferredLoginName: { __type: 'String!' },
    resourceOwner: { __type: 'String!' },
    changeDate: { __type: 'String!' },
    creationDate: { __type: 'String!' },
    sequence: { __type: 'String!' },
    data: { __type: 'UserDataConnection!', __args: { args: 'ArgsInput_11' } },
    grants: { __type: 'GrantConnection!', __args: { args: 'ArgsInput_12' } },
    roles: { __type: 'RoleConnection!', __args: { args: 'ArgsInput_13' } }
  },
  PageInfo: {
    __typename: { __type: 'String!' },
    hasNextPage: { __type: 'Boolean!' },
    hasPreviousPage: { __type: 'Boolean!' },
    startCursor: { __type: 'String' },
    endCursor: { __type: 'String' }
  },
  Passenger: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    transferId: { __type: 'String!' },
    firstName: { __type: 'String' },
    lastName: { __type: 'String' },
    email: { __type: 'String' },
    phone: { __type: 'String' },
    language: { __type: 'String' }
  },
  PassengerInput: {
    firstName: { __type: 'String' },
    lastName: { __type: 'String' },
    email: { __type: 'String' },
    phone: { __type: 'String' },
    language: { __type: 'String' }
  },
  PassengersInput: {
    firstName: { __type: 'String' },
    lastName: { __type: 'String' },
    email: { __type: 'String' },
    phone: { __type: 'String' },
    language: { __type: 'String' }
  },
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
  Transfer: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    customerId: { __type: 'String!' },
    driverId: { __type: 'String' },
    startTime: { __type: 'DateTimeISO' },
    pickupTime: { __type: 'DateTimeISO!' },
    endTime: { __type: 'DateTimeISO' },
    pickup: { __type: 'String!' },
    dropoff: { __type: 'String!' },
    roomOrName: { __type: 'String' },
    vehicle: { __type: 'String' },
    amountEUR: { __type: 'Number' },
    payment: { __type: 'String' },
    state: { __type: 'TransferState!' },
    requestedAt: { __type: 'DateTimeISO!' },
    transferCategory: { __type: 'TransferCategory!' },
    transferType: { __type: 'TransferType!' },
    flightNumber: { __type: 'String' },
    message: { __type: 'String' },
    luggage: { __type: 'String' },
    childSeats: { __type: 'String' },
    extraTime: { __type: 'String' },
    preferredCarClass: { __type: 'CarClass' },
    preferredCarName: { __type: 'String' },
    paymentOption: { __type: 'String!' },
    carId: { __type: 'String' },
    customerName: { __type: 'String' },
    driverName: { __type: 'String' },
    driver: { __type: 'UserNode' },
    customer: { __type: 'UserNode' },
    car: { __type: 'Car' },
    passengers: { __type: '[Passenger!]!' }
  },
  UserConnection: {
    __typename: { __type: 'String!' },
    edges: { __type: '[UserEdge!]!' },
    pageInfo: { __type: 'PageInfo!' },
    totalCount: { __type: 'Number!' }
  },
  UserDataConnection: {
    __typename: { __type: 'String!' },
    edges: { __type: '[UserDataEdge!]!' },
    pageInfo: { __type: 'PageInfo!' },
    totalCount: { __type: 'Number!' }
  },
  UserDataEdge: {
    __typename: { __type: 'String!' },
    cursor: { __type: 'String!' },
    node: { __type: 'UserDataNode!' }
  },
  UserDataNode: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    $on: { __type: '$UserDataNode!' }
  },
  UserEdge: {
    __typename: { __type: 'String!' },
    cursor: { __type: 'String!' },
    node: { __type: 'UserNode!' }
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
  UserProfile: {
    __typename: { __type: 'String!' },
    id: { __type: 'ID!' },
    user: { __type: 'UserNode!' },
    avatarUrl: { __type: 'String' },
    preferredLanguage: { __type: 'String' },
    displayName: { __type: 'String' },
    email: { __type: 'String' },
    phone: { __type: 'String' },
    firstName: { __type: 'String' },
    lastName: { __type: 'String' }
  },
  UserProfileNode: {
    __typename: { __type: 'String!' },
    user: { __type: 'UserNode!' },
    avatarUrl: { __type: 'String' },
    preferredLanguage: { __type: 'String' },
    displayName: { __type: 'String' },
    email: { __type: 'String' },
    phone: { __type: 'String' },
    firstName: { __type: 'String' },
    lastName: { __type: 'String' },
    id: { __type: 'ID!' },
    $on: { __type: '$UserProfileNode!' }
  },
  mutation: {
    __typename: { __type: 'String!' },
    createTransfer: { __type: 'Transfer!', __args: { args: 'ArgsInput_5!' } },
    bookTransfer: { __type: 'Transfer!', __args: { args: 'ArgsInput_6!' } },
    assignDriver: {
      __type: 'Transfer!',
      __args: { transferId: 'String!', driverId: 'String!' }
    },
    updateTransferState: {
      __type: 'Transfer!',
      __args: { transferId: 'String!', state: 'TransferStateInput!' }
    }
  },
  query: {
    __typename: { __type: 'String!' },
    user: { __type: 'UserNode!', __args: { args: 'ArgsInputInput!' } },
    users: { __type: 'UserConnection!', __args: { args: 'ArgsInput_1Input' } },
    usersByRole: {
      __type: 'UserConnection!',
      __args: { args: 'ArgsInput_2Input!' }
    },
    profiles: { __type: 'ProfileConnection!', __args: { args: 'ArgsInput!' } },
    userData: {
      __type: 'UserDataConnection!',
      __args: { args: 'ArgsInput_1!' }
    },
    isUnique: { __type: 'Boolean', __args: { args: 'ArgsInput_4Input!' } },
    currentUser: { __type: 'UserNode!', __args: { args: 'ArgsInput_5Input' } },
    transfers: { __type: '[Transfer!]!', __args: { args: 'ArgsInput_2' } },
    passengers: { __type: '[Passenger!]!', __args: { args: 'ArgsInput_3' } },
    cars: { __type: '[Car!]!', __args: { args: 'ArgsInput_4' } }
  },
  subscription: {},
  [SchemaUnionsKey]: {
    UserProfileNode: ['UserProfile', 'DriverProfile', 'CustomerProfile'],
    UserDataNode: ['DriverData', 'CustomerData'],
    UserNode: ['HumanUser', 'MachineUser']
  }
} as const;

/**
 * Car domain model (DB-backed).
 * - Constructor parameter-properties define public fields
 * - Optimized for: Object.assign(new Car(), r)
 * - No __typename
 */
export interface Car {
  __typename?: 'Car';
  id: ScalarsEnums['ID'];
  licensePlate: ScalarsEnums['String'];
  /**
   * Hex color in format "#RRGGBB"
   */
  color: ScalarsEnums['String'];
  carClass?: Maybe<ScalarsEnums['CarClass']>;
  carName?: Maybe<ScalarsEnums['String']>;
  driverId?: Maybe<ScalarsEnums['String']>;
  createdAt: ScalarsEnums['DateTimeISO'];
  updatedAt: ScalarsEnums['DateTimeISO'];
  driverName?: Maybe<ScalarsEnums['String']>;
  /**
   * Resolves the driver user (if driverId is set).
   */
  driver?: Maybe<UserNode>;
}

/**
 * CustomerData domain model (DB-backed).
 * - Constructor parameter-properties define public fields
 * - Optimized for: Object.assign(new CustomerData(), r)
 * - No __typename
 */
export interface CustomerData {
  __typename?: 'CustomerData';
  id: ScalarsEnums['ID'];
  userId: ScalarsEnums['String'];
  createdAt: ScalarsEnums['DateTimeISO'];
  updatedAt: ScalarsEnums['DateTimeISO'];
  /**
   * Resolves the Zitadel user for this customer (by userId).
   */
  user?: Maybe<UserNode>;
  /**
   * Resolves transfers for this customer (Transfer.customerId == CustomerData.userId).
   * DB-backed (Prisma), optimized for Object.assign(new Transfer(), row)
   */
  transfers: Array<Transfer>;
}

/**
 * Represents a customer user coming from Zitadel.
 * The instance type is what makes `... on CustomerProfile` resolve correctly.
 */
export interface CustomerProfile {
  __typename?: 'CustomerProfile';
  id: ScalarsEnums['ID'];
  address: ScalarsEnums['String'];
  user: UserNode;
  avatarUrl?: Maybe<ScalarsEnums['String']>;
  preferredLanguage?: Maybe<ScalarsEnums['String']>;
  displayName?: Maybe<ScalarsEnums['String']>;
  email?: Maybe<ScalarsEnums['String']>;
  phone?: Maybe<ScalarsEnums['String']>;
  firstName?: Maybe<ScalarsEnums['String']>;
  lastName?: Maybe<ScalarsEnums['String']>;
}

/**
 * DriverData domain model (DB-backed).
 * - Constructor parameter-properties define public fields
 * - Optimized for: Object.assign(new DriverData(), r)
 * - No __typename
 */
export interface DriverData {
  __typename?: 'DriverData';
  id: ScalarsEnums['ID'];
  userId: ScalarsEnums['String'];
  color: ScalarsEnums['String'];
  payoutPercent: ScalarsEnums['Number'];
  createdAt: ScalarsEnums['DateTimeISO'];
  updatedAt: ScalarsEnums['DateTimeISO'];
  /**
   * Resolves the Zitadel user for this driver (by userId).
   */
  user?: Maybe<UserNode>;
  /**
   * Resolves cars assigned to this driver (Car.driverId == DriverData.userId).
   * DB-backed (Prisma), optimized for Object.assign(new Car(), row)
   */
  cars: Array<Car>;
  /**
   * Resolves transfers assigned to this driver (Transfer.driverId == DriverData.userId).
   * DB-backed (Prisma), optimized for Object.assign(new Transfer(), row)
   */
  transfers: Array<Transfer>;
  /**
   * Resolves stats for this driver (DriverStats.driverDataId == DriverData.id).
   * Returns the raw prisma row to avoid introducing yet another model unless you want it.
   */
  stats?: Maybe<ScalarsEnums['JSONObject']>;
}

/**
 * Represents a driver user coming from Zitadel.
 * The instance type is what makes `... on DriverProfile` resolve correctly.
 */
export interface DriverProfile {
  __typename?: 'DriverProfile';
  id: ScalarsEnums['ID'];
  car?: Maybe<ScalarsEnums['String']>;
  user: UserNode;
  avatarUrl?: Maybe<ScalarsEnums['String']>;
  preferredLanguage?: Maybe<ScalarsEnums['String']>;
  displayName?: Maybe<ScalarsEnums['String']>;
  email?: Maybe<ScalarsEnums['String']>;
  phone?: Maybe<ScalarsEnums['String']>;
  firstName?: Maybe<ScalarsEnums['String']>;
  lastName?: Maybe<ScalarsEnums['String']>;
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
  changeDate: ScalarsEnums['String'];
  creationDate: ScalarsEnums['String'];
  sequence: ScalarsEnums['String'];
  preferences: Preferences;
  /**
   * User "profiles" as Relay connection.
   * Chooses DriverProfile vs CustomerProfile based on role `limosen:driver` / `limosen:customer`.
   */
  profiles: (args?: { args?: Maybe<ArgsInput_7> }) => ProfileConnection;
  /**
   * User "data" as Relay connection.
   *
   * Key fix: return concrete class instances (DriverData/CustomerData),
   * hydrated from Prisma rows via Object.assign(new X(), row).
   */
  data: (args?: { args?: Maybe<ArgsInput_8> }) => UserDataConnection;
  grants: (args?: { args?: Maybe<ArgsInput_9> }) => GrantConnection;
  roles: (args?: { args?: Maybe<ArgsInput_10> }) => RoleConnection;
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
  changeDate: ScalarsEnums['String'];
  creationDate: ScalarsEnums['String'];
  sequence: ScalarsEnums['String'];
  /**
   * Resolves the user’s data as a Relay connection.
   */
  data: (args?: { args?: Maybe<ArgsInput_11> }) => UserDataConnection;
  /**
   * Resolves grants as a Relay connection.
   * The underlying Zitadel request is cached per request.
   */
  grants: (args?: { args?: Maybe<ArgsInput_12> }) => GrantConnection;
  /**
   * Resolves roles as a Relay connection.
   * Roles are derived from cached grants to avoid extra HTTP.
   */
  roles: (args?: { args?: Maybe<ArgsInput_13> }) => RoleConnection;
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

export interface Passenger {
  __typename?: 'Passenger';
  id: ScalarsEnums['ID'];
  transferId: ScalarsEnums['String'];
  firstName?: Maybe<ScalarsEnums['String']>;
  lastName?: Maybe<ScalarsEnums['String']>;
  email?: Maybe<ScalarsEnums['String']>;
  phone?: Maybe<ScalarsEnums['String']>;
  language?: Maybe<ScalarsEnums['String']>;
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

export interface Transfer {
  __typename?: 'Transfer';
  id: ScalarsEnums['ID'];
  customerId: ScalarsEnums['String'];
  driverId?: Maybe<ScalarsEnums['String']>;
  startTime?: Maybe<ScalarsEnums['DateTimeISO']>;
  pickupTime: ScalarsEnums['DateTimeISO'];
  endTime?: Maybe<ScalarsEnums['DateTimeISO']>;
  pickup: ScalarsEnums['String'];
  dropoff: ScalarsEnums['String'];
  roomOrName?: Maybe<ScalarsEnums['String']>;
  vehicle?: Maybe<ScalarsEnums['String']>;
  amountEUR?: Maybe<ScalarsEnums['Number']>;
  payment?: Maybe<ScalarsEnums['String']>;
  state: ScalarsEnums['TransferState'];
  requestedAt: ScalarsEnums['DateTimeISO'];
  transferCategory: ScalarsEnums['TransferCategory'];
  transferType: ScalarsEnums['TransferType'];
  flightNumber?: Maybe<ScalarsEnums['String']>;
  message?: Maybe<ScalarsEnums['String']>;
  luggage?: Maybe<ScalarsEnums['String']>;
  childSeats?: Maybe<ScalarsEnums['String']>;
  extraTime?: Maybe<ScalarsEnums['String']>;
  preferredCarClass?: Maybe<ScalarsEnums['CarClass']>;
  preferredCarName?: Maybe<ScalarsEnums['String']>;
  paymentOption: ScalarsEnums['String'];
  carId?: Maybe<ScalarsEnums['String']>;
  customerName?: Maybe<ScalarsEnums['String']>;
  driverName?: Maybe<ScalarsEnums['String']>;
  /**
   * Resolves the driver user (if driverId is set).
   */
  driver?: Maybe<UserNode>;
  /**
   * Resolves the customer user (if customerId is set).
   */
  customer?: Maybe<UserNode>;
  /**
   * Resolves the related car (if carId is set).
   * DB-backed (Prisma), optimized for Object.assign(new Car(), row)
   */
  car?: Maybe<Car>;
  /**
   * Resolves passengers for this transfer.
   * DB-backed (Prisma), optimized for Object.assign(new Passenger(), row)
   */
  passengers: Array<Passenger>;
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

export interface UserDataConnection {
  __typename?: 'UserDataConnection';
  edges: Array<UserDataEdge>;
  pageInfo: PageInfo;
  totalCount: ScalarsEnums['Number'];
}

export interface UserDataEdge {
  __typename?: 'UserDataEdge';
  cursor: ScalarsEnums['String'];
  node: UserDataNode;
}

export interface UserDataNode {
  __typename?: 'DriverData' | 'CustomerData';
  id: ScalarsEnums['ID'];
  $on: $UserDataNode;
}

export interface UserEdge {
  __typename?: 'UserEdge';
  cursor: ScalarsEnums['String'];
  node: UserNode;
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

export interface UserProfile {
  __typename?: 'UserProfile';
  id: ScalarsEnums['ID'];
  user: UserNode;
  avatarUrl?: Maybe<ScalarsEnums['String']>;
  preferredLanguage?: Maybe<ScalarsEnums['String']>;
  displayName?: Maybe<ScalarsEnums['String']>;
  email?: Maybe<ScalarsEnums['String']>;
  phone?: Maybe<ScalarsEnums['String']>;
  firstName?: Maybe<ScalarsEnums['String']>;
  lastName?: Maybe<ScalarsEnums['String']>;
}

export interface UserProfileNode {
  __typename?: 'UserProfile' | 'DriverProfile' | 'CustomerProfile';
  user: UserNode;
  avatarUrl?: Maybe<ScalarsEnums['String']>;
  preferredLanguage?: Maybe<ScalarsEnums['String']>;
  displayName?: Maybe<ScalarsEnums['String']>;
  email?: Maybe<ScalarsEnums['String']>;
  phone?: Maybe<ScalarsEnums['String']>;
  firstName?: Maybe<ScalarsEnums['String']>;
  lastName?: Maybe<ScalarsEnums['String']>;
  id: ScalarsEnums['ID'];
  $on: $UserProfileNode;
}

export interface Mutation {
  __typename?: 'Mutation';
  createTransfer: (args: { args: ArgsInput_5 }) => Transfer;
  bookTransfer: (args: { args: ArgsInput_6 }) => Transfer;
  assignDriver: (args: {
    transferId: ScalarsEnums['String'];
    driverId: ScalarsEnums['String'];
  }) => Transfer;
  updateTransferState: (args: {
    transferId: ScalarsEnums['String'];
    state: TransferStateInput;
  }) => Transfer;
}

export interface Query {
  __typename?: 'Query';
  user: (args: { args: ArgsInputInput }) => UserNode;
  users: (args?: { args?: Maybe<ArgsInput_1Input> }) => UserConnection;
  usersByRole: (args: { args: ArgsInput_2Input }) => UserConnection;
  profiles: (args: { args: ArgsInput }) => ProfileConnection;
  userData: (args: { args: ArgsInput_1 }) => UserDataConnection;
  isUnique: (args: {
    args: ArgsInput_4Input;
  }) => Maybe<ScalarsEnums['Boolean']>;
  currentUser: (args?: { args?: Maybe<ArgsInput_5Input> }) => UserNode;
  transfers: (args?: { args?: Maybe<ArgsInput_2> }) => Array<Transfer>;
  passengers: (args?: { args?: Maybe<ArgsInput_3> }) => Array<Passenger>;
  cars: (args?: { args?: Maybe<ArgsInput_4> }) => Array<Car>;
}

export interface Subscription {
  __typename?: 'Subscription';
}

export interface $UserDataNode {
  DriverData?: DriverData;
  CustomerData?: CustomerData;
}

export interface $UserNode {
  HumanUser?: HumanUser;
  MachineUser?: MachineUser;
}

export interface $UserProfileNode {
  UserProfile?: UserProfile;
  DriverProfile?: DriverProfile;
  CustomerProfile?: CustomerProfile;
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
  CarClass: CarClass;
  TransferCategory: TransferCategory;
  TransferCategoryInput: TransferCategoryInput;
  TransferState: TransferState;
  TransferStateInput: TransferStateInput;
  TransferType: TransferType;
  TransferTypeInput: TransferTypeInput;
  UserState: UserState;
};

/**
 * Contains code for parameter to argument conversion.
 */

export interface MutationTypes {
  createTransfer: {
    params: [args: ArgsInput_5];
    return: Transfer;
  };
  bookTransfer: {
    params: [args: ArgsInput_6];
    return: Transfer;
  };
  assignDriver: {
    params: [
      transferId: ScalarsEnums['String'],
      driverId: ScalarsEnums['String']
    ];
    return: Transfer;
  };
  updateTransferState: {
    params: [
      transferId: ScalarsEnums['String'],
      state: ScalarsEnums['TransferStateInput']
    ];
    return: Transfer;
  };
}

export interface QueryTypes {
  user: {
    params: [args: ArgsInputInput];
    return: UserNode;
  };
  users: {
    params: [args?: Maybe<ArgsInput_1Input>];
    return: UserConnection;
  };
  usersByRole: {
    params: [args: ArgsInput_2Input];
    return: UserConnection;
  };
  profiles: {
    params: [args: ArgsInput];
    return: ProfileConnection;
  };
  userData: {
    params: [args: ArgsInput_1];
    return: UserDataConnection;
  };
  isUnique: {
    params: [args: ArgsInput_4Input];
    return: Maybe<ScalarsEnums['Boolean']>;
  };
  currentUser: {
    params: [args?: Maybe<ArgsInput_5Input>];
    return: UserNode;
  };
  transfers: {
    params: [args?: Maybe<ArgsInput_2>];
    return: Array<Transfer>;
  };
  passengers: {
    params: [args?: Maybe<ArgsInput_3>];
    return: Array<Passenger>;
  };
  cars: {
    params: [args?: Maybe<ArgsInput_4>];
    return: Array<Car>;
  };
}

export const MutationParamNames = {
  createTransfer: ['args'],
  bookTransfer: ['args'],
  assignDriver: ['transferId', 'driverId'],
  updateTransferState: ['transferId', 'state']
};
export const QueryParamNames = {
  user: ['args'],
  users: ['args'],
  usersByRole: ['args'],
  profiles: ['args'],
  userData: ['args'],
  isUnique: ['args'],
  currentUser: ['args'],
  transfers: ['args'],
  passengers: ['args'],
  cars: ['args']
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
    createTransfer(
      params: MutationTypes['createTransfer']['params']
    ): Parameters<Mutation['createTransfer']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['createTransfer']>[0]>(
        MutationParamNames['createTransfer'],
        params
      );
    },
    bookTransfer(
      params: MutationTypes['bookTransfer']['params']
    ): Parameters<Mutation['bookTransfer']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['bookTransfer']>[0]>(
        MutationParamNames['bookTransfer'],
        params
      );
    },
    assignDriver(
      params: MutationTypes['assignDriver']['params']
    ): Parameters<Mutation['assignDriver']>[0] {
      return convertParamsToArgsFn<Parameters<Mutation['assignDriver']>[0]>(
        MutationParamNames['assignDriver'],
        params
      );
    },
    updateTransferState(
      params: MutationTypes['updateTransferState']['params']
    ): Parameters<Mutation['updateTransferState']>[0] {
      return convertParamsToArgsFn<
        Parameters<Mutation['updateTransferState']>[0]
      >(MutationParamNames['updateTransferState'], params);
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
    profiles(
      params: QueryTypes['profiles']['params']
    ): Parameters<Query['profiles']>[0] {
      return convertParamsToArgsFn<Parameters<Query['profiles']>[0]>(
        QueryParamNames['profiles'],
        params
      );
    },
    userData(
      params: QueryTypes['userData']['params']
    ): Parameters<Query['userData']>[0] {
      return convertParamsToArgsFn<Parameters<Query['userData']>[0]>(
        QueryParamNames['userData'],
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
    },
    transfers(
      params: QueryTypes['transfers']['params']
    ): Parameters<Query['transfers']>[0] {
      return convertParamsToArgsFn<Parameters<Query['transfers']>[0]>(
        QueryParamNames['transfers'],
        params
      );
    },
    passengers(
      params: QueryTypes['passengers']['params']
    ): Parameters<Query['passengers']>[0] {
      return convertParamsToArgsFn<Parameters<Query['passengers']>[0]>(
        QueryParamNames['passengers'],
        params
      );
    },
    cars(params: QueryTypes['cars']['params']): Parameters<Query['cars']>[0] {
      return convertParamsToArgsFn<Parameters<Query['cars']>[0]>(
        QueryParamNames['cars'],
        params
      );
    }
  }
};
