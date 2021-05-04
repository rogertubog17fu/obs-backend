// If you have enums that belongs to the "src/core" directory that you want to
// expose to the GraphQL Schema, just export them directly here and it'll
// be resolved as per configuration from "src/graphql/schema.ts".

export {
  GameStatus,
  BetSides,
  UserType,
  SortDirection
} from '@app/core/enums';
