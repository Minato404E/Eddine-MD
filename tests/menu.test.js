import test from 'node:test';
import assert from 'node:assert/strict';
import {categories} from '../src/commands.js';
import {menuText as styledMenuText,arabicNames} from '../src/command-names.js';
const menuText=(...args)=>styledMenuText(...args).normalize('NFKC');

test('compact menus navigate to every category and retain full lists with owner visibility',()=>{
 const state={config:{name:'Eddine-MD',public:true}};
 for(const language of ['en','ar']){
  const ar=language==='ar',context={prefix:'!',language,host:true,arg:''};
  const main=menuText(categories,context,state);assert.ok(main.length<1000);assert.ok(!main.includes(ar?'!كتم':'!mute'));
  const links=[...main.matchAll(new RegExp('!(?:menu|اوامر) ([^\\n]+)','g'))].map(match=>match[1].replace(/\*$/,''));assert.equal(links.length,Object.keys(categories).length+1);
  for(const selector of links){const detail=menuText(categories,{...context,arg:selector},state);assert.ok(detail.includes(ar?'رجوع للأقسام':'BACK TO CATEGORIES'));}
  const all=menuText(categories,{...context,arg:ar?'الكل':'all'},state);
  for(const command of Object.values(categories).flat())assert.ok(all.includes('!'+(ar?arabicNames[command]:command)),command);
  const guest=menuText(categories,{...context,host:false},state);assert.ok(guest.includes('179'));assert.ok(!guest.includes(ar?'مالك الهوست':'HOST OWNER'));
  assert.throws(()=>menuText(categories,{...context,host:false,arg:'host'},state),/owner only/);
  assert.ok(!menuText(categories,{...context,arg:ar?'الكل':'all',host:false},state).includes(ar?'!تحديث_التحميل':'!updatemedia'));
 }
 const custom=menuText(categories,{prefix:'#',language:'en',host:false,arg:''},{config:{name:'My bot',public:false}});assert.ok(custom.includes('#menu group'));assert.ok(custom.includes('SELF'));assert.ok(custom.includes('My bot'));
});
