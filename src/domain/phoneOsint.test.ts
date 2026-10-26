import { describe, expect, it } from "vitest";

import {
  PHONE_OSINT_CATALOG,
  copyUrlsPayload,
  createAuditEvent,
  createOpenCategoryPlan,
  createOpenSelectedPlan,
  createSelectionState,
  normalizePhoneInput,
  selectAllTools,
  selectCategoryTools,
  toggleToolSelection,
  totalCatalogToolCount,
  unselectAllTools,
  updateNotes,
} from "./phoneOsint.js";

const normalized = (value: string) => {
  const result = normalizePhoneInput(value);
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
};

describe("phone input normalization and validation", () => {
  it("normalizes exact, digits, and canonical variants deterministically", () => {
    const result = normalizePhoneInput(" +1 (202) 555-0175 ");
    expect(result).toEqual({
      ok: true,
      value: {
        input: " +1 (202) 555-0175 ",
        exactPhone: "+1 (202) 555-0175",
        digitsPhone: "12025550175",
        canonicalPhone: "+12025550175",
      },
    });
  });

  it("rejects malformed or out-of-range inputs", () => {
    expect(normalizePhoneInput("   ")).toMatchObject({
      ok: false,
      error: { code: "empty_input" },
    });
    expect(normalizePhoneInput("abc")).toMatchObject({
      ok: false,
      error: { code: "missing_digits" },
    });
    expect(normalizePhoneInput("12+34")).toMatchObject({
      ok: false,
      error: { code: "invalid_plus_position" },
    });
    expect(normalizePhoneInput("12345")).toMatchObject({
      ok: false,
      error: { code: "invalid_digits_length" },
    });
  });
});

describe("catalog model and route generation", () => {
  it("keeps stable tool counts and emits deterministic routes", () => {
    expect(totalCatalogToolCount(PHONE_OSINT_CATALOG)).toBe(10);

    const state = createSelectionState([
      "exact-phone-search",
      "phone-without-symbols",
      "business-context",
      "whatsapp-context",
    ]);
    const plan = createOpenSelectedPlan(
      normalized("+44 20 7946 0018"),
      state,
      false,
    );

    expect(plan.mode).toBe("parallel");
    expect(plan.entries.map((entry) => entry.url)).toEqual([
      "https://www.google.com/search?q=%22%2B44%2020%207946%200018%22",
      "https://www.google.com/search?q=%22442079460018%22",
      "https://www.google.com/search?q=%22%2B442079460018%22+business+contact+support",
      "https://www.google.com/search?q=%22%2B442079460018%22+site%3Awa.me+OR+site%3Aapi.whatsapp.com",
    ]);
  });
});

describe("selection workflows", () => {
  it("supports select all, unselect all, and category selection", () => {
    const initial = createSelectionState([]);
    const all = selectAllTools(PHONE_OSINT_CATALOG, initial);
    expect(all.selectedToolIds).toHaveLength(10);

    const none = unselectAllTools(all);
    expect(none.selectedToolIds).toEqual([]);

    const category = selectCategoryTools(
      "phone-osint",
      none,
      PHONE_OSINT_CATALOG,
    );
    expect(category.selectedToolIds).toHaveLength(10);
  });

  it("toggles individual tools in stable catalog order", () => {
    const state = createSelectionState([]);
    const one = toggleToolSelection(
      "whatsapp-context",
      state,
      PHONE_OSINT_CATALOG,
    );
    const two = toggleToolSelection(
      "exact-phone-search",
      one,
      PHONE_OSINT_CATALOG,
    );
    expect(two.selectedToolIds).toEqual([
      "exact-phone-search",
      "whatsapp-context",
    ]);
  });
});

describe("open and copy workflows", () => {
  it("uses sequential mode for mobile-safe launch behavior", () => {
    const state = createSelectionState([
      "exact-phone-search",
      "business-context",
    ]);
    const plan = createOpenSelectedPlan(
      normalized("+12025550175"),
      state,
      true,
    );

    expect(plan.mode).toBe("sequential");
    expect(plan.entries.map((entry) => entry.sequence)).toEqual([1, 2]);
    expect(plan.consentRequired).toBe(true);
    expect(plan.sensitiveTools).toEqual([
      "Exact phone number",
      "Phone with business context",
    ]);
  });

  it("copies URLs in launch order and supports open-all-in-category", () => {
    const categoryPlan = createOpenCategoryPlan(
      "phone-osint",
      normalized("+12025550175"),
      false,
      PHONE_OSINT_CATALOG,
    );
    expect(categoryPlan.entries).toHaveLength(10);

    const payload = copyUrlsPayload(categoryPlan);
    expect(payload.split("\n")).toHaveLength(10);
    expect(payload).toContain(
      "https://www.google.com/maps/search/%2B12025550175",
    );
  });
});

describe("notes and privacy-preserving audit hooks", () => {
  it("tracks note context without exposing full phone numbers", () => {
    const state = updateNotes(
      "Caller confirmed this is authorized defensive research.",
      createSelectionState(["exposure-awareness", "scam-context"]),
    );
    const audit = createAuditEvent(
      "open_selected",
      normalized("+1 (202) 555-0175"),
      state.selectedToolIds,
      state.notes,
      new Date("2026-10-26T00:00:00.000Z"),
    );

    expect(audit).toMatchObject({
      action: "open_selected",
      selectedToolCount: 2,
      sensitiveToolCount: 2,
      notesLength: state.notes.length,
      phoneFingerprint: {
        digitCount: 11,
        last4: "0175",
        hasInternationalPrefix: true,
      },
      createdAt: "2026-10-26T00:00:00.000Z",
    });
    expect(JSON.stringify(audit)).not.toContain("12025550175");
  });
});
