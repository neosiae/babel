import convertFunctionParams from "./params";
import convertFunctionRest from "./rest";

export default function(api, options) {
  const { loose } = options;
  return {
    visitor: {
      Function(path) {
        if (
          path.isArrowFunctionExpression() &&
          path
            .get("params")
            .some(param => param.isRestElement() || param.isAssignmentPattern())
        ) {
          // default/rest visitors require access to `arguments`, so it cannot be an arrow
          path.arrowFunctionToExpression();
        }

        const convertedRest = convertFunctionRest(path);
        const convertedParams = convertFunctionParams(path, loose);

        if (convertedRest || convertedParams) {
          // Manually reprocess this scope to ensure that the moved params are updated.
          path.scope.crawl();
        }
      },
    },
  };
}
