import { expect, test } from "@playwright/test";
test("auth rate limit returns safe 429",async({page})=>{const b=process.env.KCIASSO_BACKEND_URL??"http://127.0.0.1:4490";const data={email:`unknown-${Date.now()}@example.com`,password:"wrong"};const headers={"x-forwarded-for":`10.84.0.${Math.floor(Math.random()*200)+1}`};const statuses:number[]=[];let retry="";for(let i=0;i<8;i++){const r=await page.request.post(`${b}/api/user/authenticate`,{data,headers});statuses.push(r.status());retry=r.headers()["retry-after"]??retry}expect(statuses.some(s=>s===429)).toBe(true);expect(retry).not.toBe("")});



