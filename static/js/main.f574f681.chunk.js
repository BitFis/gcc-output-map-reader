(this["webpackJsonpgmy-app"]=this["webpackJsonpgmy-app"]||[]).push([[0],{67:function(e,t,n){},68:function(e,t,n){},69:function(e,t,n){},80:function(e,t,n){"use strict";n.r(t);var i=n(0),s=n.n(i),a=n(37),c=n.n(a),o=(n(67),n(29)),r=n(13),l=n(26),d=n(27),u=(n(68),n(114)),h=n(118),S=n(109),b=n(116),g=n(112),j=n(119),f=n(58),m=(n(69),n(2)),p=function(e){var t=e.data,n=e.columns;return Object(m.jsx)("div",{children:Object(m.jsx)(f.a,{data:t,columns:n,search:!0,sort:!0,pagination:{enabled:!0,limit:200},className:{td:"dense-table-cell light-content",th:"dense-table-cell",footer:"dense-table-cell"}})})},v=n(110),x=n(120),O=n(113),A=n(115),N=n(117),E=n(53),y=n(54),R=function(){function e(t,n,i,s,a){Object(l.a)(this,e),this.Section=t,this.FullName=n,this.StartAddress=i,this.Size=s,this.FullFileName=a,this.Additonal=[],this.MangledList=[],this.AddressSpaceSize=-1,this.Name=void 0,this.Mangled="",this.FileName="",this.Module="";var c=/([^\(]+)\(([^\)]+)/g.exec(a);c?(this.FileName=c[1]||a,this.Module=c[2]||""):this.FileName=a;var o=/(\.[^\.]+)(.*)/g.exec(n);o?(this.Name=o[1]||"",this.Mangled=o[2]||""):this.Name=n}return Object(d.a)(e,[{key:"getNumRecords",value:function(){var e=0;return this.Size>0&&(e+=1,this.MangledList.length>0&&this.MangledList.sort((function(e,t){return e.AddressStart-t.AddressStart})).reduce((function(t,n){return t.AddressStart!=n.AddressStart&&e++,n}))),e}},{key:"parse",value:function(e){for(var t,n=/\n[^\.\n](\*[^\n]*| +)(0x[0-9a-fA-F]+|[^ ]+)? *([^\n]*)/gm,i=0,s=!1,a=0,c=0;null!=(t=n.exec(e));){var o=t[1];if(o)if(o.startsWith("*"))this.Additonal.push(o);else if(""===o.trim()){var r=t[2],l=t[3]?t[3]:"";if(!/^0x([0-9a-fA-F])+$/.test(r)){"[!provide]"!==r.trim()&&console.debug("Ignoring SubSection content '".concat(r,"' in ").concat(this.Section,":").concat(this.Name),e),s=!0;continue}if(r.length==I.ADDRESS_HEX_LENGTH){var d=parseInt(r,16),u=0;this.MangledList.length>0&&(u=d-a),this.MangledList.push({AddressStart:parseInt(r,16),MangledName:l,Size:u}),a=d,c+=u,s||(i+=1)}}else console.log("Potential SubSection parse issue in ".concat(this.Section,":").concat(this.Name," - strange start: '").concat(o,"' (expected * or ' ')"),e);else console.log("Potential SubSection parse issue in ".concat(this.Section,":").concat(this.Name),e)}return this.MangledList.length>0&&(this.MangledList[0].Size=this.Size-c),i}}]),e}(),T=function(){function e(t,n,i){Object(l.a)(this,e),this.Name=t,this.StartAddress=n,this.Size=i,this.NumRecords=0,this.AddressSpaceSize=0,this.SubSectionsList=[]}return Object(d.a)(e,[{key:"parse",value:function(e,t){for(var n,i=/ (\.[^ \t\n]+)\n? +(0x[0-9a-fA-F]+) +(0x[0-9a-fA-F]+) ?([^\n]+)?((\n [^\.][^\n]*)*)/gm;null!=(n=i.exec(e));){var s=n[1],a=n[2]?parseInt(n[2]):0,c=n[3]?parseInt(n[3]):0,o=n[4],r=new R(this.Name,s.replace(/\.text.+/,""),a,c,o);n[5]&&r.parse(n[5]),this.SubSectionsList.push(r),t.SubSections.push(r),this.NumRecords+=r.getNumRecords()}return this.SubSectionsList}},{key:"append",value:function(e){0==this.StartAddress?this.StartAddress=e.StartAddress:0!=e.StartAddress&&console.log("undefined behaviour, joining section ".concat(e.Name," - section exists twice with a address")),0==this.Size?this.Size=e.Size:0!=e.Size&&console.log("undefined behaviour, joining section ".concat(e.Name," - section exists twice with a size")),0==this.NumRecords?this.NumRecords=e.NumRecords:0!=e.NumRecords&&console.log("undefined behaviour, joining section ".concat(e.Name," - containing records twice"))}}]),e}(),I=function(){function e(){Object(l.a)(this,e),this.currentPos=0,this.Sections={},this.SubSections=[],this.Archives={}}return Object(d.a)(e,[{key:"parseArchiveMatch",value:function(e,t){e.length<4&&console.log("Unexpected parsing at character ".concat(e.index," - ").concat(t.lastIndex),e[0]);var n="".concat(e[1]),i={CompilationUnit:e[3],FileLocation:e[1],Symbol:e[2],SymbolCall:e[4]};this.Archives[n]||(this.Archives[n]={Archives:[],File:i.FileLocation,NumRecords:0}),this.Archives[n].NumRecords++,this.Archives[n].Archives.push(i)}},{key:"parseSectionMatch",value:function(e,t){if(e.length<=4)console.log("parser error at: ".concat(e.index," ").concat(t.lastIndex));else if(e.length>=3){var n,i,s=e[1],a=null===(n=e[2])||void 0===n?void 0:n.slice(2),c=null===(i=e[3])||void 0===i?void 0:i.slice(2);if(!s||!a&&c||a&&!c)return void console.warn("possible parsing error at character ".concat(e.index," - ").concat(t.lastIndex));var o=new T(s,a?parseInt(a,16):0,c?parseInt(c,16):0);o.parse(e[4],this),this.Sections[s]?this.Sections[s].append(o):this.Sections[s]=o}else console.log("parser error at: ".concat(e.index," ").concat(t.lastIndex))}},{key:"getSegmentRegex",value:function(t){var n=e.SEGMENT_STARTS_LIST.slice(),i=void 0,s=void 0;return new RegExp(e.ARCHIVE_START,"g").test(t)?(s="ARCHIVE",n.push(e.ARCHIVE_REGEX),i=this.parseArchiveMatch.bind(this)):new RegExp(e.SECTION_START,"g").test(t)&&(s="SECTION",n.push(e.SECTION_REGEX),i=this.parseSectionMatch.bind(this)),{Regex:new RegExp("(".concat(n.join("|"),")"),"gm"),ParseFunction:i,activeSegment:s}}},{key:"parse",value:function(t){for(var n,i={Regex:new RegExp("(".concat(e.SEGMENT_STARTS_LIST.join("|"),")"),"gm"),activeSegment:"START"};null!==(n=i.Regex.exec(t));){if(n[2])n.shift(),i.ParseFunction?i.ParseFunction(n,i.Regex,this):console.debug("unexpected match, no parsing function provided",n[0]);else{var s=i.Regex.lastIndex;(i=this.getSegmentRegex(n[1])).Regex.lastIndex=s}}}}]),e}();I.TurnOnAMPEquality=!1,I.ADDRESS_HEX_LENGTH=18,I.ADDRESS_MATCHER="(0x[0-9a-fA-F]{8,})",I.SECTION_SIZE_MATCHER="(0x[0-9a-fA-F]+)",I.SECTION_REGEX="\n(\\.[^ \n\\t]+)\n? *".concat(I.ADDRESS_MATCHER,"? *").concat(I.SECTION_SIZE_MATCHER,"?([^\n]*(\n [^\n]*)*)"),I.ARCHIVE_REGEX="\n([^\\(\n ]+)\\(([^\\)]+)\\)\n +([^\n ]+) +([^\n]+)",I.ARCHIVE_START="Archive member included to satisfy reference by file[^\n]*",I.SECTION_START="Linker script and memory map[^\n]*",I.SEGMENT_STARTS_LIST=[I.ARCHIVE_START,"Merging program properties[^\n]*","Discarded input sections[^\n]*","Memory Configuration[^\n]*",I.SECTION_START];var M=I;var C=function(e){var t=e.OnLoaded,n=Object(y.useFilePicker)({multiple:!1,accept:[".map"]}),s=Object(r.a)(n,4),a=s[0],c=s[1],o=(s[2],s[3]),l=Object(i.useState)(!1),d=Object(r.a)(l,2),u=d[0],h=d[1],b=Object(i.useState)(!1),g=Object(r.a)(b,2),j=g[0],f=g[1],p=Object(i.useState)(!1),v=Object(r.a)(p,2),x=v[0],R=v[1],T=Object(i.useState)(!1),I=Object(r.a)(T,2),C=I[0],_=I[1];return a[0]&&console.log("loading through filesystem currently not supported!",JSON.stringify(a)),Object(m.jsxs)("div",{children:[c.length>0?Object(m.jsxs)(O.a,{onClose:function(){return c.length=0},severity:"error",children:[Object(m.jsx)(A.a,{children:"Error occured while opening file!"}),JSON.stringify(c)]}):"",x?Object(m.jsxs)(O.a,{onClose:function(){return R(!1)},severity:"warning",children:[Object(m.jsx)(A.a,{children:x}),"Drop the file onto the region."]}):"",j?Object(m.jsxs)(O.a,{onClose:function(){return f(!1)},severity:"error",children:[Object(m.jsx)(A.a,{children:"Loading Dropped file failed!"}),j]}):"",Object(m.jsx)(E.FileDrop,{onDrop:function(e){h(!0),function(e){return 1===(null===e||void 0===e?void 0:e.length)?e.item(0).arrayBuffer().then((function(e){console.log("lets work on the file size: ",e.byteLength);var t="";new Uint8Array(e).forEach((function(e){t+=String.fromCharCode(e)}));var n=new M;return n.parse(t),n})):new Promise((function(t,n){n("provide one file!"),console.error(e)}))}(e).then(t).catch((function(e){return f(e)})).finally((function(){return h(!1)}))},onDragOver:function(){C||(_(!0),console.log("setHover(true)"))},onDragLeave:function(){C&&(_(!1),console.log("setHover(false)"))},children:Object(m.jsx)(S.a,{sx:{p:0,border:"1px dashed grey",m:"auto"},justifyContent:"center",justifyItems:"center",children:Object(m.jsx)(N.a,{disabled:o||u,onClick:function(){R("openFileSelector currently not supported")},sx:{p:3,m:"auto"},fullWidth:!0,style:C?{backgroundColor:"rgba(63, 81, 181, 0.04)"}:{},children:o||u?"Loading ...":"Drop output.map here"})})})]})};function _(e){return{id:"simple-tab-".concat(e),"aria-controls":"simple-tabpanel-".concat(e)}}var z=function(){return Object(m.jsxs)("div",{children:[Object(m.jsx)(u.a,{animation:!1,height:64}),Object(m.jsx)(u.a,{variant:"rectangular",animation:!1,height:500})]})},F=["Module","Size no .bss","Size","Num of records"],L=["Section","SubSection","AddressHex","Size","Demangled Name","Moduled Name","File Name","Mandled Name"],w=function(){function e(t){Object(l.a)(this,e),this.ColumnsOrder=t,this.Items=[]}return Object(d.a)(e,[{key:"add",value:function(e){var t=[];this.ColumnsOrder.forEach((function(n){t.push(e[n])})),this.Items.push(t)}}]),e}(),k=function(e){return"0x"+"0000000000000000".concat(e.toString(16)).slice(-16)},D=function(){var e=Object(i.useState)("all"),t=Object(r.a)(e,2),n=t[0],s=t[1],a=Object(i.useState)([]),c=Object(r.a)(a,2),l=c[0],d=c[1],u=Object(i.useState)([]),f=Object(r.a)(u,2),O=f[0],A=f[1];return Object(m.jsx)(h.a,{maxWidth:"lg",children:Object(m.jsxs)(S.a,{my:4,children:[Object(m.jsx)(b.a,{variant:"h4",component:"h1",gutterBottom:!0,children:"output.map viewer"}),Object(m.jsx)(C,{OnLoaded:function(e){var t=new w(L),n=new w(F),i={"Num of records":0,"Size no .bss":-1,Module:"",Size:0},s={};Object.keys(e.Archives).forEach((function(t){s[t]={"Num of records":0,"Size no .bss":-1,Module:t,Size:0,File:e.Archives[t].File}})),Object.keys(e.Sections).forEach((function(n){e.Sections[n].SubSectionsList.forEach((function(e){var n={"Demangled Name":"","File Name":e.FileName,"Mandled Name":e.Mangled.replace(/$\.(text|data)/g,""),Address:e.StartAddress,AddressHex:k(e.StartAddress),Section:e.Section,SubSection:e.Name,Size:e.Size,"Moduled Name":""},a=s[e.FileName];a||(a=i),a.Size+=e.Size,e.MangledList.length>0?e.MangledList.forEach((function(e){n["Mandled Name"]=e.MangledName,n.Size=e.Size,n.Address=e.AddressStart,n.AddressHex=k(e.AddressStart),t.add(n),e.Size>0&&a["Num of records"]++})):(e.Size>0&&a["Num of records"]++,t.add(n))}))})),n.add(i),Object.keys(s).forEach((function(e){n.add({"Num of records":s[e]["Num of records"],"Size no .bss":s[e]["Size no .bss"],Module:s[e].Module,Size:s[e].Size})})),d(t.Items),A(n.Items)}}),Object(m.jsxs)(v.a,{value:n,children:[Object(m.jsx)(S.a,{sx:{borderBottom:1,borderColor:"divider"},children:Object(m.jsxs)(g.a,{value:n,onChange:function(e,t){s(t)},"aria-label":"basic tabs example",children:[Object(m.jsx)(j.a,Object(o.a)({label:"All",value:"all"},_(0))),Object(m.jsx)(j.a,Object(o.a)({label:"By Module",value:"by_module"},_(1))),Object(m.jsx)(j.a,Object(o.a)({label:"By File (WIP)",value:"by_file"},_(2))),Object(m.jsx)(j.a,Object(o.a)({label:"By Section (WIP)",value:"by_section"},_(3))),Object(m.jsx)(j.a,Object(o.a)({label:"By SubSection (WIP)",value:"by_subsection"},_(4)))]})}),Object(m.jsx)(x.a,{value:"all",children:Object(m.jsx)(p,{data:l,columns:L})}),Object(m.jsx)(x.a,{value:"by_module",children:Object(m.jsx)(p,{data:O,columns:F})}),Object(m.jsx)(x.a,{value:"by_file",children:Object(m.jsx)(z,{})}),Object(m.jsx)(x.a,{value:"by_section",children:Object(m.jsx)(z,{})}),Object(m.jsx)(x.a,{value:"by_subsection",children:Object(m.jsx)(z,{})})]})]})})},H=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,121)).then((function(t){var n=t.getCLS,i=t.getFID,s=t.getFCP,a=t.getLCP,c=t.getTTFB;n(e),i(e),s(e),a(e),c(e)}))};c.a.render(Object(m.jsx)(s.a.StrictMode,{children:Object(m.jsx)(D,{})}),document.getElementById("root")),H()}},[[80,1,2]]]);
//# sourceMappingURL=main.f574f681.chunk.js.map