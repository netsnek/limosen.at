import { getContext, getEnv, requireAuth } from "@getcronit/pylon";
import validator from "validator";
import { UserService } from "./user.service";

// ---------- Domain ----------
export type TransferState = "pending" | "complete" | "canceled" | "terminated";

export interface TransferInput {
  rideDateISO: string;           // YYYY-MM-DD
  rideTime: string;              // HH:mm
  pickup: string;                // Abholort
  dropoff: string;               // Zielort
  roomOrName?: string;           // Zimmer/Name
  vehicle?: string;              // Wagen
  amountEUR?: number;            // Betrag
  payment?: string;              // Bezahlung
}

export interface TransferRow extends TransferInput {
  transferId: string;
  userId: string;
  customerName?: string;         // im Master protokolliert
  driver?: string;               // nur im Master
  state: TransferState;          // nur im Master
  requestedAtISO: string;
}

type SheetValue = string | number | boolean | null;

// ---------- Config ----------
const MASTER_TITLE = "AllRequests";
const MASTER_HEADERS = [
  "transferId",    // A
  "userId",        // B
  "customerName",  // C
  "rideDateISO",   // D
  "rideTime",      // E
  "pickup",        // F
  "dropoff",       // G
  "roomOrName",    // H
  "vehicle",       // I
  "amountEUR",     // J
  "payment",       // K
  "driver",        // L
  "state",         // M
  "requestedAtISO" // N
];

// Monatsblatt-Header (mit "Zimmer/Name"), plus versteckte Spalte J=transferId
const MONTH_HEADERS_VISIBLE = [
  "Nr.", "Datum", "Uhrzeit", "Abholort", "Zielort", "Zimmer/Name", "Wagen", "Betrag", "Bezahlung"
]; // A..I
const MONTH_TOTAL_COLUMNS = 9; // A..I

// ---------- Base64URL & PEM helpers ----------
const te = new TextEncoder();

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let b64: string;
  // @ts-ignore
  if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
    // @ts-ignore
    b64 = Buffer.from(bytes).toString("base64");
  } else {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    // @ts-ignore
    b64 = btoa(bin);
  }
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlEncodeJSON(obj: unknown): string {
  const bytes = te.encode(JSON.stringify(obj));
  return base64UrlEncodeBytes(bytes);
}

function pemToPkcs8(pem: string): ArrayBuffer {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  // @ts-ignore
  const raw = (typeof atob !== "undefined" ? atob(clean) : Buffer.from(clean, "base64").toString("binary"));
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}

// ---------- Google Auth (Service Account via WebCrypto RS256) ----------
async function googleAccessToken(): Promise<string> {
  const env: any = getEnv();
  const clientEmail = env?.GOOGLE_SHEETS_CLIENT_EMAIL;
  let privateKey = env?.GOOGLE_SHEETS_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error("Missing GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY");
  }
  privateKey = privateKey.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };

  const encodedHeader = base64UrlEncodeJSON(header);
  const encodedClaim  = base64UrlEncodeJSON(claim);
  const unsigned = `${encodedHeader}.${encodedClaim}`;

  const subtle = (globalThis.crypto && globalThis.crypto.subtle) as SubtleCrypto;
  if (!subtle) throw new Error("WebCrypto SubtleCrypto is not available in this runtime");

  const keyData = pemToPkcs8(privateKey);
  const cryptoKey = await subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, te.encode(unsigned));
  const jwt = `${unsigned}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    }).toString()
  });
  const j: any = await r.json();
  if (!r.ok) throw new Error(`Token error: ${r.status} ${JSON.stringify(j)}`);
  return j.access_token as string;
}

// ---------- Sheets helpers ----------
function spreadsheetId(): string {
  const env: any = getEnv();
  const id = env?.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("Missing GOOGLE_SHEETS_SPREADSHEET_ID");
  return id;
}

async function sheetsGet<T = any>(path: string, accessToken: string): Promise<T> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId()}${path}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!r.ok) throw new Error(`Sheets GET ${path}: ${await r.text()}`);
  return r.json();
}

async function sheetsPost<T = any>(path: string, body: any, accessToken: string): Promise<T> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId()}${path}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Sheets POST ${path}: ${await r.text()}`);
  return r.json();
}

async function sheetsPut<T = any>(path: string, body: any, accessToken: string): Promise<T> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId()}${path}`;
  const r = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Sheets PUT ${path}: ${await r.text()}`);
  return r.json();
}

async function sheetsBatchUpdate(requests: any[], accessToken: string) {
  await sheetsPost<unknown>(`:batchUpdate`, { requests }, accessToken);
}

