"use strict";(self.webpackChunkreact_social_media_2=self.webpackChunkreact_social_media_2||[]).push([[420],{4420:function(e,t,s){s.r(t);var a=s(4165),o=s(5861),r=s(9439),n=s(2791),l=s(7689),c=s(3900),u=s(1458),i=s(1243),m=s(2920),d=s(184);t.default=function(e){var t=(0,n.useState)(""),s=(0,r.Z)(t,2),p=s[0],f=s[1],h=(0,n.useState)(""),x=(0,r.Z)(h,2),b=x[0],v=x[1],y=(0,l.s0)(),g=(0,n.useContext)(c.Z),j=(0,n.useContext)(u.Z),N=function(){var e=(0,o.Z)((0,a.Z)().mark((function e(t){var s;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.prev=1,e.next=4,i.Z.post("/create-post",{title:p,body:b,token:j.user.token});case 4:s=e.sent,console.log("New post was created!"),f(""),v(""),g({type:"flashMessage",value:{message:"Post successfully created!",color:"success"}}),y("/post/".concat(s.data)),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),console.log("There was a problem.");case 15:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(t){return e.apply(this,arguments)}}();return(0,d.jsx)(m.Z,{title:"Create New Post",children:(0,d.jsxs)("form",{onSubmit:N,children:[(0,d.jsxs)("div",{className:"form-group",children:[(0,d.jsx)("label",{htmlFor:"post-title",className:"text-muted mb-1",children:(0,d.jsx)("small",{children:"Title"})}),(0,d.jsx)("input",{autoFocus:!0,onChange:function(e){return f(e.target.value)},name:"title",value:p,id:"post-title",className:"form-control form-control-lg form-control-title",type:"text",placeholder:"",autoComplete:"off"})]}),(0,d.jsxs)("div",{className:"form-group",children:[(0,d.jsx)("label",{htmlFor:"post-body",className:"text-muted mb-1 d-block",children:(0,d.jsx)("small",{children:"Body Content"})}),(0,d.jsx)("textarea",{onChange:function(e){return v(e.target.value)},name:"body",value:b,id:"post-body",className:"body-content tall-textarea form-control",type:"text"})]}),(0,d.jsx)("button",{className:"btn btn-primary",children:"Save New Post"})]})})}}}]);
//# sourceMappingURL=420.37e30a81.chunk.js.map