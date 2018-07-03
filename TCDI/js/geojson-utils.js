(function(){function A(a){for(var b=[],d=[],c=0;c<a[0].length;c++)b.push(a[0][c][1]),d.push(a[0][c][0]);b=b.sort(function(a,b){return a-b});d=d.sort(function(a,b){return a-b});return[[b[0],d[0]],[b[b.length-1],d[d.length-1]]]}var e=this.gju={};"undefined"!==typeof module&&module.exports&&(module.exports=e);e.lineStringsIntersect=function(a,b){for(var d=[],c=0;c<=a.coordinates.length-2;++c)for(var f=0;f<=b.coordinates.length-2;++f){var g=a.coordinates[c][1],l=a.coordinates[c][0],e=a.coordinates[c+
1][1],j=a.coordinates[c+1][0],h=b.coordinates[f][1],m=b.coordinates[f][0],s=b.coordinates[f+1][1],n=b.coordinates[f+1][0],p=(s-h)*(l-m)-(n-m)*(g-h),r=(e-g)*(l-m)-(j-l)*(g-h),h=(n-m)*(e-g)-(s-h)*(j-l);0!=h&&(p/=h,r/=h,0<=p&&(1>=p&&0<=r&&1>=r)&&d.push({type:"Point",coordinates:[g+p*(e-g),l+p*(j-l)]}))}0==d.length&&(d=!1);return d};e.pointInBoundingBox=function(a,b){return!(a.coordinates[1]<b[0][0]||a.coordinates[1]>b[1][0]||a.coordinates[0]<b[0][1]||a.coordinates[0]>b[1][1])};e.pointInPolygon=function(a,
b){for(var d="Polygon"==b.type?[b.coordinates]:b.coordinates,c=!1,f=0;f<d.length;f++)e.pointInBoundingBox(a,A(d[f]))&&(c=!0);if(!c)return!1;c=!1;for(f=0;f<d.length;f++){for(var g=a.coordinates[1],l=a.coordinates[0],k=d[f],j=[[0,0]],h=0;h<k.length;h++){for(var m=0;m<k[h].length;m++)j.push(k[h][m]);j.push([0,0])}k=!1;h=0;for(m=j.length-1;h<j.length;m=h++)j[h][0]>l!=j[m][0]>l&&g<(j[m][1]-j[h][1])*(l-j[h][0])/(j[m][0]-j[h][0])+j[h][1]&&(k=!k);k&&(c=!0)}return c};e.numberToRadius=function(a){return a*
Math.PI/180};e.numberToDegree=function(a){return 180*a/Math.PI};e.drawCircle=function(a,b,d){var c=[b.coordinates[1],b.coordinates[0]];a=a/1E3/6371;b=[e.numberToRadius(c[0]),e.numberToRadius(c[1])];d=d||15;for(var c=[[c[0],c[1]]],f=0;f<d;f++){var g=2*Math.PI*f/d,l=Math.asin(Math.sin(b[0])*Math.cos(a)+Math.cos(b[0])*Math.sin(a)*Math.cos(g)),g=b[1]+Math.atan2(Math.sin(g)*Math.sin(a)*Math.cos(b[0]),Math.cos(a)-Math.sin(b[0])*Math.sin(l));c[f]=[];c[f][1]=e.numberToDegree(l);c[f][0]=e.numberToDegree(g)}return{type:"Polygon",
coordinates:[c]}};e.rectangleCentroid=function(a){a=a.coordinates[0];var b=a[0][0],d=a[0][1];return{type:"Point",coordinates:[b+(a[2][0]-b)/2,d+(a[2][1]-d)/2]}};e.pointDistance=function(a,b){var d=a.coordinates[0],c=a.coordinates[1],f=b.coordinates[0],g=b.coordinates[1],l=e.numberToRadius(g-c),d=e.numberToRadius(f-d),c=Math.pow(Math.sin(l/2),2)+Math.cos(e.numberToRadius(c))*Math.cos(e.numberToRadius(g))*Math.pow(Math.sin(d/2),2);return 12742E3*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))};e.geometryWithinRadius=
function(a,b,d){if("Point"==a.type)return e.pointDistance(a,b)<=d;if("LineString"==a.type||"Polygon"==a.type){var c={};a="Polygon"==a.type?a.coordinates[0]:a.coordinates;for(var f in a)if(c.coordinates=a[f],e.pointDistance(c,b)>d)return!1}return!0};e.area=function(a){var b,d,c,f=0,g=a.coordinates[0];b=g.length-1;for(var e=0;e<g.length;b=e++)d=g[e][1],c=g[e][0],a=g[b][1],b=g[b][0],f+=d*b,f-=c*a;return f/2};e.centroid=function(a){var b,d,c,f,g,l=0,k=0,j=a.coordinates[0];d=j.length-1;for(var h=0;h<j.length;d=
h++)c=j[h][1],f=j[h][0],b=j[d][1],d=j[d][0],g=c*d-b*f,l+=(c+b)*g,k+=(f+d)*g;g=6*e.area(a);return{type:"Point",coordinates:[k/g,l/g]}};e.simplify=function(a,b){b=b||20;a=a.map(function(a){return{lng:a.coordinates[0],lat:a.coordinates[1]}});var d,c,f,g,e,k,j,h,m,s,n,p,r,t,u,q,y,z=0.5*(Math.PI/180),v=[],w=[],x=[];if(3>a.length)return a;d=a.length;s=360*b/(12756274*Math.PI);s*=s;f=0;w[0]=0;x[0]=d-1;for(c=1;0<c;)if(g=w[c-1],e=x[c-1],c--,1<e-g){n=a[e].lng()-a[g].lng();p=a[e].lat()-a[g].lat();180<Math.abs(n)&&
(n=360-Math.abs(n));n*=Math.cos(z*(a[e].lat()+a[g].lat()));r=n*n+p*p;k=g+1;j=g;for(m=-1;k<e;k++)h=a[k].lng()-a[g].lng(),t=a[k].lat()-a[g].lat(),180<Math.abs(h)&&(h=360-Math.abs(h)),h*=Math.cos(z*(a[k].lat()+a[g].lat())),u=h*h+t*t,q=a[k].lng()-a[e].lng(),y=a[k].lat()-a[e].lat(),180<Math.abs(q)&&(q=360-Math.abs(q)),q*=Math.cos(z*(a[k].lat()+a[e].lat())),q=q*q+y*y,h=u>=r+q?q:q>=r+u?u:(h*p-t*n)*(h*p-t*n)/r,h>m&&(j=k,m=h);m<s?(v[f]=g,f++):(c++,w[c-1]=j,x[c-1]=e,c++,w[c-1]=g,x[c-1]=j)}else v[f]=g,f++;v[f]=
d-1;f++;d=[];for(k=0;k<f;k++)d.push(a[v[k]]);return d.map(function(a){return{type:"Point",coordinates:[a.lng,a.lat]}})};e.destinationPoint=function(a,b,d){d/=6371;b=e.numberToRadius(b);var c=e.numberToRadius(a.coordinates[0]),f=e.numberToRadius(a.coordinates[1]);a=Math.asin(Math.sin(c)*Math.cos(d)+Math.cos(c)*Math.sin(d)*Math.cos(b));b=f+Math.atan2(Math.sin(b)*Math.sin(d)*Math.cos(c),Math.cos(d)-Math.sin(c)*Math.sin(a));b=(b+3*Math.PI)%(2*Math.PI)-Math.PI;return{type:"Point",coordinates:[e.numberToDegree(a),
e.numberToDegree(b)]}};e.boundingBoxAroundPolyCoords=A;})();