async function valuesGet(rangeA1: string, accessToken: string) {
  return sheetsGet<{ values?: SheetValue[][] }>(
    `/values/${encodeURIComponent(rangeA1)}`,
    accessToken
  );
}

async function valuesUpdate(
  rangeA1: string,
  values: SheetValue[][],
  accessToken: string,
  valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED"
) {
  return sheetsPut(
    `/values/${encodeURIComponent(rangeA1)}?valueInputOption=${valueInputOption}`,
    { values, range: rangeA1, majorDimension: "ROWS" },
    accessToken
  );
}

async function valuesAppend(
  rangeA1: string,
  values: SheetValue[][],
  accessToken: string,
  valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED"
) {
  return sheetsPost(
    `/values/${encodeURIComponent(rangeA1)}:append?insertDataOption=INSERT_ROWS&valueInputOption=${valueInputOption}`,
    { values, majorDimension: "ROWS" },
    accessToken
  );
}

async function spreadsheetSheets(accessToken: string) {
  return sheetsGet<{ sheets?: { properties: { sheetId: number; title: string; index: number } }[] }>(
    `?fields=sheets.properties`,
    accessToken
  );
}

async function ensureSheet(title: string, accessToken: string) {
  const { sheets } = await spreadsheetSheets(accessToken);
  const exists = sheets?.some(s => s.properties.title === title);
  if (!exists) {
    await sheetsBatchUpdate([{ addSheet: { properties: { title } } }], accessToken);
  }
}

async function sheetIdByTitle(title: string, accessToken: string): Promise<number> {
  const { sheets } = await spreadsheetSheets(accessToken);
  const s = sheets?.find(s => s.properties.title === title);
  if (!s) throw new Error(`Sheet not found: ${title}`);
  return s.properties.sheetId;
}

function colLetter(idx1: number): string {
  let s = "";
  let n = idx1;
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// Spreadsheet locale → formula arg separator
async function getFormulaArgSep(accessToken: string): Promise<"," | ";"> {
  const meta = await sheetsGet<{ properties?: { locale?: string } }>(`?fields=properties.locale`, accessToken);
  const loc = (meta?.properties?.locale || "en_US").toLowerCase();
  const useSemi = /de|at|fr|it|es|nl|pl|pt|tr|ru|cz|cs|sk|hu|ro|bg|hr|sr|sl|el|gr|da|no|sv|fi|uk|ua|ar/.test(loc);
  return useSemi ? ";" : ",";
}

function escQueryString(s: string): string {
  return s.replace(/'/g, "''");
}

// ---------- Master bootstrapping ----------
async function ensureMaster(accessToken: string) {
  await ensureSheet(MASTER_TITLE, accessToken);
  const headerRange = `${MASTER_TITLE}!A1:${colLetter(MASTER_HEADERS.length)}1`;
  const existing = await valuesGet(headerRange, accessToken);
  const hasHeaders = !!existing.values && existing.values[0]?.length >= MASTER_HEADERS.length;
  if (!hasHeaders) {
    await valuesUpdate(headerRange, [MASTER_HEADERS], accessToken);
  }
}

// ---------- Mapping ----------
function rowToTransfer(row: SheetValue[]): TransferRow | null {
  if (!row || row.length < MASTER_HEADERS.length) return null;
  const [
    transferId, userId, customerName, rideDateISO, rideTime, pickup, dropoff,
    roomOrName, vehicle, amountEUR, payment, driver, state, requestedAtISO
  ] = row.map(v => (v ?? "") as string);

  return {
    transferId,
    userId,
    customerName,
    rideDateISO,
    rideTime,
    pickup,
    dropoff,
    roomOrName,
    vehicle,
    amountEUR: amountEUR ? Number(amountEUR) : undefined,
    payment,
    driver,
    state: state as TransferState,
    requestedAtISO
  };
}

function transferToMasterRow(t: TransferRow): SheetValue[] {
  return [
    t.transferId,
    t.userId,
    t.customerName ?? "",
    t.rideDateISO,
    t.rideTime,
    t.pickup,
    t.dropoff,
    t.roomOrName ?? "",
    t.vehicle ?? "",
    typeof t.amountEUR === "number" ? t.amountEUR : "",
    t.payment ?? "",
    t.driver ?? "",
    t.state,
    t.requestedAtISO
  ];
}

// ---------- Utilities ----------
function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  (globalThis.crypto as Crypto).getRandomValues(arr);
  let out = "";
  for (let i = 0; i < arr.length; i++) out += arr[i].toString(16).padStart(2, "0");
  return out;
}

function newTransferId(): string {
  const ts = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14); // YYYYMMDDHHmmss
  const rand = randomHex(3);
  return `tr_${ts}_${rand}`;
}

