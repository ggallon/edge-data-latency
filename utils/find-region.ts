// Find invocation region
export function findRegion(vercelId: string | null) {
  const count = (vercelId.match(/::/g) || []).length;

  switch(count) {
    case 1:
      // global
      return vercelId.split("::")[0];
      break;
    case 2:
      // regional
      return vercelId.split("::")[1];
      break;
    default:
      return null
  }
}
