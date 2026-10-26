import { err, ok, type Result } from "./result.js";

export const PHONE_OSINT_SCOPE_NOTICE =
  "Use only for lawful, authorized, ethical, and data-minimized research.";

export const PHONE_OSINT_USAGE_NOTES = [
  "Allow pop-ups for this page when opening multiple tools.",
  "On mobile, open tools one by one to reduce popup blocking.",
  "External search results are not proof. Verify source context, date, author, repeatability, and false-match risk.",
  "Breach, face-search, crypto, and security reputation routes are for authorized defensive, personal, or clearly permitted research.",
] as const;

export const PHONE_EVIDENCE_QUALITY_CHECKLIST = [
  "Check source context and original publication venue.",
  "Check publication date and update recency.",
  "Check author identity and expertise.",
  "Check repeatability across independent sources.",
  "Check false-match risk before making conclusions.",
] as const;

export type PhoneRouteKind =
  | "exact_phone"
  | "digits_phone"
  | "business_phone"
  | "whatsapp_phone";

export interface PhoneRouteTemplate {
  readonly id: string;
  readonly label: string;
  readonly kind: PhoneRouteKind;
  readonly template: string;
  readonly sensitive: boolean;
  readonly highSignal: boolean;
}

export interface PhoneOsintTool {
  readonly id: string;
  readonly label: string;
  readonly categoryId: string;
  readonly sensitive: boolean;
  readonly highSignal: boolean;
  readonly routes: readonly PhoneRouteTemplate[];
}

export interface PhoneOsintCategory {
  readonly id: string;
  readonly label: string;
  readonly tools: readonly PhoneOsintTool[];
}

export interface OsintCategorySummary {
  readonly id: string;
  readonly label: string;
  readonly toolCount: number;
}

export const PHONE_OSINT_CATEGORY_SUMMARIES: readonly OsintCategorySummary[] = [
  { id: "search-engines", label: "Search Engines", toolCount: 19 },
  { id: "advanced-operators", label: "Advanced Operators", toolCount: 19 },
  { id: "username-osint", label: "Username OSINT", toolCount: 44 },
  { id: "email-osint", label: "Email OSINT", toolCount: 23 },
  {
    id: "breach-exposure-awareness",
    label: "Breaches & Exposure Awareness",
    toolCount: 18,
  },
  { id: "phone-osint", label: "Phone OSINT", toolCount: 17 },
  {
    id: "images-face-reverse-image",
    label: "Images, Face & Reverse Image",
    toolCount: 27,
  },
  {
    id: "image-metadata-media-verification",
    label: "Image Metadata & Media Verification",
    toolCount: 15,
  },
  { id: "video-osint", label: "Video OSINT", toolCount: 12 },
  {
    id: "maps-geoint-geolocation",
    label: "Maps, GEOINT & Geolocation",
    toolCount: 22,
  },
  {
    id: "aviation-maritime-transport",
    label: "Aviation, Maritime & Transport",
    toolCount: 14,
  },
  {
    id: "domain-website-osint",
    label: "Domain & Website OSINT",
    toolCount: 23,
  },
  { id: "dns-certificates", label: "DNS & Certificates", toolCount: 19 },
  {
    id: "threat-intel-reputation",
    label: "Threat Intel & Reputation",
    toolCount: 19,
  },
] as const;

const PHONE_CATEGORY_ID = "phone-osint";