function monthKeyFromISO(dateISO: string): string {
  return dateISO.slice(0, 7); // YYYY-MM
}

function germanMonthLabel(yyyymm: string) {
  const [yStr, mStr] = yyyymm.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const names = ["JÄNNER","FEBRUAR","MÄRZ","APRIL","MAI","JUNI","JULI","AUGUST","SEPTEMBER","OKTOBER","NOVEMBER","DEZEMBER"];
  return `${names[m - 1]} ${y}`;
}

function monthSheetTitle(userId: string, yyyymm: string) {
  return `USR_${userId}_${yyyymm}`;
}

// ---------- Styling helpers (colors) ----------
const COLOR = {
  black: { red: 0, green: 0, blue: 0 },
  white: { red: 1, green: 1, blue: 1 },
  headerGray: { red: 0.953, green: 0.957, blue: 0.965 },    // #F3F4F6
  lightGreen: { red: 0.8196, green: 0.9804, blue: 0.8980 }, // #D1FAE5
  lightBlue:  { red: 0.859, green: 0.918, blue: 0.996 },    // #DBEAFE
  midOrange:  { red: 0.992, green: 0.729, blue: 0.455 }     // #FDBA74
};

// ----- helpers for master lookups -----
async function findMasterRowIndexByTransferId(
  transferId: string,
  accessToken: string
): Promise<number | null> {
  const range = `${MASTER_TITLE}!A2:A`;
  const { values } = await valuesGet(range, accessToken);
  if (!values) return null;
  for (let i = 0; i < values.length; i++) {
    if ((values[i][0] as string) === transferId) return i + 2; // A2 => row 2
  }
  return null;
}

async function getMasterRowWithIndex(
  transferId: string,
  accessToken: string
): Promise<{ rowIdx: number | null; row: TransferRow | null }> {
  const idx = await findMasterRowIndexByTransferId(transferId, accessToken);
  if (!idx) return { rowIdx: null, row: null };
  const range = `${MASTER_TITLE}!A${idx}:${colLetter(MASTER_HEADERS.length)}${idx}`;
  const { values } = await valuesGet(range, accessToken);
  const row = values?.[0] ? rowToTransfer(values[0]) : null;
  return { rowIdx: idx, row };
}

// ---------- Monthly helpers ----------
async function getMonthlyDataCount(sheetTitle: string, accessToken: string): Promise<number> {
  const { values } = await valuesGet(`${sheetTitle}!J4:J`, accessToken);
  return values?.length ? values.filter(r => String(r?.[0] ?? "") !== "").length : 0;
}

async function findMonthlyRowIndexByTransferId(
  sheetTitle: string,
  transferId: string,
  accessToken: string
): Promise<number | null> {
  const { values } = await valuesGet(`${sheetTitle}!J4:J`, accessToken);
  if (!values) return null;
  for (let i = 0; i < values.length; i++) {
    if (String(values[i]?.[0] ?? "") === transferId) {
      return 4 + i; // J4 is row 4
    }
  }
  return null;
}

