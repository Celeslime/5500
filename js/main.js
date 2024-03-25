// ■■的事情发生了 o‿≖✧
var timer,wd="",guess="~";
var speakFlag;
const speaker=new window.SpeechSynthesisUtterance();
var rand = document.getElementById('rand');
speaker.rate="0.8";
speaker.lang="en";

function search(){
	var elem=document.querySelector('#searchDiv input[name="word"]');
	wd=elem.value;
	// elem.value="";//想了想还是不要这样了
	translation.style.display = 'block';
	rexcard.style.display = 'none'
	footer.style.display = 'none'
	if(wd==""){
		location.reload();//摁下回车刷新吧≖‿≖✧
		scrollTo(0,0);
	}
	else if(dic[wd]){
		wdJump(wd);
	}
	else{
		wdName.innerHTML=wd;
		if(wd=="lyn"||wd=="sth"){
			wdExplain.innerHTML="有话好好说!!!";
			speaker.text="Hey guys";
			window.speechSynthesis.speak(speaker);
		}
		else if(wd=="正则表达式"){
			rex();
		}
		else{
			translation.style.display="none";
		} 
		research();
	}
}
var list=["none"],n=1;
var timer,intCircle;
function research(){
	resultUl.innerHTML="";
	list=[];n=0;
	for(var key in dic){//包含关系搜索
		if(key.search(wd)!=-1 && wd!=key){
			// if(n == 0){
			// 	list.push(
			// 		'<button class="jump jpTitle cardcontent" id="D'+(n++)+'">'+
			// 			"Ⅰ.包含关系"+
			// 		"</button>"
			// 	);
			// }
			list.push(
				'<button class="jump" onclick="wdJump(\''+key+'\');" id="D'+(n++)+'">'+
					key +
					'<span class="jpExplain">'+
						'<span class="wdFreq">'+calcLog(freqdic[key])+'</span>'+
						dic[key] +
					'</span>'+
				"</button>"
			);
		}
	}

	var beginning="^",alphaN=0,n0=n;
	if(wd.length >= 4 && wd[0] != "^"){//前缀搜索
		for(var i=0;i<4;i++){
			if("aeiou".includes(wd[i])){
				alphaN++;
			}
			beginning+=wd[i];
			if(alphaN==2){
				break;
			}
		}
		// alert(beginning);
		for(var key in dic){
			if(key.search(beginning)!=-1 && wd!=key){
				if(n==n0){
					list.push(
						'<button class="jump jpTitle cardcontent" id="D'+(n++)+'">'+
							"Ⅱ.前缀<span>"+beginning +"</span>"+
						"</button>"
						);
				}
				list.push(
					'<button class="jump" onclick="wdJump(\''+key+'\');" id="D'+(n++)+'">'+
						key +
						'<span class="jpExplain">'+
							'<span class="wdFreq">'+calcLog(freqdic[key])+'</span>'+
							dic[key] +
						'</span>'+
					"</button>"
					);
			}
		}
	}

	var endding="$",n1=n;alphaN=0;
	if(wd.length>=4 && wd[wd.length-1]!="$"){//后缀搜索
		for(var i = (wd.length-1); i >= (wd.length-4); i--){
			if("aeiou".includes(wd[i])){
				alphaN++;
			}
			endding = wd[i] + endding;
			if(alphaN == 2){
				if(wd[i-1])endding = wd[i-1]+endding;
				if(endding == 'tion$' || endding == 'tive$' || endding == 'sion$'){
					if(wd[i-2])endding = wd[i-2]+endding;
				}
				break;
			}
		}
		for(var key in dic){
			if(key.search(endding)!=-1 && wd!=key){
				if(n==n1){
					list.push(
						'<button class="jump jpTitle cardcontent" id="D'+(n++)+'">'+
							"Ⅲ.后缀<span>"+endding+"</span>"+
						"</button>"
					);
				}
				list.push(
					'<button class="jump" onclick="wdJump(\''+key+'\');" id="D'+(n++)+'">'+
						key +
						'<span class="jpExplain">'+
							'<span class="wdFreq">'+calcLog(freqdic[key])+'</span>'+
							dic[key] +
						'</span>'+
					"</button>"
				);
			}
		}
	}
	if(n==0){
		list.push(
			'<button class="jump jpTitle jpEpt" id="D'+(n++)+'">'+
				"什么都没有了::>_<::"+
			"</button>"
		);
	}
	n=0;
	clearInterval(timer);
	intCircle=150;
	timer=setInterval(frame,intCircle);
}
function frame(){
	if(n<list.length){
		resultUl.innerHTML+=list[n++];
		if(n!=1){
			document.querySelector("#Dm").id="Done";
		}
		document.querySelector("#D"+(n-1)).id="Dm";
		// scrollTo(0,20030821);
		if(n>=17){//我■■岁■■■■■■(。・・)ノ
			intCircle=1;
			clearInterval(timer);
			timer=setInterval(frame,intCircle);
		}
		if(n>=150){
			intCircle=400;
			clearInterval(timer);
			timer=setInterval(frame,intCircle);
		}
		if(n>=200){
			intCircle=1;
			clearInterval(timer);
			timer=setInterval(frame,intCircle);
		}
	}
	else{
		clearInterval(timer);
	}
}
function wdJump(twd){// 联想记忆法，实用又高效(..•˘_˘•..)
	wd = twd;
	translation.style.display = "block";
	rexcard.style.display = "none";
	footer.style.display = 'none'
	wdName.innerHTML = wd;
	wdExplain.innerHTML = '<span id="wdFreq" class="wdFreq"></span>' + dic[wd];
	wdFreq.innerHTML = calcLog(freqdic[wd]);
	if(speakFlag){
		speaker.text=wd;
		window.speechSynthesis.speak(speaker);
	}
	scrollTo(0,0);
	research();
}
function calcLog(n){
	if(n==0) return 0;
	return (Math.log(n)/Math.log(86015)*9).toFixed(0);
}
function speak(){// 你想听单词，那我就■■■■■■(*•̀ㅂ•́)و
	speaker.text = wdName.innerHTML;
	window.speechSynthesis.speak(speaker);
}
function onKeyPress(e) {//开车啦...不是...回车啦((٩(//̀Д/́/)۶))
	var keyCode=null;
	if(e.which)
		keyCode=e.which;
	else if(e.keyCode)
		keyCode=e.keyCode;
	if(keyCode == 13) {
		search();
		return false;
	}
	return true;
}
function rex() {//要不要了解一下正则表达式呐ฅ(๑*д*๑)ฅ
	translation.style.display = 'none';
	rexcard.style.display = 'block'
}
function example(){
	document.querySelector('#searchDiv input[name="word"]').value="^acc.*(tion|ing)$";
	search();
}
function randWd(){
	var jumpId = Math.floor(Math.random()*(Object.keys(dic).length));
	var jumpWd = Object.keys(dic)[jumpId];
	wdJump(jumpWd);
}
function switchV(){
	var tem = volume_on.style.display;
	volume_on.style.display = volume_off.style.display;
	volume_off.style.display = tem;
	speakFlag = (volume_on.style.display == 'block');
	localStorage['speakFlag'] = speakFlag;
}
// rand在移动端自由移动位置
rand.addEventListener('touchstart', function(e){
	var disX = e.touches[0].clientX - rand.offsetLeft;
	var disY = e.touches[0].clientY - rand.offsetTop;
	var left = rand.style.left;
	var top = rand.style.top;
	var handler = function(e){
		rand.style.left = e.touches[0].clientX - disX + 'px';
		rand.style.top = e.touches[0].clientY - disY + 'px';
	}
	document.addEventListener('touchmove', handler);
	document.addEventListener('touchend', function(e){
		document.removeEventListener('touchmove', handler)
		document.removeEventListener('touchend', arguments.callee)
		if(left == rand.style.left && top == rand.style.top){
			randWd();
		}
	})
	e.preventDefault();
	return false;
}, { passive: false })
// rand在PC端自由移动位置
rand.onmousedown = function(e){
	var disX = e.clientX - rand.offsetLeft;
	var disY = e.clientY - rand.offsetTop;
	var left = rand.style.left;
	var top = rand.style.top;
	document.onmousemove = function(e){
		rand.style.left = e.clientX - disX + 'px';
		rand.style.top = e.clientY - disY + 'px';
	}
	document.onmouseup = function(){
		document.onmousemove = null;
		document.onmouseup = null;
		if(left == rand.style.left && top == rand.style.top){
			randWd();
		}
	}
	return false;
}
speakFlag = (localStorage['speakFlag'] == 'true');
volume_on.style.display = speakFlag? 'block':'none';
volume_off.style.display= speakFlag? 'none':'block';
document.querySelector("#searchDiv > input[type=text]").focus();
console.log("\n\n\n\n\n        萌是深藏不漏的✿◡‿◡\n\n\n\n\n\n");