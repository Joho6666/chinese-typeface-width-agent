/*
 * 汉字字宽调整 / Adobe Illustrator ExtendScript (JSX)
 * 操作：安装 Illustrator 后运行；macOS 可经 osascript；Windows 可经 PowerShell COM。
 * CONFIG: environment variable not consistently available via ExtendScript.
 * Invocation scripts write config to project/.run-config.txt in UTF-8 with lines: outputDir;className
 * Entry script expects saved file in Illustrator's File > Scripts or via do javascript.
 */
(function(){
  var root = File($.fileName).parent.parent;
  var config = File(root.fsName + '/.run-config.txt');
  var outDir = Folder(root.fsName + '/output');
  var className = '班级名称';
  function readCfg() {
    if (!config.exists) return;
    config.encoding = 'UTF-8';
    config.open('r');
    var s = config.read();
    config.close();
    var p = s.split(/\r?\n/);
    if (p[0]) outDir = Folder(p[0]);
    if (p[1]) className = p[1].replace(/[\\\/:*?"<>|]/g, '_');
  }
  readCfg();
  function rgb(hex) {
    var c = new RGBColor();
    hex = hex.replace('#','');
    c.red = parseInt(hex.substr(0,2),16);
    c.green = parseInt(hex.substr(2,2),16);
    c.blue = parseInt(hex.substr(4,2),16);
    return c;
  }
  var W=841.8898, H=595.2756;
  var SX=W/1600, SY=H/1131;
  function X(v){return v*SX;}
  function Y(v){return H-v*SY;}
  function rect(doc,x,y,w,h,fill,stroke,width){
    var p = doc.pathItems.rectangle(Y(y),X(x),X(w),h*SY);
    p.filled = !!fill;
    if(fill) p.fillColor=rgb(fill);
    p.stroked=!!stroke;
    if(stroke) {p.strokeColor=rgb(stroke);p.strokeWidth=(width||1)*SX;}
    return p;
  }
  function line(doc,x1,y1,x2,y2,col,width){
    var p=doc.pathItems.add();
    p.setEntirePath([[X(x1),Y(y1)],[X(x2),Y(y2)]]);
    p.filled=false;p.stroked=true;p.strokeColor=rgb(col);
    p.strokeWidth=(width||1)*SX;
    return p;
  }
  var chosenFont=null;
  function chooseFont(){
    var preferred=['NotoSansCJK','SourceHanSans','PingFang','MicrosoftYaHei','SimHei','Heiti'];
    for(var k=0;k<preferred.length;k++){
      for(var i=0;i<app.textFonts.length;i++){
        var font=app.textFonts[i], n=(font.name || '') + (font.family || '');
        if(n.toLowerCase().indexOf(preferred[k].toLowerCase())>=0) { return font; }
      }
    }
    return null;
  }
  function label(doc,s,x,y,sz,color){
    var t=doc.textFrames.add();
    t.contents=s;
    t.position=[X(x),Y(y)];
    var attr=t.textRange.characterAttributes;
    attr.size=sz*SY;
    attr.fillColor=rgb(color||'#19252D');
    if(chosenFont) attr.textFont=chosenFont;
    return t;
  }
  function cell(doc,c,x,y,size,target,kind,idx) {
    rect(doc,x,y,size,size,'#F6FAFC','#CBD8DE',1.5);
    line(doc,x+size/2,y+12,x+size/2,y+size-12,'#E6EEF2',1);
    line(doc,x+12,y+size/2,x+size-12,y+size/2,'#E6EEF2',1);
    var t=label(doc,c,x+20,y+size-15,180,'#19252D');
    var g=t.createOutline();
    g.name=kind+'-'+idx+'-'+c;
    var b=g.visibleBounds;
    var gw=b[2]-b[0], gh=b[1]-b[3];
    if(gw<=0 || gh<=0) throw new Error('Glyph could not be outlined: '+c);
    // Align actual glyph ink bounds, NOT font's nominal em-box.
    g.resize(target*SX/gw*100,target*SY/gh*100);
    b=g.visibleBounds;gw=b[2]-b[0];gh=b[1]-b[3];
    var wantedCx=X(x+size/2), wantedCy=Y(y+size/2);
    g.translate(wantedCx-(b[0]+b[2])/2, wantedCy-(b[1]+b[3])/2);
    label(doc,('0'+idx).slice(-2)+' / '+c,x+size/2-26,y+276,15,'#65737D');
    return g;
  }
  function ensure(folder){ if(!folder.exists && !folder.create())throw Error('Cannot create: '+folder.fsName); }
  function writeReport(dir,s){var f=File(dir.fsName+'/generation-report.txt');f.encoding='UTF-8';f.open('w');f.write(s);f.close();}
  var doc=null;
  try{
    if(app.documents.length && !confirm('Illustrator 中可能有打开的文档。本脚本将另建文件，不会修改已有文档。继续吗？')) return;
    ensure(outDir);
    var targetDir = Folder(outDir.fsName+'/'+className);
    var aiDir=Folder(targetDir.fsName+'/AI源文件');
    var jpgDir=Folder(targetDir.fsName+'/JPG效果图');
    ensure(targetDir);ensure(aiDir);ensure(jpgDir);
    chosenFont=chooseFont();
    if(!chosenFont) throw new Error('未找到可用中文字体。请安装思源黑体/Noto Sans CJK 后重试。');
    doc = app.documents.add(DocumentColorSpace.RGB,W,H);
    doc.artboards[0].artboardRect=[0,H,W,0];
    doc.rulerUnits=RulerUnits.Points;
    doc.layers[0].name='字形轮廓与版式';
    rect(doc,0,0,1600,1131,'#FFFFFF',null,0);
    rect(doc,86,67,7,83,'#009EC9',null,0);
    label(doc,'TYPOGRAPHY / FIELD STUDY',116,93,19,'#009EC9');
    label(doc,'汉字字宽调整',116,168,68,'#19252D');
    label(doc,'通过统一字身网格观察字形宽度、视觉高度与字面比例',119,209,20,'#65737D');
    label(doc,'TYPE / 01',1360,93,18,'#65737D');
    line(doc,86,244,1515,244,'#AEBEC6',1.3);
    var sets=[
      {word:'科技创新',cn:'大字面',en:'LARGE CHARACTER FACE',y:360,t:217,code:'LARGE'},
      {word:'梦想启航',cn:'小字面',en:'SMALL CHARACTER FACE',y:750,t:176,code:'SMALL'}
    ];
    for(var r=0;r<2;r++){
      var a=sets[r];
      rect(doc,86,a.y+19,45,45,r===0?'#19252D':'#009EC9',null,0);
      label(doc,r===0?'A':'B',98,a.y+52,24,'#FFFFFF');
      label(doc,a.cn,86,a.y+115,35,'#19252D');
      label(doc,a.en,88,a.y+153,14,'#65737D');
      rect(doc,86,a.y+188,25,4,'#009EC9',null,0);
      label(doc,'可见字面 / 字身',88,a.y+223,16,'#65737D');
      label(doc,r===0?'约 89%':'约 72%',88,a.y+254,35,'#19252D');
      for(var i=0;i<4;i++){
        cell(doc,a.word.charAt(i),340+i*290,a.y,245,a.t,a.code,i+1);
      }
      if(r===0)line(doc,86,692,1515,692,'#D9E3E8',1);
    }
    line(doc,86,1043,1515,1043,'#AEBEC6',1.3);
    label(doc,'汉字字面比例与视觉统一练习',87,1085,18,'#19252D');
    var aiFile=File(aiDir.fsName+'/汉字字宽调整.ai');
    var opts=new IllustratorSaveOptions();opts.pdfCompatible=true;
    doc.saveAs(aiFile,opts);
    var jpgFile=File(jpgDir.fsName+'/汉字字宽调整.jpg');
    var jpeg=new ExportOptionsJPEG();
    jpeg.antiAliasing=true;jpeg.artBoardClipping=true;jpeg.qualitySetting=100;
    jpeg.horizontalScale=300/72*100;
    jpeg.verticalScale=300/72*100;
    doc.exportFile(jpgFile,ExportType.JPEG,jpeg);
    doc.close(SaveOptions.DONOTSAVECHANGES);
    doc=null;
    if(!aiFile.exists || !jpgFile.exists) throw Error('Missing export after save');
    var reopened=app.open(aiFile);
    var ok=reopened.artboards.length===1;
    reopened.close(SaveOptions.DONOTSAVECHANGES);
    writeReport(targetDir,'status='+ (ok?'FILE_REOPEN_OK':'FAIL_ARTBOARD')+
      '\nai='+aiFile.fsName+'\njpg='+jpgFile.fsName+
      '\nai_bytes='+aiFile.length+'\njpg_bytes='+jpgFile.length+
      '\nnote=Must visually inspect individual glyph paths and JPG size before delivery.');
    if(!ok) throw Error('Validation failed: artboard count');
    alert('已生成 AI 与 JPG。请打开 JPG 复核字形。\n'+targetDir.fsName);
  } catch(err) {
    try { if(doc) doc.close(SaveOptions.DONOTSAVECHANGES); } catch(_){}
    alert('生成失败：'+err+' [line '+(err.line||'?')+']');
    throw err;
  }
})();