// ---------- Monthly sheet styling ----------
async function styleMonthlySheetBase(title: string, accessToken: string) {
  const sheetId = await sheetIdByTitle(title, accessToken);

  const requests: any[] = [
    {
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 3 } },
        fields: "gridProperties.frozenRowCount"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 9 },
        cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 14 }, backgroundColor: COLOR.white } },
        fields: "userEnteredFormat(textFormat,backgroundColor)"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 9 },
        cell: { userEnteredFormat: { backgroundColor: COLOR.lightGreen, textFormat: { bold: true } } },
        fields: "userEnteredFormat(backgroundColor,textFormat)"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 1, endColumnIndex: 2 },
        cell: { userEnteredFormat: { backgroundColor: COLOR.lightBlue, textFormat: { bold: true } } },
        fields: "userEnteredFormat(backgroundColor,textFormat)"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 2, endRowIndex: 3, startColumnIndex: 0, endColumnIndex: 9 },
        cell: {
          userEnteredFormat: {
            backgroundColor: COLOR.headerGray,
            horizontalAlignment: "CENTER",
            textFormat: { bold: true }
          }
        },
        fields: "userEnteredFormat(backgroundColor,horizontalAlignment,textFormat)"
      }
    },
    ...[40, 100, 70, 220, 220, 180, 110, 110, 130].map((px, i) => ({
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: i, endIndex: i + 1 },
        properties: { pixelSize: px },
        fields: "pixelSize"
      }
    })),
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: 9, endIndex: 10 }, // J
        properties: { hiddenByUser: true },
        fields: "hiddenByUser"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, startColumnIndex: 0, endColumnIndex: 1 },
        cell: { userEnteredFormat: { horizontalAlignment: "CENTER" } },
        fields: "userEnteredFormat.horizontalAlignment"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, startColumnIndex: 1, endColumnIndex: 3 },
        cell: { userEnteredFormat: { horizontalAlignment: "CENTER" } },
        fields: "userEnteredFormat.horizontalAlignment"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, startColumnIndex: 1, endColumnIndex: 2 },
        cell: { userEnteredFormat: { numberFormat: { type: "DATE", pattern: "dd.MM.yyyy" } } },
        fields: "userEnteredFormat.numberFormat"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, startColumnIndex: 2, endColumnIndex: 3 },
        cell: { userEnteredFormat: { numberFormat: { type: "TIME", pattern: "hh:mm" } } },
        fields: "userEnteredFormat.numberFormat"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 3, startColumnIndex: 7, endColumnIndex: 8 },
        cell: { userEnteredFormat: { numberFormat: { type: "CURRENCY", pattern: "#.##0,00 \"€\"" }, horizontalAlignment: "RIGHT" } },
        fields: "userEnteredFormat(numberFormat,horizontalAlignment)"
      }
    }
  ];

  await sheetsBatchUpdate(requests, accessToken);
}

async function applyDataBorders(title: string, startRow: number, endRow: number, accessToken: string) {
  if (endRow < startRow) return;
  const sheetId = await sheetIdByTitle(title, accessToken);
  const range = { sheetId, startRowIndex: startRow - 1, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: MONTH_TOTAL_COLUMNS };
  await sheetsBatchUpdate([
    {
      updateBorders: {
        range,
        top:    { style: "SOLID", color: COLOR.black },
        bottom: { style: "SOLID", color: COLOR.black },
        left:   { style: "SOLID", color: COLOR.black },
        right:  { style: "SOLID", color: COLOR.black },
        innerHorizontal: { style: "SOLID", color: COLOR.black },
        innerVertical:   { style: "SOLID", color: COLOR.black }
      }
    }
  ], accessToken);
}

// --- XLOOKUP builder for AllRequests with primary key in J ---
function xlookupExpr(returnColLetter: string, sep: "," | ";"): string {
  const key = sep === ";" ? "INDEX($J:$J;ROW())" : "INDEX($J:$J,ROW())";
  const aSep = sep;
  return `XLOOKUP(${key}${aSep}${MASTER_TITLE}!A:A${aSep}${MASTER_TITLE}!${returnColLetter}:${returnColLetter})`;
}

// --- locale-aware selectors without QUERY; hard-coerce types ---
function qSelText(masterCol: string, sep: "," | ";"): string {
  const key = sep === ";" ? "INDEX($J:$J;ROW())" : "INDEX($J:$J,ROW())";
  const x = xlookupExpr(masterCol, sep);
  if (sep === ";") {
    return `=IF(${key}="";"";IFERROR(${x};""))`;
  } else {
    return `=IF(${key}="","",IFERROR(${x},""))`;
  }
}

function qSelNumber(masterCol: string, sep: "," | ";"): string {
  const key = sep === ";" ? "INDEX($J:$J;ROW())" : "INDEX($J:$J,ROW())";
  const x = xlookupExpr(masterCol, sep);
  if (sep === ";") {
    return `=IF(${key}="";"";IFERROR(N(${x});""))`;
  } else {
    return `=IF(${key}="","",IFERROR(N(${x}),""))`;
  }
}

function qSelDate(masterCol: string, sep: "," | ";"): string {
  const key = sep === ";" ? "INDEX($J:$J;ROW())" : "INDEX($J:$J,ROW())";
  const x = xlookupExpr(masterCol, sep);
  if (sep === ";") {
    return `=IF(${key}="";"";IFERROR(IF(ISNUMBER(${x});${x};DATE(VALUE(LEFT(${x};4));VALUE(MID(${x};6;2));VALUE(RIGHT(${x};2))));""))`;
  } else {
    return `=IF(${key}="","",IFERROR(IF(ISNUMBER(${x}),${x},DATE(VALUE(LEFT(${x},4)),VALUE(MID(${x},6,2)),VALUE(RIGHT(${x},2)))),""))`;
  }
}

