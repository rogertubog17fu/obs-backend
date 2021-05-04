/* eslint-disable */
import { SortDirection } from '../src/graphql/enums/index';
import { UserType } from '../src/graphql/enums/index';
import { GameStatus } from '../src/graphql/enums/index';
import { BetSides } from '../src/graphql/enums/index';
import { FileUpload } from '../src/graphql/scalars/Upload.scalar';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IGraphQLContext } from '../src/graphql/index';
export type Maybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
  Date: Date;
  Time: Date;
  Upload: FileUpload;
  GUID: string;
  JSON: any;
};

export type GQL_Query = {
  __typename?: 'Query';
  /** @deprecated Field no longer supported */
  _authorizedOnlyQuery?: Maybe<Scalars['Boolean']>;
  /** @deprecated Field no longer supported */
  _dummy?: Maybe<Scalars['String']>;
  /** @deprecated Field no longer supported */
  _sampleDateScalar?: Maybe<Scalars['Date']>;
  /** @deprecated Field no longer supported */
  _sampleDateTimeScalar?: Maybe<Scalars['DateTime']>;
  /** @deprecated Field no longer supported */
  _sampleTimeScalar?: Maybe<Scalars['Time']>;
  node?: Maybe<GQL_Node>;
};


export type GQL_QueryNodeArgs = {
  id: Scalars['GUID'];
};

export type GQL_Node = {
  id: Scalars['GUID'];
};

export type GQL_PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export { SortDirection };

export type GQL_File = {
  __typename?: 'File';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
};

export type GQL_Mutation = {
  __typename?: 'Mutation';
  /** @deprecated Field no longer supported */
  _dummy?: Maybe<Scalars['String']>;
  multipleUpload: Array<GQL_File>;
  singleUpload: GQL_File;
};


export type GQL_MutationMultipleUploadArgs = {
  files: Array<Scalars['Upload']>;
};


export type GQL_MutationSingleUploadArgs = {
  file: Scalars['Upload'];
};

export type GQL_Subscription = {
  __typename?: 'Subscription';
  /** @deprecated Field no longer supported */
  _dummy?: Maybe<GQL_DummySubscriptionPayload>;
};

export type GQL_DummySubscriptionPayload = {
  __typename?: 'DummySubscriptionPayload';
  dummy?: Maybe<Scalars['String']>;
};







export type GQL_User = GQL_Node & {
  __typename?: 'User';
  id: Scalars['GUID'];
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  userType?: Maybe<UserType>;
  permissions?: Maybe<Scalars['JSON']>;
};

export { UserType };

export { GameStatus };

export { BetSides };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GQL_ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Node: GQL_ResolversTypes['User'];
  PageInfo: ResolverTypeWrapper<GQL_PageInfo>;
  SortDirection: SortDirection;
  File: ResolverTypeWrapper<GQL_File>;
  Mutation: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  DummySubscriptionPayload: ResolverTypeWrapper<GQL_DummySubscriptionPayload>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  GUID: ResolverTypeWrapper<Scalars['GUID']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  User: ResolverTypeWrapper<GQL_User>;
  UserType: UserType;
  GameStatus: GameStatus;
  BetSides: BetSides;
};

/** Mapping between all available schema types and the resolvers parents */
export type GQL_ResolversParentTypes = {
  Query: {};
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  Node: GQL_ResolversParentTypes['User'];
  PageInfo: GQL_PageInfo;
  File: GQL_File;
  Mutation: {};
  Subscription: {};
  DummySubscriptionPayload: GQL_DummySubscriptionPayload;
  DateTime: Scalars['DateTime'];
  Date: Scalars['Date'];
  Time: Scalars['Time'];
  Upload: Scalars['Upload'];
  GUID: Scalars['GUID'];
  JSON: Scalars['JSON'];
  User: GQL_User;
};