const PHONE_OSINT_TOOLS: readonly PhoneOsintTool[] = [
  {
    id: "exact-phone-search",
    label: "Exact phone number",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: true,
    routes: [
      {
        id: "exact-google",
        label: "Exact phone in Google",
        kind: "exact_phone",
        template: "https://www.google.com/search?q=%22{exact_phone}%22",
        sensitive: true,
        highSignal: true,
      },
    ],
  },
  {
    id: "phone-without-symbols",
    label: "Phone number without symbols",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: false,
    routes: [
      {
        id: "digits-google",
        label: "Digits-only in Google",
        kind: "digits_phone",
        template: "https://www.google.com/search?q=%22{digits_phone}%22",
        sensitive: true,
        highSignal: false,
      },
    ],
  },
  {
    id: "business-context",
    label: "Phone with business context",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: true,
    routes: [
      {
        id: "business-google",
        label: "Business context in Google",
        kind: "business_phone",
        template:
          "https://www.google.com/search?q=%22{business_phone}%22+business+contact+support",
        sensitive: true,
        highSignal: true,
      },
    ],
  },
  {
    id: "whatsapp-context",
    label: "Phone with WhatsApp context",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: true,
    routes: [
      {
        id: "wa-google",
        label: "WhatsApp context in Google",
        kind: "whatsapp_phone",
        template:
          "https://www.google.com/search?q=%22{whatsapp_phone}%22+site%3Awa.me+OR+site%3Aapi.whatsapp.com",
        sensitive: true,
        highSignal: true,
      },
    ],
  },
  {
    id: "maps-lookup",
    label: "Maps and places context",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: false,
    highSignal: false,
    routes: [
      {
        id: "maps-google",
        label: "Google Maps",
        kind: "business_phone",
        template: "https://www.google.com/maps/search/{business_phone}",
        sensitive: false,
        highSignal: false,
      },
    ],
  },
  {
    id: "scam-context",
    label: "Scam context",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: true,
    routes: [
      {
        id: "scam-google",
        label: "Scam reports in Google",
        kind: "digits_phone",
        template:
          "https://www.google.com/search?q=%22{digits_phone}%22+scam+fraud+report",
        sensitive: true,
        highSignal: true,
      },
    ],
  },
  {
    id: "documents-context",
    label: "Document context",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: false,
    routes: [
      {
        id: "docs-google",
        label: "Docs and files in Google",
        kind: "digits_phone",
        template:
          "https://www.google.com/search?q=%22{digits_phone}%22+filetype%3Apdf+OR+filetype%3Adoc",
        sensitive: true,
        highSignal: false,
      },
    ],
  },
  {
    id: "messaging-clues",
    label: "Messaging clues",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: true,
    routes: [
      {
        id: "telegram-google",
        label: "Telegram clues",
        kind: "digits_phone",
        template:
          "https://www.google.com/search?q=%22{digits_phone}%22+telegram+OR+t.me",
        sensitive: true,
        highSignal: true,
      },
    ],
  },
  {
    id: "social-context",
    label: "Social profile context",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: false,
    routes: [
      {
        id: "social-google",
        label: "Social context in Google",
        kind: "digits_phone",
        template:
          "https://www.google.com/search?q=%22{digits_phone}%22+site%3Ax.com+OR+site%3Afacebook.com+OR+site%3Alinkedin.com",
        sensitive: true,
        highSignal: false,
      },
    ],
  },
  {
    id: "exposure-awareness",
    label: "Exposure awareness",
    categoryId: PHONE_CATEGORY_ID,
    sensitive: true,
    highSignal: true,
    routes: [
      {
        id: "exposure-google",
        label: "Exposure awareness in Google",
        kind: "digits_phone",
        template:
          "https://www.google.com/search?q=%22{digits_phone}%22+breach+dump+paste",
        sensitive: true,
        highSignal: true,
      },
    ],
  },
] as const;

export const PHONE_OSINT_CATALOG: readonly PhoneOsintCategory[] = [
  {
    id: PHONE_CATEGORY_ID,
    label: "Phone OSINT",
    tools: PHONE_OSINT_TOOLS,
  },
] as const;

export interface NormalizedPhoneInput {
  readonly input: string;
  readonly exactPhone: string;
  readonly digitsPhone: string;
  readonly canonicalPhone: string;
}

export interface PhoneInputValidationError {
  readonly code:
    | "empty_input"
    | "missing_digits"
    | "invalid_digits_length"
    | "invalid_plus_position";
  readonly message: string;
}

const collapseWhitespace = (value: string): string => value.trim().replace(/\s+/gu, " ");

export const normalizePhoneInput = (
  input: string,
): Result<NormalizedPhoneInput, PhoneInputValidationError> => {
  const exactPhone = collapseWhitespace(input);
  if (exactPhone.length === 0)
    return err({
      code: "empty_input",
      message: "Phone input is required.",
    });

  const plusCount = [...exactPhone].filter((character) => character === "+").length;
  if (plusCount > 1 || (plusCount === 1 && !exactPhone.startsWith("+")))
    return err({
      code: "invalid_plus_position",
      message: "Plus sign is only allowed at the start of the phone input.",
    });

  const digitsPhone = exactPhone.replace(/\D+/gu, "");
  if (digitsPhone.length === 0)
    return err({
      code: "missing_digits",
      message: "Phone input must include at least one digit.",
    });

  if (digitsPhone.length < 7 || digitsPhone.length > 15)
    return err({
      code: "invalid_digits_length",
      message: "Phone input must include 7 to 15 digits after normalization.",
    });

  const canonicalPhone = exactPhone.startsWith("+")
    ? `+${digitsPhone}`
    : digitsPhone;
  return ok({
    input,
    exactPhone,
    digitsPhone,
    canonicalPhone,
  });
};