function qSelTime(masterCol: string, sep: "," | ";"): string {
  const key = sep === ";" ? "INDEX($J:$J;ROW())" : "INDEX($J:$J,ROW())";
  const x = xlookupExpr(masterCol, sep);
  if (sep === ";") {
    return `=IF(${key}="";"";IFERROR(IF(ISNUMBER(${x});${x};TIME(VALUE(LEFT(${x};2));VALUE(MID(${x};4;2));0));""))`;
  } else {
    return `=IF(${key}="","",IFERROR(IF(ISNUMBER(${x}),${x},TIME(VALUE(LEFT(${x},2)),VALUE(MID(${x},4,2)),0)),""))`;
  }
}

// --- Build monthly row formulas (locale-aware) using XLOOKUP (no QUERY) ---
function monthlyRowFormulas_SQL(transferId: string, argSep: "," | ";"): SheetValue[] {
  return [
    "",                           // A Nr.
    qSelDate("D", argSep),        // B
    qSelTime("E", argSep),        // C
    qSelText("F", argSep),        // D
    qSelText("G", argSep),        // E
    qSelText("H", argSep),        // F
    qSelText("I", argSep),        // G
    qSelNumber("J", argSep),      // H
    qSelText("K", argSep),        // I
    transferId                    // J (hidden)
  ];
}

async function enforceNumberFormatsForRows(
  sheetTitle: string,
  rowStart: number,
  rowEnd: number,
  accessToken: string
) {
  if (rowEnd < rowStart) return;
  const sheetId = await sheetIdByTitle(sheetTitle, accessToken);

  const requests: any[] = [
    {
      repeatCell: {
        range: { sheetId, startRowIndex: rowStart - 1, endRowIndex: rowEnd, startColumnIndex: 1, endColumnIndex: 2 },
        cell: { userEnteredFormat: { numberFormat: { type: "DATE", pattern: "dd.MM.yyyy" }, horizontalAlignment: "CENTER" } },
        fields: "userEnteredFormat(numberFormat,horizontalAlignment)"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: rowStart - 1, endRowIndex: rowEnd, startColumnIndex: 2, endColumnIndex: 3 },
        cell: { userEnteredFormat: { numberFormat: { type: "TIME", pattern: "hh:mm" }, horizontalAlignment: "CENTER" } },
        fields: "userEnteredFormat(numberFormat,horizontalAlignment)"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: rowStart - 1, endRowIndex: rowEnd, startColumnIndex: 7, endColumnIndex: 8 },
        cell: { userEnteredFormat: { numberFormat: { type: "CURRENCY", pattern: "#.##0,00 \"€\"" }, horizontalAlignment: "RIGHT" } },
        fields: "userEnteredFormat(numberFormat,horizontalAlignment)"
      }
    }
  ];

  await sheetsBatchUpdate(requests, accessToken);
}

