/**
 * @file i18nStore.test.ts
 * @description 国际化状态管理单元测试 — 语言切换、翻译键覆盖、fallback 机制
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-15
 * @updated 2026-03-15
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags test, unit, i18n, internationalization
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useI18nStore, supportedLocales, type Locale } from "../../stores/i18nStore";

describe("i18nStore", () => {
  beforeEach(() => {
    useI18nStore.getState().setLocale("zh-CN");
  });

  /* ─── 基础状态 ─── */
  describe("基础状态", () => {
    it("默认语言应为 zh-CN", () => {
      const { locale } = useI18nStore.getState();
      expect(locale).toBe("zh-CN");
    });

    it("supportedLocales 应包含中英文", () => {
      expect(supportedLocales).toHaveLength(2);
      expect(supportedLocales.map((l) => l.id)).toContain("zh-CN");
      expect(supportedLocales.map((l) => l.id)).toContain("en-US");
    });
  });

  /* ─── 语言切换 ─── */
  describe("语言切换", () => {
    it("setLocale 应切换到英文", () => {
      useI18nStore.getState().setLocale("en-US");
      expect(useI18nStore.getState().locale).toBe("en-US");
    });

    it("setLocale 应切换回中文", () => {
      useI18nStore.getState().setLocale("en-US");
      useI18nStore.getState().setLocale("zh-CN");
      expect(useI18nStore.getState().locale).toBe("zh-CN");
    });
  });

  /* ─── 翻译函数 ─── */
  describe("翻译函数", () => {
    it("t() 应返回中文翻译", () => {
      const { t } = useI18nStore.getState();
      expect(t("common.confirm")).toBe("确定");
      expect(t("common.cancel")).toBe("取消");
      expect(t("common.save")).toBe("保存");
    });

    it("切换到英文后 t() 应返回英文翻译", () => {
      useI18nStore.getState().setLocale("en-US");
      const { t } = useI18nStore.getState();
      expect(t("common.confirm")).toBe("Confirm");
      expect(t("common.cancel")).toBe("Cancel");
    });

    it("品牌名称应正确翻译", () => {
      const { t } = useI18nStore.getState();
      expect(t("brand.name")).toBe("YYC³ AI Code");
    });
  });

  /* ─── 翻译键完整性 ─── */
  describe("翻译键完整性", () => {
    it("中英文语言包应包含相同的键集合", () => {
      // 切换到中文获取键
      useI18nStore.getState().setLocale("zh-CN");
      const zhT = useI18nStore.getState().t;
      useI18nStore.getState().setLocale("en-US");
      const enT = useI18nStore.getState().t;

      const keysToCheck = [
        "common.confirm", "common.cancel", "common.save",
        "common.delete", "common.edit", "common.loading",
        "brand.name", "nav.home", "nav.workbench",
      ];

      keysToCheck.forEach((key) => {
        const zhValue = zhT(key as any);
        const enValue = enT(key as any);
        expect(zhValue).toBeTruthy();
        expect(enValue).toBeTruthy();
        // 不应返回键名本身 (表示缺失翻译)
        expect(zhValue).not.toBe(key);
        expect(enValue).not.toBe(key);
      });
    });
  });
});
