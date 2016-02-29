
var crud=function(params){ 
  var opts,cps,macode;
  var model,types,http;
  macode="6a27ffa413";
   opts={
      "datas":{},
      "current":{},
      "pageSize":5,
      "currentIndex":NaN,
      "lastIndex":NaN,
      "reflash":false,
      "preIndex":function(){
        return this.currentIndex-1>=0?this.currentIndex-1:0;
      },
      "nextIndex":function(){
        return this.currentIndex+1<this.datas.length?this.currentIndex+1:0;
      },
      "selected":[],
      "currentPage":0,
      "prePage":function(){
        var i;
        i=this.currentPage-1>=0?this.currentPage-1:0;
        this.set('currentPage',i);
        return i;
      },
      "nextPage":function(){
        var i;
        i=this.currentPage+1<this.pages().length-1?this.currentPage+1:this.pages().length-1;
        this.set('currentPage',i);
        return i;
      },
      "goPage":function(n){
        var i;
        i=n>this.pages().length||n<=0?0:n;
        this.set('currentPage',i);
        return i;
      },
      "pages":function(){
        var p=[];
        for(var i=0;i<Math.ceil(this.count/this.pageSize);i++){
          p.push(i+1);
        }
        return p;
      },
      "path":"",
      "query":{},
      "search":{},
      "url":function(){
        var s="";
        var d=[];
        var opts={};
        var query;

        opts['limit']=this.pageSize;
        opts['skip']=this.pageSize*this.currentPage;
        for(var x in opts){
          d.push(x+'='+opts[x]);
        }
        s=d.join('&');
        try{
          query=JSON.stringify(this.query);
        }catch(e){
          query="{}";
        }
        return this.path+'?query='+query+'&'+s;
      },
      "newId":function(){
        var time=(new Date()).getTime();
        var addzero=function(num,dec){
          var len;
          num=num.toString();
          len=num.length;
          if (num.length>dec){
            num=num.slice(num.length-dec);
          }else{
            while(len<dec){
              num="0"+num;
              len++;
            }
          }
          return num;
        }
        return Math.ceil(time/1000).toString(16)+macode+addzero(time%1000,3)+"001";
      },
      "mainKey":"_id",
      "count":0,
      "error":'',
      "now":function(id){
        if (this.datas[id]){
          this.current=copy(this.datas[id]);
        }else{
          this.current={};
        }
      },
      "find":function(){
        var q={};
        for (var x in this.search){
          if (!this.search[x]==""){
            q[x]=this.search[x];
          }
        }
        console.log(q);
        this.set('query',copy(q)); 
      },
      "validate":function(data,model,types){
        var error={};
        for(var x in model){
          if (typeof(data[x])!=="undefined"){
              // if(model[x].minlen||model[x].maxlen){
              //   if (model[x].minlen&&data[x].length<model[x].minlen){
              //     error[x]={code:1,error:"长度不能小于 "+model[x].minlen,type:model[x].type};
              //   }
              //   else if (model[x].maxlen&&data[x].length>model[x].maxlen){
              //     error[x]={code:1,error:"长度不能大于 "+model[x].maxlen,type:model[x].type};
              //   }
              //   data[x].length<model[x].minlength||data[x].length>model[x].maxlength
                  
              // }else if (!types[model[x].type]||!types[model[x].type].test(data[x])){
              //     error[x]={code:2,error:"数据格式错误",type:model[x].type};
              // }
              console.log(types[model[x].type])
          }else if(!model[x].isnull){
            error[x]={code:3,error:"不能为空！"};
          }

        }
        return error;
      },
      "save":function(){
        var id,self,fn,error;
        self=this;
        fn=function(){
          cps=copy(self);
          id=self.current[self.mainKey];
          if (!id){
            id=self.newId();
            self.current[self.mainKey]=id;
          }
          self.datas[id]=copy(self.current);
          flash();
        }
        error=self.validate(self.current,model,types);
        console.log(error);
        if (model&&types){
          if (isEmpty(error))
          {
            fn();
          }else{
            self.error=error;
          }
        }else{
          fn();
        } 
      },
      "select":function(id){
        var flag;
        for(var i in this.selected){
          if (this.selected[i]==id){
            this.selected.splice(i,1);
            flag=1;
          }
        }
        if (!flag){
          this.selected.push(id);
        }
      },
      "remove":function(ids){
        if (!confirm("确定要删除 "+ids.toString()+" 吗？")) return ;
        cps=copy(this);
        if(Array.isArray(ids)){
          for( var x in ids){
            delete opts.datas[ids[x]];
          }
        }
        flash(function(){opts.selected=[];});
      },
      "get":function(key){
        var opt;
        opt=this[key];
        if (!opt)
        {
          return undefined;
        }
        if (typeof opt == "function")
        {
          return opt();
        }
        return opt;
      },
    "set":function(key,value){
      var fn,obj;
      cps=copy(this);
      obj={};
      if (typeof(key)!="object"){
        obj[key]=value;
      }else{
        obj=key;
      }
      for(var x in obj){
        if (typeof(this[x])=="function"||typeof(this[x])!=typeof(obj[x])){
          return new TypeError(x+' is not valid!');
        }
      }
      for(var x in obj){
        this[x]=obj[x];
      }
      flash();
    },
    "init":function(params){
      var url,path,search,count,s,d,t;
      url=params.url||"";
      http=params.http;
      model=params.model;
      types=params.types;
      //url分析
      path=url.match(/.*?(?=\?)/)?url.match(/.*?(?=\?)/)[0]:url;
      search=url.match(/\?.*/)?url.match(/\?.*/)[0].replace('?',''):"";
      d={};
      if (search){
        s=search.split('&');
        for(var x in s){
          t=s[x].split('=');
          d[t[0]]=t[1];
        }
      }
      this.set({"path":path,"query":d});
      return this;
    }
  };
    

  var isEmpty=function(obj){
    if (typeof(obj)==="undefined") return true;
    if (Object.keys(obj).length==0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  var copy=function(src){
    if (!src) {return src;}
    var dec;
    var types=[Number,String,Boolean,Date,RegExp];
    for(var i in types)
    {
      if (src instanceof types[i]) return dec=new types[i](src);
    }
    //array
    if (Array.isArray(src)){
      dec=[];
      for(var x in src)
      {
        dec[x]=copy(src[x]);
      }
    } else if (src.nodeType && typeof src.cloneNode == "function") {
          dec = src.cloneNode( true );    
    } else if (Object.prototype.toString.call(src)=="[object Object]"&&!src.prototype){
          dec={};
          for(var x in src)
          {
            dec[x]=copy(src[x]);
          }
    } else{
        //constructor/Math/error...
        dec=src;
    }
    return dec;
  }
  
  //对象键差
  var diffStuct=function(src,dec){
    var df={};
    if (Object.prototype.toString.call(src)!=Object.prototype.toString.call(dec)){
      return src;
    }
    
    for(var x in src){
      if (!dec.hasOwnProperty(x)){
        df[x]=src[x];
      }
    }
    
    return df;
  }
  //对象值查差
  var diffValue=function(src,dec){
    var df,t;
    if (typeof(dec)=="undefined"){
      return ;
    }
    if (Array.isArray(src)||Object.prototype.toString.call(src)=="[object Object]"){
       for(var x in src){
        t=diffValue(src[x],dec[x]);
        if (typeof(t)!=="undefined") {
          df=df?df:new Object(); 
          df[x]=t;
        }
       }
       return df;
    }
    else{
      if (src!==Object(src)||dec!==Object(dec)){
        if (src!==dec) return src;
      }else{
        try{
          if (src.toString()!=dec.toString()){
            return src;
          }
        }catch(e){
          return src;
        }
      } 
    } 
  };

  //合并对象
  var combine=function(src,dec){
    if (typeof(src)!=="object") return {};
    if (typeof(dec)!=="object") dec={};
    for(var x in dec){
      src[x]=dec[x];
    }
    return src;
  }
  //取得对象的第一个键
var objectKey=function(obj){
  var keys;
  keys=Object.keys(obj);
  return keys.length>0?keys[0]:undefined;
 }
 //取得对象的第一个值
 var objectValue=function(obj){
  var values,key;
  key=objectKey(obj);
  return key?obj[key]:undefined;

 }
 //结构化的数据转换成以key为键的对象 toObject([{_id:1,c:1},{_id:2,c:2},{_id:3,c:3}],'_id')
 var toObject=function(o,key){
  if (typeof(o)!=="object"){
    console.log(new TypeError('参数不是对象！'));
    return false;
  } 
  var obj={};
  var k;
  for(var x in o){
    if (!o[x].hasOwnProperty(key)){
      console.log(new TypeError(key+'不存在！'));
      return false;
    }else{
      k=o[x][key];
      obj[k]=o[x];
    }
  }
  return obj;
    
 }
  var flash=function(callback){
    var method,headers,request,data,fn,_id,path,url,mainKey;
    var d1,d2,d3,d4;
    path=opts.path;
    mainKey=opts.mainKey;
    d1=diffValue(opts.datas,cps.datas);//修改的内容
    d2=diffStuct(opts.datas,cps.datas);//增加的内容
    d3=diffStuct(cps.datas,opts.datas);//减少的内容
    d4=diffValue(opts.url(),cps.url());//是否查询新数据
    request={};
    fn=function(){
      request.url=url;
      request.method=method;
      request.headers={'Content-Type':'application/x-www-form-urlencoded'};
      request.withCredentials=true;
      if (data) request.data=data;
      opts.error="";
      http(request).success(function(res){
        if (request.method=="GET"){
          var r=toObject(res.data,mainKey);
          if (r){
            opts.datas=r;
          }else{
            opts.error=r;
          }
          opts.count=res.count;
        }else if(request.method=="POST"){
          opts.current=res.data;
          id=res.data[opts.mainKey];
          opts.datas[id]=copy(res.data);
          opts.count+=parseInt(res.count)||0;
        }else if(request.method=="PUT"){
          opts.current=combine(opts.current,res.data);
          id=res.data[opts.mainKey];
          //opts.datas[id]=copy(opts.current);
        }
        else if (request.method=="DELETE") {
          opts.count-=parseInt(res.count)||0;
        }
        if (typeof(callback)=="function"){
          callback();
        }
      }).error(function(res){
          opts.error=res;
      }).finally(function(data){
          if (opts.error){
            opts.datas=copy(cps.datas);
          }
          
        });
    }
    //修改
    if (!isEmpty(d1)){
      id=objectKey(d1);
      url=path+'/'+id+'/';
      if (id){
        data=d1[id];
        method="PUT";
        fn();
      }
    }
    //增加
    else if (!isEmpty(d2)){
      url=path;
      data=objectValue(d2);
      method="POST";
      fn();
    }
    //删除
    else if (!isEmpty(d3)){
      url=path;
      data={};
      data[mainKey]=Object.keys(d3);
      method="DELETE";
      fn();
    } 
    //查询
    else if (d4)
    {
      url=opts.url();
      method="GET";
      data="";
      fn();
    }
    
  }
  
  return opts.init(params);

}     