// ---------- Totals / spacer handling ----------
async function refreshMonthlyTotals(sheetTitle: string, accessToken: string) {
  const argSep = await getFormulaArgSep(accessToken);

  const dataCount = await getMonthlyDataCount(sheetTitle, accessToken);
  const lastDataRow = 3 + dataCount;

  if (dataCount > 0) await applyDataBorders(sheetTitle, 4, lastDataRow, accessToken);

  const sheetId = await sheetIdByTitle(sheetTitle, accessToken);
  await valuesUpdate(`${sheetTitle}!G${lastDataRow + 1}:I${lastDataRow + 6}`, [["","",""],["","",""],["","",""],["","",""],["","",""],["","",""]], accessToken);

  const spacerRow = lastDataRow + 1;
  await valuesUpdate(`${sheetTitle}!A${spacerRow}:I${spacerRow}`, [["","","","","","","","",""]], accessToken);

  await sheetsBatchUpdate([
    {
      updateBorders: {
        range: { sheetId, startRowIndex: spacerRow - 1, endRowIndex: spacerRow, startColumnIndex: 0, endColumnIndex: MONTH_TOTAL_COLUMNS },
        top:    { style: "NONE" },
        bottom: { style: "NONE" },
        left:   { style: "NONE" },
        right:  { style: "NONE" },
        innerHorizontal: { style: "NONE" },
        innerVertical:   { style: "NONE" }
      }
    }
  ], accessToken);

  let cursor = spacerRow + 1;
  const sumRow = cursor; cursor++;

  let voucherExists = false;
  if (dataCount > 0) {
    const { values: hv } = await valuesGet(`${sheetTitle}!H4:I${lastDataRow}`, accessToken);
    for (const r of (hv || [])) {
      const payment = String(r?.[1] ?? "");
      if (payment === "Gutschein") { voucherExists = true; break; }
    }
  }

  const voucherRow = voucherExists ? cursor : null;
  if (voucherExists) cursor++;
  const netRow = cursor; cursor++;
  const vatRow = cursor; cursor++;
  const discountedRow = cursor; cursor++;

  const amountCol = "H";
  const paymentCol = "I";
  const sumFormula = dataCount > 0 ? `=SUM(${amountCol}4:${amountCol}${lastDataRow})` : `=0`;
  const voucherFormula = dataCount > 0 ? `=SUMIF(${paymentCol}4:${paymentCol}${lastDataRow}${argSep}"Gutschein"${argSep}${amountCol}4:${amountCol}${lastDataRow})` : `=0`;
  const netFormula = `=H${sumRow}-${voucherExists ? `H${voucherRow!}` : "0"}`;
  const vatPercent = 10;
  const vatFormula = `=H${netRow}*(1+${vatPercent}/100)`;

  // --- Minimal change: compute discounted total directly from the data area (robust) ---
  const sumBase = dataCount > 0 ? `SUM(${amountCol}4:${amountCol}${lastDataRow})` : `0`;
  const voucherBase = dataCount > 0 ? `SUMIF(${paymentCol}4:${paymentCol}${lastDataRow}${argSep}"Gutschein"${argSep}${amountCol}4:${amountCol}${lastDataRow})` : `0`;
  const discFormula = `=(${sumBase}-${voucherBase})*(1-0.04)*(1+${vatPercent}/100)`;

  await valuesUpdate(
    `${sheetTitle}!G${sumRow}:I${sumRow}`,
    [["Gesamtsumme :", sumFormula, ""]],
    accessToken
  );

  if (voucherExists && voucherRow) {
    await valuesUpdate(
      `${sheetTitle}!G${voucherRow}:I${voucherRow}`,
      [[`LIMOSEN KG 100 % Rabatt Gutschein`, voucherFormula, ""]],
      accessToken
    );
  }

  await valuesUpdate(
    `${sheetTitle}!G${netRow}:I${netRow}`,
    [[`Rechnungsbetrag nach Abzug Gutscheine :`, netFormula, ""]],
    accessToken
  );

  await valuesUpdate(
    `${sheetTitle}!G${vatRow}:I${vatRow}`,
    [[`Gesamt Rechnungsbetrag inkl. 10 % MwSt :`, vatFormula, ""]],
    accessToken
  );

  await valuesUpdate(
    `${sheetTitle}!G${discountedRow}:I${discountedRow}`,
    [[`Gesamt Rechnungsbetrag inkl. 10 % MwSt mit 4 % Rabatt :`, discFormula, ""]],
    accessToken
  );

  await sheetsBatchUpdate([
    {
      repeatCell: {
        range: { sheetId, startRowIndex: sumRow - 1, endRowIndex: discountedRow, startColumnIndex: 6, endColumnIndex: 8 },
        cell: { userEnteredFormat: { textFormat: { bold: true } } },
        fields: "userEnteredFormat.textFormat.bold"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: sumRow - 1, endRowIndex: discountedRow, startColumnIndex: 7, endColumnIndex: 8 },
        cell: { userEnteredFormat: { numberFormat: { type: "CURRENCY", pattern: "#.##0,00 \"€\"" }, horizontalAlignment: "RIGHT" } },
        fields: "userEnteredFormat(numberFormat,horizontalAlignment)"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: sumRow - 1, endRowIndex: sumRow, startColumnIndex: 7, endColumnIndex: 8 },
        cell: { userEnteredFormat: { textFormat: { underline: true } } },
        fields: "userEnteredFormat.textFormat.underline"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: discountedRow - 1, endRowIndex: discountedRow, startColumnIndex: 6, endColumnIndex: 7 },
        cell: { userEnteredFormat: { backgroundColor: COLOR.lightBlue } },
        fields: "userEnteredFormat.backgroundColor"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: sumRow - 1, endRowIndex: sumRow, startColumnIndex: 8, endColumnIndex: 9 },
        cell: { userEnteredFormat: { backgroundColor: COLOR.lightGreen } },
        fields: "userEnteredFormat.backgroundColor"
      }
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: netRow - 1, endRowIndex: netRow, startColumnIndex: 8, endColumnIndex: 9 },
        cell: { userEnteredFormat: { backgroundColor: COLOR.midOrange } },
        fields: "userEnteredFormat.backgroundColor"
      }
    }
  ], accessToken);
}

