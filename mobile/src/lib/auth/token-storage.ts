import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "finmate.access-token";

export function getStoredAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export function setStoredAccessToken(token: string) {
  return SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export function clearStoredAccessToken() {
  return SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}
