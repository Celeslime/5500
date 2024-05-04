// 奇妙的事情发生了 o‿≖✧
var timer,wd="",guess="~";
var speakFlag, speakRate="1.0", speakLang="en";
var rand = document.getElementById('rand');
var inclusive_list = document.getElementById('inclusive_list');
var prefix_list = document.getElementById('prefix_list');
var suffix_list = document.getElementById('suffix_list');

// 用户0.4s内没有输入，立即搜索
var wdInput = document.getElementById('wdInput');
wdInput.addEventListener('input', function() {
    clearTimeout(timer);
	timer = setTimeout(search, 400);
});
// 回车搜索
wdInput.addEventListener('keydown', function(event) {
    if (event.key == "Enter") {
        search(0);
    }
});
function search(minLen = 1){
	wd = wdInput.value;
	if(wd.length <= minLen){
		// ≖‿≖✧
		return;
	}
	translation.style.display = 'block';
	rexcard.style.display = 'none'
	footer.style.display = 'none'
	if(dic[wd]){
		wdJump(wd);
	}
	else{
		// wdName.innerHTML=wd;
		if(wd == "正则表达式" || wd == 'rex'){
			rex();
			return;
		}
		else{
			translation.style.display = "none";
		} 
		research();
	}
}
var timer, intCircle;
function research(){
	inclusive_list.innerHTML = "";
	prefix_list.innerHTML = "";
	suffix_list.innerHTML = "";
	var n = 0;
	for(var key in dic){// 包含
		if(key.search(wd) != -1 && wd != key){
			addWdButton(key, inclusive_list);
			n++;
		}
	}
	if(wd.length >= 4 && wd[0] != "^"){// 前缀^word
		var method = function(a,b){
			return similarity((a),(b));
		}
		var simiList = simiSearch(wd, method);
		for(var i in simiList){
			key = simiList[i];
			if(i == 0){
				var beginning = '^' + key.substring(0,method(simiList[simiList.length-1],wd));
				var prefixTitleDiv = document.createElement("div");
				prefixTitleDiv.className = "jump jpTitle cardcontent";
				prefixTitleDiv.innerHTML = "Ⅱ.前缀<span>" + beginning + "</span>";
				prefix_list.appendChild(prefixTitleDiv);
				n++;
			}
			addWdButton(key, prefix_list);
			n++
		}
	}
	if(wd.length >= 4 && wd[wd.length-1]!="$"){// 后缀word$
		var method = function(a,b){
			return similarity(reverse(a),reverse(b));
		}
		var simiList = simiSearch(wd, method);
		for(var i in simiList){
			key = simiList[i];
			if(i == 0){
				var lastWd = simiList[simiList.length-1]
				var endding = '$' + reverse(key).substring(0,method(lastWd,wd));
				var suffixTiTleButton = document.createElement("div");
				suffixTiTleButton.className = "jump jpTitle cardcontent";
				suffixTiTleButton.innerHTML = "Ⅲ.后缀<span>"+reverse(endding)+"</span>";
				suffix_list.appendChild(suffixTiTleButton);
				n++;
			}
			addWdButton(key, suffix_list);
			n++
		}
	}
	if(n == 0){
		var noneDiv = document.createElement('div');
		noneDiv.className = "jump jpTitle jpEpt";
		noneDiv.innerHTML = "什么都没有了::>_<::";
		inclusive_list.appendChild(noneDiv);
	}
}
function similarity(a, b){
	var i;
	for(i = 0;i < a.length;i++){
		if(a[i] != b[i]){
			break;
		}
	}
	return i;
}
function simiSearch(wd, method = similarity){
	var matrix = [], list = [];
	for(var i = 0;i < 20;i++){// 希望没有20个字母以上的单词(。_。)
		matrix[i] = [];
	}
	for(var key in dic){
		var similarity = method(key, wd);
		if(similarity > 0 && key != wd){
			matrix[similarity].push(key);
		}
	}
	for(var i = matrix.length - 1;i >= 0;i--){
	    list = list.concat(matrix[i]);
		if(list.length + matrix[i-1].length > 10){
			break;
		}
	}
	return list;
}
function addWdButton(wd, list){
	var WdButton = document.createElement("button");
	WdButton.className = "jump";
	WdButton.title = wd;
	WdButton.type = "button";
	WdButton.onclick = function(){wdJump(this.title);}
	WdButton.innerHTML = wd + "<span class='jpExplain'>"+dic[wd]+"</span>";
	list.appendChild(WdButton);
}
function reverse(word){
	return word.split("").reverse().join("");
}
function wdJump(twd){// 联想记忆法，实用又高效(..•˘_˘•..)
	scrollTo(0,0);
	wd = twd;
	translation.style.display = "block";
	rexcard.style.display = "none";
	footer.style.display = 'none'
	wdName.innerHTML = wd;
	wdExplain.innerHTML = getFreqSpan(freqdic[wd]).outerHTML + dic[wd];
	if(speakFlag){
		speak();
	}
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
	var speaker = new SpeechSynthesisUtterance();
	speaker.text = wdName.innerHTML
	speaker.rate = speakRate;
	speaker.lang = speakLang;
	window.speechSynthesis.speak(speaker);
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
		rand.style.left = (e.touches[0].clientX - disX) / document.documentElement.clientWidth  * 100 + '%';
		rand.style.top  = (e.touches[0].clientY - disY) / document.documentElement.clientHeight * 100 + '%';
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
		rand.style.left = (e.clientX - disX) / document.documentElement.clientWidth  * 100 + '%';
		rand.style.top  = (e.clientY - disY) / document.documentElement.clientHeight * 100 + '%';
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
console.log("\n\n\n\n\n        萌是深藏不漏的✿◡‿◡\n\n\n\n\n\ntry tap 'love' at here");