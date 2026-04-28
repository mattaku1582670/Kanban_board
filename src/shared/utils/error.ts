export function toErrorMessage(
  error: unknown,
  fallback = "処理に失敗しました。時間をおいて再試行してください。"
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
