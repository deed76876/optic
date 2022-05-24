import { ParseOpenAPIResult, sourcemapReader } from '@useoptic/openapi-io';
import {
  factsToChangelog,
  IChange,
  ResultWithSourcemap,
  ChangeType,
  OpenAPIV3,
  IFact,
  OpenAPITraverser,
} from '@useoptic/openapi-utilities';
import { RuleRunner, SpectralInput } from '../../types';

const packageJson = require('../../../../package.json');

const traverseSpec = (jsonSpec: OpenAPIV3.Document): IFact[] => {
  const currentTraverser = new OpenAPITraverser();

  currentTraverser.traverse(jsonSpec);

  return [...currentTraverser.facts()];
};

export const generateSpecResults = async (
  checkService: RuleRunner,
  from: ParseOpenAPIResult & { isEmptySpec: boolean },
  to: ParseOpenAPIResult & { isEmptySpec: boolean },
  context: any,
  spectralConfig?: SpectralInput
): Promise<{
  changes: IChange[];
  results: ResultWithSourcemap[];
  version: string;
}> => {
  const fromJsonLike = from.jsonLike;
  const toJsonLike = to.jsonLike;
  // If we have an empty spec, the facts should be [] - we keep the jsonLike values
  // in order to have a standard typing - we mainly use facts here to make assertions
  const currentFacts = from.isEmptySpec ? [] : traverseSpec(fromJsonLike);
  const nextFacts = to.isEmptySpec ? [] : traverseSpec(toJsonLike);

  const { findFileAndLines: findFileAndLinesFromBefore } = sourcemapReader(
    from.sourcemap
  );
  const { findFileAndLines: findFileAndLinesFromAfter } = sourcemapReader(
    to.sourcemap
  );

  const changes = factsToChangelog(currentFacts, nextFacts);
  const changesWithSourcemap: IChange[] = await Promise.all(
    changes.map(async (change: IChange): Promise<IChange> => {
      return {
        ...change,
        location: {
          ...change.location,
          sourcemap:
            change.changeType === ChangeType.Removed
              ? await findFileAndLinesFromBefore(change.location.jsonPath)
              : await findFileAndLinesFromAfter(change.location.jsonPath),
        },
      } as IChange;
    })
  );

  // TODO RA-V2 - remove the await from checkservice running
  const spectralResults =
    spectralConfig && checkService.runSpectralRules
      ? await checkService.runSpectralRules({
          ruleset: spectralConfig,
          nextJsonLike: toJsonLike,

          nextFacts: nextFacts,
        })
      : [];
  const ruleResults = await checkService.runRulesWithFacts({
    currentJsonLike: fromJsonLike,
    nextJsonLike: toJsonLike,
    currentFacts: currentFacts,
    nextFacts: nextFacts,
    changelog: changes,
    context,
  });

  const results = [...spectralResults, ...ruleResults];

  const resultsWithSourcemap = await Promise.all(
    results.map(async (result) => {
      return {
        ...result,
        // TODO RA-V2 - don't redo sourcemap generation
        sourcemap:
          (result.change as any).changeType === ChangeType.Removed
            ? await findFileAndLinesFromBefore(result.change.location.jsonPath)
            : await findFileAndLinesFromAfter(result.change.location.jsonPath),
      };
    })
  );
  return {
    changes: changesWithSourcemap,
    results: resultsWithSourcemap,
    version: packageJson.version,
  };
};