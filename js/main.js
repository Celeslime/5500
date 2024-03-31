// 奇妙的事情发生了 o‿≖✧
var timer,wd="",guess="~";
var speakFlag;
const speaker=new window.SpeechSynthesisUtterance();
var rand = document.getElementById('rand');
var includes_list = document.getElementById('includes_list');
var prefix_list = document.getElementById('prefix_list');
var suffix_list = document.getElementById('suffix_list');
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
		if(wd=="sth"){
			wdName.innerHTML = "The reading speed has been set to 1.0x"
			wdExplain.innerHTML="朗读速度设置为 1.0x (●'◡'●)";
			speaker.rate="1";
			speak();
		}
		else if(wd=="lyn"){
			wdName.innerHTML = "The reading speed has been set to 1.2x"
			wdExplain.innerHTML="朗读速度加速为 1.2x ( ´･･)ﾉ(._.`)";
			speaker.rate="1.2";
			speak()
		}
		else if(!isNaN(wd)){
			var a = parseFloat(wd).toFixed(1);
			wdName.innerHTML = "The reading speed has been set to "+a+"x";
			wdExplain.innerHTML="朗读速度设置为 "+a+"x ( ´･･)ﾉ(._.`)";
			speaker.rate=a;
			speak();
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
var list=[],n=1;
var timer,intCircle;
function research(){
	// result_lists.innerHTML = "";
	inclusive_list.innerHTML = "";
	prefix_list.innerHTML = "";
	suffix_list.innerHTML = "";
	list=[];n=0;
	for(var key in dic){//包含关系搜索
		if(key.search(wd)!=-1 && wd!=key){
			var conslusiveWordButton = document.createElement("button");
			conslusiveWordButton.className = "jump";
			conslusiveWordButton.title = key;
			conslusiveWordButton.innerHTML = key + '<span class="jpExplain">'+
				getFreqSpan(freqdic[wd]).outerHTML+dic[key] +'</span>';
			conslusiveWordButton.onclick = function(){wdJump(this.title);}
				
			inclusive_list.appendChild(conslusiveWordButton);
		}
	}

	var beginning = "^", alphaN = 0, n0 = n;
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
		for(var key in dic){
			if(key.search(beginning) != -1 && wd != key){
				var prefixWordButton = document.createElement("button");
				if(n == n0){
					var prefixTitleDiv = document.createElement("div");
					prefixTitleDiv.className = "jump jpTitle cardcontent";
					prefixTitleDiv.innerHTML = "Ⅱ.前缀" + "<span>" + beginning + "</span>";
					// list.push(prefixTitleDiv.outerHTML);
					prefix_list.appendChild(prefixTitleDiv);
					n++;
				}
				prefixWordButton.className = "jump";
				prefixWordButton.title = key;
				prefixWordButton.onclick = function(){wdJump(this.title);}
				prefixWordButton.innerHTML = key + "<span class='jpExplain'>"+getFreqSpan(freqdic[wd]).outerHTML+dic[key]+"</span>";
				prefix_list.appendChild(prefixWordButton);
				n++
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
					var suffixTiTleButton = document.createElement("div");
					suffixTiTleButton.className = "jump jpTitle cardcontent";
					suffixTiTleButton.innerHTML = "Ⅳ.后缀<span>"+endding+"</span>";
					suffix_list.appendChild(suffixTiTleButton);
					n++;
				}
				var suffixWordButton = document.createElement("button");
				suffixWordButton.className = "jump";
				suffixWordButton.title = key;
				suffixWordButton.onclick = function(){wdJump(this.title);}
				suffixWordButton.innerHTML = key + "<span class='jpExplain'>"+getFreqSpan(freqdic[wd]).outerHTML+dic[key]+"</span>";
				suffix_list.appendChild(suffixWordButton);
				n++;
			}
		}
	}
	if(n==0){
		var noneDiv = document.createElement('div');
		noneDiv.className = "jump jpTitle jpEpt";
		noneDiv.innerHTML = "什么都没有了::>_<::";
		result_lists.appendChild(noneDiv);
	}
	n = 0;
	// clearInterval(timer);
	// intCircle=150;
	// timer=setInterval(frame,intCircle);
}
function wdJump(twd){// 联想记忆法，实用又高效(..•˘_˘•..)
	scrollTo(0,0);
	wd = twd;
	translation.style.display = "block";
	rexcard.style.display = "none";
	footer.style.display = 'none'
	wdName.innerHTML = wd;
	wdExplain.innerHTML = getFreqSpan(freqdic[wd]).outerHTML + dic[wd];
	if(speakFlag)
		speak();
	research();
}
function getFreqSpan(n){
	if(n == 0) n = 1;
	var freqSpan = document.createElement("span");
	freqSpan.className = "wdFreq";
	freqSpan.innerHTML = (Math.log(n)/Math.log(86015)*9).toFixed(0);
	return freqSpan;
}
function speak(){// 你想听单词，那我就■■■■■■(*•̀ㅂ•́)و
	if(window.speechSynthesis.speaking || window.speechSynthesis.pending){
		return false;
	}
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
	if(speakFlag){
		speak();
	}
}

var movedFlag = false;
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
			movedFlag = false;
		}
		else{
			movedFlag = true;
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
			// randWd();
			movedFlag = false;
		}
		else{
			movedFlag = true;
		}
	}
	return false;
}
function checkMoved(){
	if(!movedFlag){
		randWd();
	}else{
		movedFlag = false;
	}
}

speakFlag = (localStorage['speakFlag'] == 'true');
volume_on.style.display = speakFlag? 'block':'none';
volume_off.style.display= speakFlag? 'none':'block';
document.querySelector("#searchDiv > input[type=text]").focus();

// service worker
navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
	.then(function (registration) {
		console.log('Service Worker 注册成功 with scope: ', registration.scope);
	})
	.catch(function (err) {
		alert('Service Worker 注册失败: ', err);
		console.log('Service Worker registration failed: ', err);
	});

console.log("\n\n\n\n\n        萌是深藏不漏的✿◡‿◡\n\n\n\n\n\n");