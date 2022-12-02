// document.addEventListener('DOMContentLoaded', () => { ;({ , , , ,,,}.init()) })
document.addEventListener('DOMContentLoaded', () => {
    ;({
    // 各種オブジェクトパーツ（複数回使うオブジェクトを格納しておく）
    el: {
        header: document.querySelector('#header'),
        calender: document.querySelector('#calendar'),
        popUpWrapper: document.querySelector('#popup-wrapper'),
        textArea: document.querySelector("text"),
        startBtn: document.querySelector('#start'),
        stopBtn: document.querySelector('#stop'),
        Ad: document.querySelector("#advertising"),
        myMap: document.querySelector("#myMap"),
    },
    // パーツデータ
    data: {
        week: ["日", "月", "火", "水", "木", "金", "土"],
        today: new Date(),
        showDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // 今月の一日
    },

    // 初めに実行される関数
    init() {
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        // カレンダー表示
        self.showProcess(data.today, calendar);
        // 前月表示
        $("#prev").on('click', function(){
            self.prev();
        });
        // 次月表示
        $("#next").on('click', function(){
            self.next();
        });
        // 日をクリックされた時の処理
        $(".date").on('click', function(){
            self.popUp($(this).attr('data-value'));
        });
        // ×ボタンを押したら広告を消す
        $(".ad_close").on('click', function(){
            el.Ad.style.display = "none";
        });
        // 広告を５秒ごとに表示・非表示
        // window.setInterval(self.displayAd(), 2000);
        // let count = 5;
        // window.setInterval(function(){
        //     console.log(el.Ad.style.display);
            // if(el.Ad.style.display=="block"){
            //     el.Ad.style.display="none"
            //     console.log("display: block");
            // }
            // else if(el.Ad.style.display=="none"){
            //     el.Ad.style.display="block"
            //     console.log("display: none");
            // }
        // }, 2000);

    },

    // カレンダー表示
    showProcess(date) {
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        var year = date.getFullYear();
        var month = date.getMonth();
        el.header.innerHTML = year + "年 " + (month + 1) + "月";

        var calendar = self.createProcess(year, month);
        el.calender.innerHTML = calendar;
    },

    // カレンダー作成
    createProcess(year, month) {
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        // １行（１週間）を作成
        var calendar = "<table><tr class='dayOfWeek'>";
        for (var i = 0; i < data.week.length; i++) {
            calendar += "<th>" + data.week[i] + "</th>"; // 曜日ごとに列作成
        }
        calendar += "</tr>";

        var count = 0; // 日付の初期化
        var startDayOfWeek = new Date(year, month, 1).getDay(); // 曜日を0から6の整数で取得
        var endDate = new Date(year, month + 1, 0).getDate(); // 日に０を指定すると月の最終日を取得できる
        var lastMonthEndDate = new Date(year, month, 0).getDate();
        var row = Math.ceil((startDayOfWeek + endDate) / data.week.length); // 日付を７で割って切り上げることで、週数を取得

        // 1行（１週間）ずつ設定
        for (var i = 0; i < row; i++) {
            calendar += "<tr>";
            // 1列（曜日）単位で設定
            for (var j = 0; j < data.week.length; j++) {
                if (i == 0 && j < startDayOfWeek) {
                    // 1行目で1日まで先月の日付を設定
                    calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
                } else if (count >= endDate) {
                    // 最終行で最終日以降、翌月の日付を設定
                    count++;
                    calendar += "<td class='disabled'>" + (count - endDate) + "</td>";
                    // 本処理
                } else {
                    count++;
                    // 今日の場合
                    if(year == data.today.getFullYear()
                    && month == (data.today.getMonth())
                    && count == data.today.getDate()){
                        calendar += `<td id='today' class='date' data-value='${year}/${month+1}/${count}'>` + count + "</td>";
                    // その他の場合
                    } else {
                        calendar += `<td class='date' data-value='${year}/${month+1}/${count}'>` + count + "</td>";
                    }
                }
            }
            calendar += "</tr>";
        }
        return calendar;
    },

    // 前の月表示
    prev(){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        data.showDate.setMonth(data.showDate.getMonth() - 1); // showDateを先月に設定
        self.showProcess(data.showDate);
        // 日をクリックされた時の処理
        $(".date").on('click', function(){
            self.popUp($(this).attr('data-value'));
        });
        $("#close").on('click', function(){
            self.closePop();
        });
    },

    // 次の月表示
    next(){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        data.showDate.setMonth(data.showDate.getMonth() + 1); // setDateを次月に設定
        self.showProcess(data.showDate);
        // 日をクリックされた時の処理
        $(".date").on('click', function(){
            self.popUp($(this).attr('data-value'));
        });
        $("#close").on('click', function(){
            self.closePop();
        });
    },

    popUp(date){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        el.popUpWrapper.style.display = "block";
        if(localStorage.getItem(date)){
            console.log("reload");
            self.reloadMemo(date);
        }else{
            console.log("clear");
            self.clearMemo(date);
        }
        $("#start").on('click', function(){
            self.speechMemo();
        });
        $("#save").off('click'); // 複数回実行されるのを防ぐ
        $("#save").on('click', function(){
            console.log("save on click内：" + date);
            self.saveMemo(date);
        });
        $("#close").on('click', function(){
            self.closePop();
        });
    },

    closePop(){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        el.popUpWrapper.style.display = "none";
    },

    GetMap(lat, lon){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        const map = new Microsoft.Maps.Map('#myMap', {
            center: new Microsoft.Maps.Location(lat, lon), //Location center position
            mapTypeId: Microsoft.Maps.MapTypeId.load, //Type: [load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
            zoom: 18  //Zoom:1=zoomOut, 20=zoomUp[ 1~20 ]
        });

        //Get MAP Infomation
        const center = map.getCenter();
        //Create custom Pushpin
        const pin = new Microsoft.Maps.Pushpin(center, {
            color: 'red',            //Color
            draggable:true,          //MouseDraggable
            enableClickedStyle:true, //Click
            enableHoverStyle:true,   //MouseOver
            visible:true,             //show/hide
            title:"登録地",
        });

        //Add the pushpin to the map
        map.entities.push(pin);
    },

    saveMemo(date){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data

        async function myAsync(){
            const position = await new Promise((resolve, reject) => {
                const set ={
                    enableHighAccuracy: true, //より高精度な位置を求める
                    maximumAge: 20000,        //最後の現在地情報取得が20秒以内であればその情報を再利用する設定
                    timeout: 10000            //10秒以内に現在地情報を取得できなければ、処理を終了
                  };
                navigator.geolocation.getCurrentPosition(resolve, reject, set);
            });
    
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const map = new Microsoft.Maps.Map('#myMap', {
                center: new Microsoft.Maps.Location(lat, lon), //Location center position
                mapTypeId: Microsoft.Maps.MapTypeId.load, //Type: [load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
                zoom: 18  //Zoom:1=zoomOut, 20=zoomUp[ 1~20 ]
            });

            //Get MAP Infomation
            const center = map.getCenter();
            //Create custom Pushpin
            const pin = new Microsoft.Maps.Pushpin(center, {
                color: 'red',            //Color
                draggable:true,          //MouseDraggable
                enableClickedStyle:true, //Click
                enableHoverStyle:true,   //MouseOver
                visible:true,           //show/hide
                title:"登録地",
            });

            //Add the pushpin to the map
            map.entities.push(pin);

            const obj = {text: $("#text").val(), lat: lat, lon: lon};
            localStorage.setItem(date, JSON.stringify(obj));
        }
        myAsync()

    },

    reloadMemo(date){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        const value = JSON.parse(localStorage.getItem(date));
        if(value.lat){
            self.GetMap(value.lat, value.lon);
            console.log("reload");
        }else{
            el.myMap.innerHTML = "";
        }
        $(".text").val(value.text); 
    },

    clearMemo(date){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        $(".text").val("");
        el.myMap.innerHTML = "";
    },

    speechMemo(){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data

        SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
        let recognition = new SpeechRecognition();
      
        recognition.lang = 'ja-JP';
        recognition.interimResults = true;
        recognition.continuous = true;
      
        let finalTranscript = ''; // 確定した(黒の)認識結果
      
        recognition.onresult = (event) => {
          let interimTranscript = ''; // 暫定(灰色)の認識結果
          for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript = transcript;
            }
          }
        $(".text").val(finalTranscript + interimTranscript);
        }
        recognition.start();

        el.stopBtn.onclick = () => {
          recognition.stop();
        }
    },

    displayAd(){
        const self = this // この関数があるオブジェクトを指す。
        const el = self.el
        const data = self.data
        console.log("displayAd");
        if(el.Ad.style.display=="block"){
            el.Ad.style.display="none"
        }
        else if(el.Ad.style.display=="none"){
            el.Ad.style.display="block"
        }
    },
  
    }.init())
  })




