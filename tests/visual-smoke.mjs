import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const BASE='http://127.0.0.1:4173';
const OUT='artifacts/d03-screenshots';

async function capture(page,label) {
  const width=page.viewportSize()?.width??390;
  const name=`${label}-${width}.png`;
  await page.screenshot({path:`${OUT}/${name}`,fullPage:true,animations:'disabled'});
  const overflow=await page.evaluate(
    ()=>document.documentElement.scrollWidth>window.innerWidth+2
  );
  assert.equal(overflow,false,`Horizontal overflow on ${label} at ${width}`);
  return name;
}

await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report=[];
try {
  for(const width of [320,360,393,430]){
    const height=width===320?720:width===360?800:width===393?852:932;
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));

    await page.goto(BASE,{waitUntil:'networkidle'});
    await page.getByText('Pul rejangiz — bir qarashda.').waitFor();
    const screenshots=[];
    screenshots.push(await capture(page,'home'));

    await page.getByRole('tab',{name:'Profil'}).click();
    await page.getByText('Demo profil').waitFor();
    screenshots.push(await capture(page,'profile'));

    await page.getByRole('button',{name:'Hisoblar oynasini ochish'}).click();
    await page.getByText('Hisoblar ro‘yxati').waitFor();
    screenshots.push(await capture(page,'accounts'));

    await page.getByRole('button',{name:'Hisob qo‘shish'}).click();
    await page.getByText('Boshlang‘ich qoldiq (ixtiyoriy)').waitFor();
    screenshots.push(await capture(page,'account-form'));

    await page.getByRole('textbox',{name:'Hisob nomi'}).fill('Yangi karta');
    await page.getByRole('textbox',{name:'Boshlang‘ich qoldiq (ixtiyoriy)'}).fill('0');
    await page.getByRole('button',{name:'Namuna saqlash'}).click();
    await page.getByText('Yangi karta').waitFor();
    assert.ok(await page.getByText('0 so‘m').count()>0,'Confirmed zero not visible');
    screenshots.push(await capture(page,'account-created'));

    await page.getByRole('button',{name:'Profilga qaytish'}).click();
    await page.getByRole('button',{name:'Maqsadlar oynasini ochish'}).click();
    await page.getByText('Maqsadlar rejangiz').waitFor();
    screenshots.push(await capture(page,'goals'));

    await page.getByRole('button',{name:'Maqsad qo‘shish'}).click();
    await page.getByText('Muddati (ixtiyoriy)').waitFor();
    screenshots.push(await capture(page,'goal-form'));

    await page.getByRole('button',{name:'Maqsad muddatini tanlash'}).click();
    await page.getByText('Qachon bo‘lgan?').waitFor();
    screenshots.push(await capture(page,'goal-calendar'));
    await page.getByRole('button',{name:'Yopish'}).click();

    await page.getByRole('textbox',{name:'Maqsad nomi'}).fill('Yangi maqsad');
    await page.getByRole('textbox',{name:'Maqsad summasi (so‘m)'}).fill('5000000');
    await page.getByRole('button',{name:'Namuna saqlash'}).click();
    await page.getByText('Yangi maqsad').waitFor();
    screenshots.push(await capture(page,'goal-created'));

    await page.getByRole('button',{name:'Profilga qaytish'}).click();
    await page.getByRole('tab',{name:'Bosh'}).click();
    await page.getByRole('button',{name:'Xarajat qo‘shish'}).click();
    await page.getByText('YANGI OPERATSIYA').waitFor();
    screenshots.push(await capture(page,'expense-form'));

    assert.deepEqual(errors,[],`Browser runtime errors on ${width}px`);
    report.push({width,height,screenshots,errors});
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(`${OUT}/report.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({
  status:'PASS_RESPONSIVE_WEB_ONLY',
  widths:report.map(x=>x.width),
  screenshotCount:report.reduce((n,r)=>n+r.screenshots.length,0),
},null,2));