async function tryGetUserDisplayName(userId: string): Promise<string | undefined> {
  try {
    const user = await UserService.getZitadelUserById(userId);
    const display =
      user?.human?.profile?.displayName ||
      `${user?.human?.profile?.firstName ?? ""} ${user?.human?.profile?.lastName ?? ""}`.trim();
    return display || undefined;
  } catch {
    return undefined;
  }
}

async function ensureMonthlyForUser(
  userId: string,
  yyyymm: string,
  accessToken: string,
  opts?: { wipe?: boolean }
): Promise<string> {
  const title = monthSheetTitle(userId, yyyymm);
  await ensureSheet(title, accessToken);

  if (opts?.wipe) {
    await sheetsBatchUpdate([{
      updateCells: {
        range: { sheetId: await sheetIdByTitle(title, accessToken) },
        fields: "userEnteredValue"
      }
    }], accessToken);
  }

  const header1 = `ABRECHNUNG: ${germanMonthLabel(yyyymm)}`;
  const displayName = await tryGetUserDisplayName(userId).catch(() => undefined);
  const secondRow = `Kundennummer: ${userId}${displayName ? ` ${displayName}` : ""}`;

  const exist = await valuesGet(`${title}!A1:J3`, accessToken);
  const hasHeader3 = !!exist.values && exist.values.length >= 3 && ((exist.values[2]?.length ?? 0) >= MONTH_TOTAL_COLUMNS);

  if (!hasHeader3) {
    await valuesUpdate(`${title}!A1`, [[header1]], accessToken);
    await valuesUpdate(`${title}!A2:I2`, [[secondRow, "", "", "", "", "", "", "", ""]], accessToken);
    await valuesUpdate(`${title}!A3:I3`, [MONTH_HEADERS_VISIBLE], accessToken);
  } else {
    await valuesUpdate(`${title}!A1`, [[header1]], accessToken);
    await valuesUpdate(`${title}!A2:I2`, [[secondRow, "", "", "", "", "", "", "", ""]], accessToken);
  }

  await styleMonthlySheetBase(title, accessToken);
  return title;
}

// ---------- Public API ----------
export class TransferService {
  //@requireAuth()
  static async createTransfer(values: TransferInput): Promise<{ transferId: string }> {
    if (!validator.isISO8601(values.rideDateISO)) throw new Error("Invalid rideDateISO");
    if (!/^\d{2}:\d{2}$/.test(values.rideTime)) throw new Error("Invalid rideTime");

    const auth = getContext().get("auth");
    const userId = "291575079316231770"; // auth.sub as string;
    if (!userId) throw new Error("Anonymous");

    const displayName = await tryGetUserDisplayName(userId);

    const accessToken = await googleAccessToken();
    await ensureMaster(accessToken);

    const row: TransferRow = {
      transferId: newTransferId(),
      userId,
      customerName: displayName,
      rideDateISO: values.rideDateISO,
      rideTime: values.rideTime,
      pickup: values.pickup,
      dropoff: values.dropoff,
      roomOrName: values.roomOrName,
      vehicle: values.vehicle,
      amountEUR: values.amountEUR,
      payment: values.payment,
      driver: "",
      state: "pending",
      requestedAtISO: new Date().toISOString()
    };

    await valuesAppend(`${MASTER_TITLE}!A:A`, [transferToMasterRow(row)], accessToken);
    return { transferId: row.transferId };
  }

  static async assignDriver(transferId: string, driver: string): Promise<void> {
    const accessToken = await googleAccessToken();
    await ensureMaster(accessToken);
    const rowIdx = await findMasterRowIndexByTransferId(transferId, accessToken);
    if (!rowIdx) throw new Error("transferId not found");
    await valuesUpdate(`${MASTER_TITLE}!L${rowIdx}:L${rowIdx}`, [[driver]], accessToken);
  }

  @requireAuth()
  static async cancelTransfer(transferId: string): Promise<void> {
    const accessToken = await googleAccessToken();
    await ensureMaster(accessToken);

    const auth = getContext().get("auth");
    const userId = auth.sub as string;

    const { rowIdx, row } = await getMasterRowWithIndex(transferId, accessToken);
    if (!rowIdx || !row) throw new Error("transferId not found");
    if (row.userId !== userId) throw new Error("Forbidden");
    if (row.state !== "pending") throw new Error("Only pending transfers can be canceled");

    await valuesUpdate(`${MASTER_TITLE}!M${rowIdx}:M${rowIdx}`, [["canceled"]], accessToken);
  }

