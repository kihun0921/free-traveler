import { defineConfig } from "vitest/config";

// Unit Test 범위: src 내부의 *.test.ts(x)/*.spec.ts(x)와 tests/unit만 실행한다.
// tests/e2e(Playwright)는 별도 실행 경로이므로 여기서 검색하지 않는다.
// 아직 실제 Unit Test 파일이 없는 단계이므로 passWithNoTests로 빈 스위트에서도 성공 종료한다.
export default defineConfig({
  test: {
    environment: "node",
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    passWithNoTests: true,
  },
});
