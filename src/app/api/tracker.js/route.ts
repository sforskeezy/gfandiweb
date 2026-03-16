import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "";
  const origin = req.nextUrl.origin;

  const script = `(function(){
  try{
    var id="${id}";
    var sid=sessionStorage.getItem("_6p_sid");
    if(!sid){sid=Math.random().toString(36).slice(2)+Date.now().toString(36);sessionStorage.setItem("_6p_sid",sid);}
    var d={id:id,path:location.pathname+location.search,referrer:document.referrer||"",sw:screen.width,sh:screen.height,sid:sid};
    fetch("${origin}/api/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d),keepalive:true});
  }catch(e){}
})();`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