export type GQL_QueryResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['Query'] = GQL_ResolversParentTypes['Query']> = {
  _authorizedOnlyQuery?: Resolver<Maybe<GQL_ResolversTypes['Boolean']>, ParentType, ContextType>;
  _dummy?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  _sampleDateScalar?: Resolver<Maybe<GQL_ResolversTypes['Date']>, ParentType, ContextType>;
  _sampleDateTimeScalar?: Resolver<Maybe<GQL_ResolversTypes['DateTime']>, ParentType, ContextType>;
  _sampleTimeScalar?: Resolver<Maybe<GQL_ResolversTypes['Time']>, ParentType, ContextType>;
  node?: Resolver<Maybe<GQL_ResolversTypes['Node']>, ParentType, ContextType, RequireFields<GQL_QueryNodeArgs, 'id'>>;
};

export type GQL_NodeResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['Node'] = GQL_ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'User', ParentType, ContextType>;
  id?: Resolver<GQL_ResolversTypes['GUID'], ParentType, ContextType>;
};

export type GQL_PageInfoResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['PageInfo'] = GQL_ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<GQL_ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<GQL_ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQL_SortDirectionResolvers = EnumResolverSignature<{ ASC?: any, DESC?: any }, GQL_ResolversTypes['SortDirection']>;

export type GQL_FileResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['File'] = GQL_ResolversParentTypes['File']> = {
  filename?: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  encoding?: Resolver<GQL_ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQL_MutationResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['Mutation'] = GQL_ResolversParentTypes['Mutation']> = {
  _dummy?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  multipleUpload?: Resolver<Array<GQL_ResolversTypes['File']>, ParentType, ContextType, RequireFields<GQL_MutationMultipleUploadArgs, 'files'>>;
  singleUpload?: Resolver<GQL_ResolversTypes['File'], ParentType, ContextType, RequireFields<GQL_MutationSingleUploadArgs, 'file'>>;
};

export type GQL_SubscriptionResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['Subscription'] = GQL_ResolversParentTypes['Subscription']> = {
  _dummy?: SubscriptionResolver<Maybe<GQL_ResolversTypes['DummySubscriptionPayload']>, "_dummy", ParentType, ContextType>;
};

export type GQL_DummySubscriptionPayloadResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['DummySubscriptionPayload'] = GQL_ResolversParentTypes['DummySubscriptionPayload']> = {
  dummy?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GQL_DateTimeScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface GQL_DateScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface GQL_TimeScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface GQL_UploadScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export interface GQL_GuidScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['GUID'], any> {
  name: 'GUID';
}

export interface GQL_JsonScalarConfig extends GraphQLScalarTypeConfig<GQL_ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type GQL_UserResolvers<ContextType = IGraphQLContext, ParentType extends GQL_ResolversParentTypes['User'] = GQL_ResolversParentTypes['User']> = {
  id?: Resolver<GQL_ResolversTypes['GUID'], ParentType, ContextType>;
  username?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<GQL_ResolversTypes['String']>, ParentType, ContextType>;
  userType?: Resolver<Maybe<GQL_ResolversTypes['UserType']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<GQL_ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GQL_UserTypeResolvers = EnumResolverSignature<{ OPERATOR?: any, CASHIER?: any, PLAYER?: any, ADMIN?: any, MANAGER?: any }, GQL_ResolversTypes['UserType']>;

export type GQL_GameStatusResolvers = EnumResolverSignature<{ OPEN?: any, CLOSE?: any, FINISHED?: any, REVERSE?: any, CANCEL?: any }, GQL_ResolversTypes['GameStatus']>;

export type GQL_BetSidesResolvers = EnumResolverSignature<{ MERON?: any, WALA?: any, DRAW?: any }, GQL_ResolversTypes['BetSides']>;

export type GQL_Resolvers<ContextType = IGraphQLContext> = {
  Query?: GQL_QueryResolvers<ContextType>;
  Node?: GQL_NodeResolvers<ContextType>;
  PageInfo?: GQL_PageInfoResolvers<ContextType>;
  SortDirection?: GQL_SortDirectionResolvers;
  File?: GQL_FileResolvers<ContextType>;
  Mutation?: GQL_MutationResolvers<ContextType>;
  Subscription?: GQL_SubscriptionResolvers<ContextType>;
  DummySubscriptionPayload?: GQL_DummySubscriptionPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  Time?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  GUID?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  User?: GQL_UserResolvers<ContextType>;
  UserType?: GQL_UserTypeResolvers;
  GameStatus?: GQL_GameStatusResolvers;
  BetSides?: GQL_BetSidesResolvers;
};


