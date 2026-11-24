/**
 * Pure, dependency-free mock money validation.
 * Do not silently truncate large pasted amounts; reject them instead.
 * Real finance transactions must use the server-side integer UZS contract.
 */
export const MAX_MOCK_AMOUNT=999_999_999_999;

export function cleanMoneyInput(text:string):string {
  return text.replace(/[^0-9]/g,'');
}

export function parseMockAmount(text:string):number|null {
  if(!/^[0-9]+$/.test(text))return null;
  const value=Number(text);
  if(!Number.isSafeInteger(value)||value<=0||value>MAX_MOCK_AMOUNT)return null;
  return value;
}
