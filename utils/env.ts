import Constants from "expo-constants";

export function environment(): "development" | "production" {
  const envStatus = Constants.manifest?.extra?.environment;
  if (envStatus) {
    return envStatus;
  } else {
    return "development";
  }
}

export function fsCollectionId(rootId: string) {
  return `${environment() === "development" ? "TEST-" : ""}${rootId}`;
}
