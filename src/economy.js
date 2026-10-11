import { PRIMARY, DAY } from './store.js';
export const JOBS={developer:{name:'Developer',base:180,tool:'laptop'},chef:{name:'Chef',base:150,tool:'oven'},driver:{name:'Driver',base:140,tool:'vehicle'},mechanic:{name:'Mechanic',base:160,tool:'toolbox'},doctor:{name:'Doctor',base:190,tool:'medkit'}};
export const SHOP={
 shield:{name:'Shield',price:1000,description:'Activate 24 hours of protection from robbery.'},
 coffer:{name:'Coffer',price:350,description:'Open for 200–600 coins.'},
 mysterybox:{name:'Mystery box',price:700,description:'Open for coins, a shield, or a job tool.'},
 booster:{name:'Work booster',price:900,description:'Double your next 3 work rewards.'},
 laptop:{name:'Laptop',price:3000,description:'Permanent Developer income +25%.'},
 oven:{name:'Oven',price:2500,description:'Permanent Chef income +25%.'},
 vehicle:{name:'Vehicle',price:4000,description:'Permanent Driver income +25%.'},
 toolbox:{name:'Toolbox',price:2500,description:'Permanent Mechanic income +25%.'},
 medkit:{name:'Medical kit',price:3500,description:'Permanent Doctor income +25%.'},
 admin:{name:'Group admin: 7 days',price:20000,description:'Only in a group whose owner enabled the admin shop.'}
};
export function amount(v){if(!/^\d+$/.test(String(v)))throw Error('Enter a positive whole number.');const n=Number(v);if(!Number.isSafeInteger(n)||n<1||n>1e9)throw Error('Amount must be between 1 and 1,000,000,000.');return n;}
export function user(s,id){const u=s.users[id];if(!u)throw Error('Register first: .register YourName');return u;}
export function register(s,id,name){if(s.users[id])throw Error('You are already registered.');if(!name?.trim()||name.length>32)throw Error('Name must be 1–32 characters.');s.users[id]={name:name.trim(),wallet:200,bank:0,inventory:{},equipped:[],shieldUntil:0,boosts:0,job:null,jobXp:0,lastDaily:0,lastWork:0,lastRob:0,createdAt:Date.now()};if(id===PRIMARY&&s.pendingFees){s.users[id].wallet+=s.pendingFees;s.pendingFees=0;}return s.users[id];}
export function daily(s,id,now=Date.now()){const u=user(s,id);if(u.lastDaily&&now-u.lastDaily<DAY)throw Error(`Daily ready in ${Math.ceil((DAY-(now-u.lastDaily))/60000)} minutes.`);u.wallet+=500;u.lastDaily=now;return u;}
export function work(s,id,now=Date.now()){const u=user(s,id);if(!u.job)throw Error('Choose a job: .job developer|chef|driver|mechanic|doctor');if(u.lastWork&&now-u.lastWork<1800000)throw Error(`Work ready in ${Math.ceil((1800000-(now-u.lastWork))/60000)} minutes.`);const j=JOBS[u.job];const level=1+Math.floor(u.jobXp/10);let earned=Math.floor(j.base*(1+(level-1)*0.1)*(u.equipped.includes(j.tool)?1.25:1));if(u.boosts){earned*=2;u.boosts--;}u.wallet+=earned;u.jobXp++;u.lastWork=now;return {earned,level:1+Math.floor(u.jobXp/10),u};}
export function bank(s,id,type,n){n=amount(n);const u=user(s,id);const from=type==='deposit'?'wallet':'bank',to=type==='deposit'?'bank':'wallet';if(u[from]<n)throw Error('Insufficient balance.');u[from]-=n;u[to]+=n;return u;}
export function pay(store,account,sender,target,n){n=amount(n);if(sender===target)throw Error('You cannot pay yourself.');return store.tx([account,PRIMARY],states=>{const s=states[account],u=user(s,sender),v=user(s,target);if(u.wallet<n)throw Error('Insufficient wallet balance.');const fee=Math.ceil(n*0.05),received=n-fee;if(received<1)throw Error('Minimum transfer: 2 coins.');u.wallet-=n;v.wallet+=received;const host=states[PRIMARY];if(host.users[PRIMARY])host.users[PRIMARY].wallet+=fee;else host.pendingFees=(host.pendingFees||0)+fee;return {fee,received,u};});}
export function buy(s,id,item,n=1){n=amount(n);if(n>100)throw Error('Maximum 100 items per purchase.');const p=SHOP[item];if(!p||item==='admin')throw Error('Use .buy admin inside an enabled group for admin access.');const u=user(s,id),price=p.price*n;if(u.wallet<price)throw Error('Insufficient wallet balance.');u.wallet-=price;u.inventory[item]=(u.inventory[item]||0)+n;return {u,price};}
export function use(s,id,item,random=Math.random){const u=user(s,id);if(!(u.inventory[item]>0))throw Error('You do not own this item.');let result;
 if(item==='shield'){u.shieldUntil=Math.max(Date.now(),u.shieldUntil)+DAY;result='Shield activated for 24 hours.';}
 else if(item==='booster'){u.boosts+=3;result='Next 3 work rewards doubled.';}
 else if(item==='coffer'){const reward=200+Math.floor(random()*401);u.wallet+=reward;result=`Coffer opened: +${reward} coins.`;}
 else if(item==='mysterybox'){const r=random();if(r<0.6){const reward=400+Math.floor(random()*1201);u.wallet+=reward;result=`Mystery box: +${reward} coins.`;}else{const drop=r<0.85?'shield':Object.values(JOBS)[Math.floor(random()*5)].tool;u.inventory[drop]=(u.inventory[drop]||0)+1;result=`Mystery box: ${SHOP[drop].name}. Use it with .use ${drop}`;}}
 else if(Object.values(JOBS).some(j=>j.tool===item)){if(u.equipped.includes(item))throw Error('This tool is already equipped.');u.equipped.push(item);result=`${SHOP[item].name} equipped permanently: matching job income +25%.`;}
 else throw Error('Unknown item.');u.inventory[item]--;return {u,result};}
export function rob(s,id,target,now=Date.now(),random=Math.random){if(id===target)throw Error('You cannot rob yourself.');const u=user(s,id),v=user(s,target);if(now-u.lastRob<3600000)throw Error('Robbery cooldown: 1 hour.');if(v.shieldUntil>now)throw Error('This player is protected by a shield.');if(v.wallet<20)throw Error('This player has fewer than 20 wallet coins.');u.lastRob=now;if(random()<0.8){const stolen=Math.min(1000,Math.max(1,Math.floor(v.wallet*0.15)));v.wallet-=stolen;u.wallet+=stolen;return {success:true,coins:stolen,u};}const fine=Math.min(u.wallet,150);u.wallet-=fine;return {success:false,coins:fine,u};}
