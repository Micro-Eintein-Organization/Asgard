import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {chromium} from '../frontend/node_modules/playwright-core/index.mjs';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {parseEnv} from 'node:util';
import {localConfig} from './dev-config.mjs';

const root=process.env.ASGARD_BROWSER_PROJECT_ROOT ?? fileURLToPath(new URL('../',import.meta.url));
const local= parseEnv(readFileSync(join(root,'.env'),'utf8'));
const base='http://127.0.0.1:'+Number(local.FRONTEND_PORT || 5173);
const toolsRoot=fileURLToPath(new URL('../',import.meta.url));
const result=spawnSync(process.execPath,[join(toolsRoot,'node_modules/supabase/dist/supabase.js'),'status','--output','json'],{cwd:root,encoding:'utf8'});
if(result.status!==0) throw new Error('Local stack unavailable.');
const config=JSON.parse(result.stdout);
if(!/^http:\/\/127\.0\.0\.1:\d+$/.test(config.API_URL)) throw new Error('Local stack required.');
const email='asgard-browser-'+randomUUID()+'@example.test';
const password='synthetic '+randomUUID();
const admin={apikey:config.ANON_KEY,Authorization:'Bearer '+config.SERVICE_ROLE_KEY,'Content-Type':'application/json'};
let uid;
let browser;
let stage='launch';
try {
  browser=await chromium.launch({channel:process.env.ASGARD_BROWSER_CHANNEL ?? 'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  page.setDefaultTimeout(15000);
  await page.route('**/api/v1/me/recommendations',route=>route.request().method()==='POST'?route.fulfill({status:503,json:{code:'provider_unavailable',message:'Synthetic browser check: provider call disabled.',request_id:'browser-check'}}):route.continue());
  stage='registration';
  await page.goto(base+'/create-account');
  await page.getByLabel('Email',{exact:true}).fill(email);
  await page.getByLabel('Password',{exact:true}).fill(password);
  await page.getByLabel('Confirm password',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Send email code',exact:true}).click();
  await page.getByLabel('Email confirmation code',{exact:true}).waitFor();
  const users=await fetch(config.API_URL+'/auth/v1/admin/users?per_page=1000',{headers:admin});
  if(!users.ok) throw new Error('Cannot locate synthetic signup for cleanup.');
  uid=(await users.json()).users.find(user=>user.email===email)?.id;
  if(!uid) throw new Error('Synthetic signup was not created.');
  stage='email_verification';
  const mail='http://127.0.0.1:'+localConfig(readFileSync(join(root,'supabase/config.toml'),'utf8')).mail;
  let code;
  for(let attempt=0;attempt<40 && !code;attempt++) {
    const inbox=await fetch(mail+'/api/v1/messages?query='+encodeURIComponent('to:'+email));
    if(!inbox.ok) throw new Error('Local confirmation inbox unavailable.');
    for(const message of (await inbox.json()).messages ?? []) {
      if(!message.To?.some(to=>to.Address?.toLowerCase()===email.toLowerCase())) continue;
      const detail=await fetch(mail+'/api/v1/message/'+message.ID);
      if(!detail.ok) continue;
      const content=await detail.json();
      const codes=[...new Set(((content.Text ?? '')+' '+(content.HTML ?? '')).match(/(?<!\d)\d{6}(?!\d)/g))];
      if(codes.length===1) code=codes[0];
    }
    if(!code) await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!code) throw new Error('No unambiguous confirmation code arrived.');
  await page.getByLabel('Email confirmation code',{exact:true}).fill(code);
  await page.getByRole('button',{name:'Verify',exact:true}).click();
  await page.waitForURL('**/welcome');
  await page.goto(base+'/dashboard');
  stage='no_focus_catalog';
  await page.getByRole('link',{name:'Career',exact:true}).click();
  await page.waitForURL('**/careers');
  stage='blank_discovery';
  await page.goto(base+'/welcome');
  if(await page.getByRole('navigation').count()) throw new Error('Onboarding navigation leaked.');
  await page.getByRole('button',{name:/Guided Discovery/}).click();
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.waitForURL('**/discovery');
  if(await page.locator('input:checked').count()) throw new Error('Initial answers were preselected.');
  for(let question=0;question<5;question++) {
    await page.getByLabel("I'm not sure yet",{exact:false}).check();
    const next=page.getByRole('button',{name:question===4?'Save Discovery and see suggestions':'Next',exact:true});
    await next.click();
    if(question<4) await page.getByText(`Question ${question+2} of 5`,{exact:true}).waitFor();
    if(question===0) {
      await page.reload();
      await page.getByText('Question 2 of 5',{exact:true}).waitFor();
    }
  }
  stage='saved_results';
  await page.waitForURL('**/recommendations');
  await page.getByText(/Synthetic browser check: provider call disabled\.|AI suggestions need local Groq configuration/).first().waitFor();
  stage='catalog_to_roadmap';
  await page.goto(base+'/careers');
  await page.getByRole('radio',{name:/Data Analyst/}).click();
  await page.getByRole('button',{name:'Select Role & View Roadmap'}).click();
  await page.getByRole('button',{name:'Set as current roadmap',exact:true}).click();
  await page.getByRole('button',{name:'Current roadmap',exact:true}).waitFor();
  const roadmapURL=page.url();
  stage='branch_and_topic_progress';
  await page.getByRole('button',{name:'Spreadsheet',exact:true}).click();
  await page.getByRole('button',{name:'Spreadsheet',exact:true,pressed:true}).waitFor();
  await page.getByRole('button',{name:/Define a useful question/}).click();
  await page.getByRole('button',{name:'Learning',exact:true}).click();
  await page.getByRole('button',{name:/Define a useful question learning/}).waitFor();
  await page.getByRole('button',{name:'Done',exact:true}).click();
  await page.getByText('1 of 20 topics done · 5%',{exact:true}).waitFor();
  await page.reload();
  await page.getByText('1 of 20 topics done · 5%',{exact:true}).waitFor();
  stage='resume_focus';
  await page.goto(base+'/dashboard');
  await page.getByRole('link',{name:'Career',exact:true}).click();
  await page.getByRole('button',{name:'Current roadmap',exact:true}).waitFor();
  if(!page.url().split('?')[0].startsWith(roadmapURL.split('?')[0])) throw new Error('Wrong saved career destination.');
  stage='profile_save';
  await page.goto(base+'/settings/profile');
  await page.getByLabel('First name',{exact:true}).fill('Synthetic');
  await page.getByLabel('Surname (optional)',{exact:true}).fill('Example');
  await page.getByRole('button',{name:'Save profile',exact:true}).click();
  await page.getByRole('button',{name:'Save profile',exact:true}).waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('button[type="submit"]')?.disabled??true);
  stage='profile_refresh';
  await page.reload();
  await page.getByLabel('First name',{exact:true}).waitFor();
  if(await page.getByLabel('First name',{exact:true}).inputValue()!=='Synthetic') throw new Error('Profile did not persist.');
  stage='settings_blank_retake';
  await page.getByRole('button',{name:'Retake Discovery',exact:true}).click();
  await page.waitForURL('**/discovery');
  await page.getByText('Question 1 of 5',{exact:true}).waitFor();
  if(await page.locator('input:checked').count()) throw new Error('Retake copied previous answers.');
  await page.goto(base+'/settings/profile');
  await page.getByRole('button',{name:'Resume Discovery',exact:true}).waitFor();
  stage='dropdown_keyboard';
  await page.getByText('PDF upload and analysis: Coming later.',{exact:true}).waitFor();
  stage='dropdown_keyboard';
  await page.getByRole('button',{name:'Career destinations'}).click();
  await page.getByRole('menuitem',{name:'Career catalog',exact:true}).waitFor();
  await page.keyboard.press('Escape');
  stage='logout_relogin';
  await page.getByRole('button',{name:'Log out',exact:true}).click();
  await page.waitForURL(base+'/');
  await page.getByRole('link',{name:'Log in',exact:true}).first().click();
  await page.getByLabel('Email',{exact:true}).fill(email);
  await page.getByLabel('Password',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.waitForURL('**/dashboard');
  await page.getByRole('link',{name:'Career',exact:true}).click();
  await page.getByRole('button',{name:'Current roadmap',exact:true}).waitFor();
  await page.goto(base+'/settings/profile');
  await page.getByLabel('First name',{exact:true}).waitFor();
  if(await page.getByLabel('First name',{exact:true}).inputValue()!=='Synthetic') throw new Error('Profile did not survive relogin.');
  stage='reflow';
  await page.setViewportSize({width:320,height:800});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)) throw new Error('Profile has horizontal overflow.');
  console.log(JSON.stringify({status:'passed',journey:'register/verify, empty focus, blank Discovery, saved results/provider failure, explicit focus, Career resume, Profile save/refresh, keyboard dropdown, logout/login, 320px reflow',external_provider_calls:0}));
} catch(error) {
  console.error(JSON.stringify({status:'failed',stage,reason:error.name}));
  process.exitCode=1;
} finally {
  if(browser) await browser.close();
  if(!uid) {
    const users=await fetch(config.API_URL+'/auth/v1/admin/users?per_page=1000',{headers:admin});
    if(users.ok) uid=(await users.json()).users.find(user=>user.email===email)?.id;
  }
  if(uid) {
    const removed=await fetch(config.API_URL+'/auth/v1/admin/users/'+uid,{method:'DELETE',headers:admin});
    if(!removed.ok) {console.error('Synthetic account cleanup failed.');process.exitCode=1;}
  }
}