const routeValueByKind = (
  normalized: NormalizedPhoneInput,
  kind: PhoneRouteKind,
): string => {
  switch (kind) {
    case "exact_phone":
      return normalized.exactPhone;
    case "digits_phone":
      return normalized.digitsPhone;
    case "business_phone":
      return normalized.canonicalPhone;
    case "whatsapp_phone":
      return normalized.canonicalPhone;
  }
};

export interface PhoneToolRoute {
  readonly toolId: string;
  readonly toolLabel: string;
  readonly routeId: string;
  readonly routeLabel: string;
  readonly sensitive: boolean;
  readonly highSignal: boolean;
  readonly url: string;
}

const renderRouteTemplate = (
  template: string,
  normalized: NormalizedPhoneInput,
): string => {
  const routeValues = {
    exact_phone: normalized.exactPhone,
    digits_phone: normalized.digitsPhone,
    canonical_phone: normalized.canonicalPhone,
    business_phone: normalized.canonicalPhone,
    whatsapp_phone: normalized.canonicalPhone,
  } as const;

  return template.replace(
    /\{(exact_phone|digits_phone|canonical_phone|business_phone|whatsapp_phone)\}/gu,
    (_, placeholder: keyof typeof routeValues) =>
      encodeURIComponent(routeValues[placeholder]),
  );
};

export const categoryToolCount = (category: PhoneOsintCategory): number =>
  category.tools.length;

export const totalCatalogToolCount = (
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
): number => catalog.reduce((sum, category) => sum + categoryToolCount(category), 0);

const toolSortIndex = (
  catalog: readonly PhoneOsintCategory[],
): ReadonlyMap<string, number> => {
  const index = new Map<string, number>();
  let cursor = 0;
  for (const category of catalog) {
    for (const tool of category.tools) {
      index.set(tool.id, cursor);
      cursor += 1;
    }
  }
  return index;
};

const sortToolIds = (
  toolIds: readonly string[],
  catalog: readonly PhoneOsintCategory[],
): readonly string[] => {
  const index = toolSortIndex(catalog);
  return [...new Set(toolIds)]
    .filter((toolId) => index.has(toolId))
    .sort((left, right) => (index.get(left) ?? Number.MAX_SAFE_INTEGER) - (index.get(right) ?? Number.MAX_SAFE_INTEGER));
};

export const allCatalogTools = (
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
): readonly PhoneOsintTool[] => catalog.flatMap((category) => category.tools);

const toolsById = (
  catalog: readonly PhoneOsintCategory[],
): ReadonlyMap<string, PhoneOsintTool> => {
  const result = new Map<string, PhoneOsintTool>();
  for (const tool of allCatalogTools(catalog)) result.set(tool.id, tool);
  return result;
};

export interface PhoneOsintSelectionState {
  readonly selectedToolIds: readonly string[];
  readonly notes: string;
}

export const createSelectionState = (
  selectedToolIds: readonly string[] = allCatalogTools().map((tool) => tool.id),
  notes = "",
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
): PhoneOsintSelectionState => ({
  selectedToolIds: sortToolIds(selectedToolIds, catalog),
  notes,
});

export const selectAllTools = (
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
  state: PhoneOsintSelectionState = createSelectionState([], "", catalog),
): PhoneOsintSelectionState => ({
  ...state,
  selectedToolIds: allCatalogTools(catalog).map((tool) => tool.id),
});

export const unselectAllTools = (
  state: PhoneOsintSelectionState = createSelectionState(),
): PhoneOsintSelectionState => ({
  ...state,
  selectedToolIds: [],
});

export const selectCategoryTools = (
  categoryId: string,
  state: PhoneOsintSelectionState,
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
): PhoneOsintSelectionState => {
  const category = catalog.find((entry) => entry.id === categoryId);
  if (!category) return state;
  return {
    ...state,
    selectedToolIds: sortToolIds(
      [...state.selectedToolIds, ...category.tools.map((tool) => tool.id)],
      catalog,
    ),
  };
};

export const toggleToolSelection = (
  toolId: string,
  state: PhoneOsintSelectionState,
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
): PhoneOsintSelectionState => {
  const next = state.selectedToolIds.includes(toolId)
    ? state.selectedToolIds.filter((selected) => selected !== toolId)
    : [...state.selectedToolIds, toolId];
  return {
    ...state,
    selectedToolIds: sortToolIds(next, catalog),
  };
};

export const updateNotes = (
  notes: string,
  state: PhoneOsintSelectionState,
): PhoneOsintSelectionState => ({
  ...state,
  notes,
});

