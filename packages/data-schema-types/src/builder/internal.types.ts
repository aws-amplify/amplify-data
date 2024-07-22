/**
 * references IAmplifyGraphqlDefinition from:
 * https://github.com/aws-amplify/amplify-category-api/blob/4c0ea253a0bae51f775383929ba4748593185bc1/packages/amplify-graphql-api-construct/src/types.ts#L491-L503
 *
 * function slots is any'd for now. Will add actual type when we add support for this feature
 */

export type PathEntry = { relativePath: string; importLine: string };

export type SubnetAZ = {
  subnetId: string;
  availabilityZone: string;
};

export type VpcConfig = {
  vpcId: string;
  securityGroupIds: string[];
  subnetAvailabilityZones: SubnetAZ[];
};

/**
 * Importing the full objects from @aws-amplify/plugin-types
 * more than doubles dev env runtime. This type replacement
 * will contain the content for config without the negative
 * side-effects. We may need to re-approach if customers interact
 * with these programmatically to avoid forcing narrowing.
 */
export type BackendSecret = {
  resolve: (scope: any, backendIdentifier: any) => any;
  resolvePath: (backendIdentifier: any) => any;
};
