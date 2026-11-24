import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_MOCK_AMOUNT,cleanMoneyInput,parseMockAmount
} from '../src/data/amountValidation.ts';

test('money input removes formatting without discarding significant digits',()=>{
  assert.equal(cleanMoneyInput('1 234 567'),'1234567');
  assert.equal(cleanMoneyInput('-500'),'-500');
  assert.equal(cleanMoneyInput('12.5'),'12.5');
  assert.equal(cleanMoneyInput('1e6'),'1e6');
  assert.equal(cleanMoneyInput('9999999999999'),'9999999999999');
});

test('positive integer UZS can be parsed exactly inside mock limit',()=>{
  assert.equal(parseMockAmount('24000'),24000);
  assert.equal(parseMockAmount(String(MAX_MOCK_AMOUNT)),MAX_MOCK_AMOUNT);
  assert.equal(parseMockAmount('00024'),24);
});

test('zero, negatives, fractions, scientific notation and overflow are rejected',()=>{
  for(const s of ['', '0', '-1','12.5','1e6','NaN','1000000000000','9007199254740993','1234so‘m']){
    assert.equal(parseMockAmount(s),null,s);
  }
});
