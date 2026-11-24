const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const URL=process.env.SMOKE_URL||'http://127.0.0.1:8093';
const sizes=[{width:320,height:640},{width:360,height:800},{width:393,height:852},{width:430,height:932}];
const output=path.join(__dirname,'..','artifacts','reboot');
fs.mkdirSync(output,{recursive:true});

async function ready(){
  for(let i=0;i<90;i++){
    try{const response=await fetch(URL,{signal:AbortSignal.timeout(4000)});if(response.ok)return;}catch(_){}
    await new Promise(resolve=>setTimeout(resolve,1100));
  }
  throw new Error('Expo did not start: '+URL);
}
async function snap(page,size,step){
  await page.screenshot({path:path.join(output,size.width+'x'+size.height+'-'+step+'.png'),
    animations:'disabled'});
}
async function noOverflow(page,size,label){
  const dims=await page.evaluate(()=>({w:window.innerWidth,body:document.body.scrollWidth,doc:document.documentElement.scrollWidth}));
  assert.ok(dims.body<=dims.w+2&&dims.doc<=dims.w+2,
    size.width+' '+label+' overflow '+JSON.stringify(dims));
}
async function scenario(browser,size){
  const context=await browser.newContext({viewport:size,isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await context.newPage();
  await page.clock.setFixedTime(new Date('2026-11-24T12:00:00Z'));
  page.setDefaultTimeout(14000);
  const errors=[];
  page.on('pageerror',err=>errors.push(String(err)));
  try{
    await page.goto(URL,{waitUntil:'domcontentloaded',timeout:90000});
    await page.getByTestId('reboot-home').waitFor({state:'visible',timeout:35000});
    await page.getByText('Qaydlar bo‘yicha farq').waitFor({state:'visible'});
    assert.ok((await page.getByTestId('reboot-net').textContent()).includes('2 741 000'));
    const action=await page.getByTestId('reboot-add-expense').boundingBox();
    const nav=await page.getByRole('tab',{name:'Bosh sahifa'}).boundingBox();
    assert.ok(action&&nav,'Home CTA/navigation must render');
    assert.ok(action.y+action.height <= nav.y-8,
      size.width+' Home primary CTA should be visible above navigation');
    await noOverflow(page,size,'home');
    await snap(page,size,'01-home');
    await page.getByTestId('reboot-safe-info').click();
    await page.getByTestId('reboot-safe-modal').waitFor({state:'visible'});
    await snap(page,size,'02-safe-explainer');
    await page.getByTestId('reboot-safe-close').click();

    await page.getByTestId('reboot-add-expense').click();
    await page.getByTestId('reboot-editor').waitFor({state:'visible'});
    await snap(page,size,'03-editor');
    await page.getByTestId('reboot-entry-amount').fill('100000');
    await page.getByTestId('reboot-entry-date').click();
    await page.getByTestId('reboot-calendar').waitFor({state:'visible'});
    await page.getByTestId('reboot-calendar-day-22').click();
    await page.getByTestId('reboot-entry-save').click();
    await page.getByTestId('reboot-activity').waitFor({state:'visible'});
    await page.getByTestId('reboot-item-session-1000').waitFor({state:'visible'});
    await snap(page,size,'04-activity-new');

    await page.getByTestId('reboot-activity-search').fill('Transport');
    await page.getByTestId('reboot-item-2').waitFor({state:'visible'});
    assert.equal(await page.getByTestId('reboot-item-session-1000').count(),0);
    await page.getByTestId('reboot-activity-search').fill('');
    await page.getByTestId('reboot-filter-expense').click();
    assert.equal(await page.getByTestId('reboot-item-4').count(),0);
    await page.getByTestId('reboot-filter-all').click();

    await page.getByRole('tab',{name:'Tahlil'}).click();
    await page.getByTestId('reboot-insights').waitFor({state:'visible'});
    assert.ok((await page.getByTestId('reboot-analysis-net').textContent()).includes('2 641 000'));
    await snap(page,size,'05-analysis');
    await page.getByTestId('reboot-analysis-month').click();
    await page.getByTestId('reboot-analysis-all').click();

    await page.getByRole('tab',{name:'Bosh sahifa'}).click();
    await page.getByTestId('reboot-top-category').scrollIntoViewIfNeeded();
    assert.equal((await page.getByTestId('reboot-top-category').textContent()).trim(),'Oziq-ovqat');
    await snap(page,size,'07-dynamic-spending-signal');
    await page.getByTestId('reboot-signal-details').click();
    await page.getByTestId('reboot-activity').waitFor({state:'visible'});

    await page.getByRole('tab',{name:'Faoliyat'}).click();
    await page.getByTestId('reboot-item-session-1000').click();
    await page.getByTestId('reboot-entry-amount').fill('200000');
    await page.getByTestId('reboot-entry-save').click();
    await page.getByRole('tab',{name:'Tahlil'}).click();
    assert.ok((await page.getByTestId('reboot-analysis-net').textContent()).includes('2 541 000'));
    await page.getByRole('tab',{name:'Faoliyat'}).click();
    await page.getByTestId('reboot-item-session-1000').click();
    await page.getByTestId('reboot-delete-open').click();
    await page.getByTestId('reboot-delete-confirm').click();
    assert.equal(await page.getByTestId('reboot-item-session-1000').count(),0);

    await page.getByRole('tab',{name:'Profil'}).click();
    await page.getByTestId('reboot-profile').waitFor({state:'visible'});
    await snap(page,size,'06-profile');
    await page.getByTestId('reboot-reset-open').click();
    await page.getByTestId('reboot-reset-confirm').click();
    await page.getByTestId('reboot-home').waitFor({state:'visible'});
    assert.ok((await page.getByTestId('reboot-net').textContent()).includes('2 741 000'));
    await noOverflow(page,size,'after reset');
    assert.deepEqual(errors,[],size.width+' runtime errors: '+errors.join('; '));
    console.log('PASS '+size.width+'x'+size.height+': Home, entry, date, search, filter, analytics, edit, delete and reset');
  }catch(error){
    try{await snap(page,size,'failure');}catch(_){}
    throw new Error(size.width+'x'+size.height+': '+String(error)+(errors.length?'\nPage errors: '+errors.join('; '):''));
  }finally{await context.close();}
}
(async()=>{
  await ready();
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try{for(const size of sizes)await scenario(browser,size);}
  finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