  static async terminateTransfer(transferId: string): Promise<void> {
    const accessToken = await googleAccessToken();
    await ensureMaster(accessToken);

    const { rowIdx, row } = await getMasterRowWithIndex(transferId, accessToken);
    if (!rowIdx || !row) throw new Error("transferId not found");
    if (row.state === "complete") throw new Error("Cannot terminate a completed transfer");

    await valuesUpdate(`${MASTER_TITLE}!M${rowIdx}:M${rowIdx}`, [["terminated"]], accessToken);
  }

  static async markCompleted(transferId: string): Promise<void> {
    const accessToken = await googleAccessToken();
    await ensureMaster(accessToken);

    const { rowIdx, row } = await getMasterRowWithIndex(transferId, accessToken);
    if (!rowIdx || !row) throw new Error("transferId not found");
    if (row.state !== "pending") throw new Error("Only pending transfers can be completed");

    await valuesUpdate(`${MASTER_TITLE}!M${rowIdx}:M${rowIdx}`, [["complete"]], accessToken);

    const yyyymm = monthKeyFromISO(row.rideDateISO);
    const monthlyTitle = await ensureMonthlyForUser(row.userId, yyyymm, accessToken);

    const existingMonthlyRow = await findMonthlyRowIndexByTransferId(monthlyTitle, transferId, accessToken);
    if (existingMonthlyRow) {
      await enforceNumberFormatsForRows(monthlyTitle, existingMonthlyRow, existingMonthlyRow, accessToken);
      await refreshMonthlyTotals(monthlyTitle, accessToken);
      return;
    }

    const dataCount = await getMonthlyDataCount(monthlyTitle, accessToken);
    const nextIdx = dataCount + 1;
    const insertAtRow = 3 + nextIdx;

    const sheetId = await sheetIdByTitle(monthlyTitle, accessToken);
    await sheetsBatchUpdate([
      {
        insertDimension: {
          range: { sheetId, dimension: "ROWS", startIndex: insertAtRow - 1, endIndex: insertAtRow },
          inheritFromBefore: true
        }
      }
    ], accessToken);

    const argSep = await getFormulaArgSep(accessToken);
    const vals = monthlyRowFormulas_SQL(transferId, argSep);
    vals[0] = nextIdx;

    await valuesUpdate(`${monthlyTitle}!A${insertAtRow}:J${insertAtRow}`, [vals], accessToken);
    await enforceNumberFormatsForRows(monthlyTitle, insertAtRow, insertAtRow, accessToken);
    await refreshMonthlyTotals(monthlyTitle, accessToken);
  }

  static async getTransfer(transferId: string): Promise<TransferRow | null> {
    const accessToken = await googleAccessToken();
    await ensureMaster(accessToken);
    const { row } = await getMasterRowWithIndex(transferId, accessToken);
    return row ?? null;
  }

  static async listTransfers(opts?: { userId?: string; state?: TransferState }): Promise<TransferRow[]> {
    const accessToken = await googleAccessToken();
    await ensureMaster(accessToken);
    const range = `${MASTER_TITLE}!A2:${colLetter(MASTER_HEADERS.length)}`;
    const { values } = await valuesGet(range, accessToken);
    const rows = (values ?? []).map(r => rowToTransfer(r)).filter(Boolean) as TransferRow[];
    return rows.filter(r => {
      if (opts?.userId && r.userId !== opts?.userId) return false;
      if (opts?.state && r.state !== opts?.state) return false;
      return true;
    });
  }

  static async syncMonthlySheet(userId: string, yyyymm: string): Promise<void> {
    const accessToken = await googleAccessToken();
    await ensureMaster(accessToken);

    const monthlyTitle = await ensureMonthlyForUser(userId, yyyymm, accessToken, { wipe: true });

    const all = await TransferService.listTransfers({ userId, state: "complete" });
    const monthRows = all.filter(r => monthKeyFromISO(r.rideDateISO) === yyyymm);

    const argSep = await getFormulaArgSep(accessToken);
    const payload: SheetValue[][] = monthRows.map((r, i) => {
      const vals = monthlyRowFormulas_SQL(r.transferId, argSep);
      vals[0] = i + 1;
      return vals;
    });

    if (payload.length) {
      const endRow = 3 + payload.length;
      await valuesUpdate(`${monthlyTitle}!A4:J${endRow}`, payload, accessToken);
      await enforceNumberFormatsForRows(monthlyTitle, 4, endRow, accessToken);
    }

    await refreshMonthlyTotals(monthlyTitle, accessToken);
  }
}