const routeForTool = (
  tool: PhoneOsintTool,
  normalized: NormalizedPhoneInput,
): readonly PhoneToolRoute[] =>
  tool.routes.map((route) => {
    const routeKindValue = routeValueByKind(normalized, route.kind);
    const url = renderRouteTemplate(
      route.template,
      route.kind === "exact_phone"
        ? normalized
        : {
            ...normalized,
            exactPhone: routeKindValue,
          },
    );
    return {
      toolId: tool.id,
      toolLabel: tool.label,
      routeId: route.id,
      routeLabel: route.label,
      sensitive: route.sensitive,
      highSignal: route.highSignal,
      url,
    };
  });

const selectedTools = (
  selectedToolIds: readonly string[],
  catalog: readonly PhoneOsintCategory[],
): readonly PhoneOsintTool[] => {
  const index = toolsById(catalog);
  return sortToolIds(selectedToolIds, catalog)
    .map((toolId) => index.get(toolId))
    .filter((tool): tool is PhoneOsintTool => tool !== undefined);
};

export interface OpenPlanEntry {
  readonly sequence: number;
  readonly toolId: string;
  readonly toolLabel: string;
  readonly url: string;
}

export interface PhoneOpenPlan {
  readonly mode: "parallel" | "sequential";
  readonly entries: readonly OpenPlanEntry[];
  readonly consentRequired: boolean;
  readonly consentMessage: string;
  readonly sensitiveTools: readonly string[];
}

const sensitiveTools = (tools: readonly PhoneOsintTool[]): readonly string[] =>
  tools.filter((tool) => tool.sensitive).map((tool) => tool.label);

export const createAuthorizedUsePrompt = (
  tools: readonly PhoneOsintTool[],
): string => {
  const sensitive = sensitiveTools(tools);
  if (sensitive.length === 0)
    return `${PHONE_OSINT_SCOPE_NOTICE} Confirm you are authorized before opening routes.`;
  return `${PHONE_OSINT_SCOPE_NOTICE} Sensitive tools selected: ${sensitive.join(", ")}. Confirm authorization before opening routes.`;
};

const openPlanFromTools = (
  tools: readonly PhoneOsintTool[],
  normalized: NormalizedPhoneInput,
  mobileSafeSequential: boolean,
): PhoneOpenPlan => {
  const routes = tools.flatMap((tool) => routeForTool(tool, normalized));
  return {
    mode: mobileSafeSequential ? "sequential" : "parallel",
    entries: routes.map((entry, index) => ({
      sequence: index + 1,
      toolId: entry.toolId,
      toolLabel: entry.toolLabel,
      url: entry.url,
    })),
    consentRequired: tools.some((tool) => tool.sensitive),
    consentMessage: createAuthorizedUsePrompt(tools),
    sensitiveTools: sensitiveTools(tools),
  };
};

export const createOpenSelectedPlan = (
  normalized: NormalizedPhoneInput,
  state: PhoneOsintSelectionState,
  mobileSafeSequential: boolean,
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
): PhoneOpenPlan =>
  openPlanFromTools(
    selectedTools(state.selectedToolIds, catalog),
    normalized,
    mobileSafeSequential,
  );

export const createOpenCategoryPlan = (
  categoryId: string,
  normalized: NormalizedPhoneInput,
  mobileSafeSequential: boolean,
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
): PhoneOpenPlan => {
  const category = catalog.find((entry) => entry.id === categoryId);
  return openPlanFromTools(category?.tools ?? [], normalized, mobileSafeSequential);
};

export const copyUrlsPayload = (plan: PhoneOpenPlan): string =>
  plan.entries.map((entry) => entry.url).join("\n");

export interface PhoneAuditEvent {
  readonly action: "open_selected" | "open_category" | "copy_urls";
  readonly toolIds: readonly string[];
  readonly selectedToolCount: number;
  readonly sensitiveToolCount: number;
  readonly notesLength: number;
  readonly phoneFingerprint: {
    readonly digitCount: number;
    readonly last4: string;
    readonly hasInternationalPrefix: boolean;
  };
  readonly createdAt: string;
}

export const createAuditEvent = (
  action: PhoneAuditEvent["action"],
  normalized: NormalizedPhoneInput,
  toolIds: readonly string[],
  notes: string,
  timestamp: Date = new Date(),
  catalog: readonly PhoneOsintCategory[] = PHONE_OSINT_CATALOG,
): PhoneAuditEvent => {
  const tools = selectedTools(toolIds, catalog);
  return {
    action,
    toolIds: tools.map((tool) => tool.id),
    selectedToolCount: tools.length,
    sensitiveToolCount: tools.filter((tool) => tool.sensitive).length,
    notesLength: notes.length,
    phoneFingerprint: {
      digitCount: normalized.digitsPhone.length,
      last4: normalized.digitsPhone.slice(-4),
      hasInternationalPrefix: normalized.canonicalPhone.startsWith("+"),
    },
    createdAt: timestamp.toISOString(),
  };
};
