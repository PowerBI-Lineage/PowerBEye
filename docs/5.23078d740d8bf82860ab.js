(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"ct+p":function(t,e,n){"use strict";n.r(e),n.d(e,"HomeModule",function(){return d});var o=n("SVse"),r=n("iInd"),c=n("8Y7J"),s=n("IheW");let i=(()=>{class t{constructor(t){this.httpService=t}getModifedWorkspaces(){return this.httpService.get("https://biazure-int-edog-redirect.analysis-df.windows.net/v1.0/myorg/admin/workspaces/modified")}}return t.\u0275fac=function(e){return new(e||t)(c.Qb(s.a))},t.\u0275prov=c.Fb({token:t,factory:t.\u0275fac}),t})();const a=[{path:"",component:(()=>{class t{constructor(t){this.proxy=t}ngOnInit(){}sendModifyWorkspaces(){this.proxy.getModifedWorkspaces().subscribe(t=>{console.log(t)})}}return t.\u0275fac=function(e){return new(e||t)(c.Jb(i))},t.\u0275cmp=c.Db({type:t,selectors:[["home-container"]],decls:5,vars:0,consts:[[1,"container"],[3,"click"]],template:function(t,e){1&t&&(c.Mb(0,"section",0),c.Mb(1,"p"),c.hc(2,"home-container works!"),c.Lb(),c.Mb(3,"button",1),c.Tb("click",function(){return e.sendModifyWorkspaces()}),c.hc(4,"test"),c.Lb(),c.Lb())},styles:["[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{display:block;height:calc(100%);height:-webkit-calc(100%);overflow:hidden}"]}),t})()}];let p=(()=>{class t{}return t.\u0275mod=c.Hb({type:t}),t.\u0275inj=c.Gb({factory:function(e){return new(e||t)},imports:[[r.b.forChild(a)],r.b]}),t})(),d=(()=>{class t{}return t.\u0275mod=c.Hb({type:t}),t.\u0275inj=c.Gb({factory:function(e){return new(e||t)},providers:[i],imports:[[o.b,p]]}),t})()}}]);