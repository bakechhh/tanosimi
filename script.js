document.addEventListener('DOMContentLoaded', function() {
    // 初期化関数
    function init() {
        initCountdown();
        initAttractions();
        initMemories();
        initSurprises();
        initQuotes();
        createFireworks();
    }

    // カウントダウン関数
    function initCountdown() {
        const savedDate = localStorage.getItem('tripDate');
        const dateInput = document.getElementById('trip-date');
        
        if (savedDate) {
            dateInput.value = savedDate;
            updateCountdown();
        }
        
        document.getElementById('save-date').addEventListener('click', function() {
            const tripDate = dateInput.value;
            if (tripDate) {
                localStorage.setItem('tripDate', tripDate);
                updateCountdown();
                
                // 日付が保存されたときにアニメーションを追加
                document.getElementById('countdown').classList.add('date-saved');
                setTimeout(() => {
                    document.getElementById('countdown').classList.remove('date-saved');
                }, 1000);
            }
        });
        
        // 1秒ごとにカウントダウンを更新
        setInterval(updateCountdown, 1000);
    }
    
    function updateCountdown() {
        const tripDate = localStorage.getItem('tripDate');
        
        if (!tripDate) {
            return;
        }
        
        const currentDate = new Date();
        const targetDate = new Date(tripDate);
        
        // 差分を計算（ミリ秒）
        const difference = targetDate - currentDate;
        
        // もし旅行日が過ぎていたら
        if (difference < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        // 日、時間、分、秒に変換
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // 表示を更新
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // アトラクション管理機能
    function initAttractions() {
        // ローカルストレージからアトラクションリストを取得
        let attractions = JSON.parse(localStorage.getItem('attractions')) || [];
        
        // アトラクションリストを表示
        renderAttractions();
        
        // アトラクション追加ボタンのイベントリスナー
        document.getElementById('add-attraction-btn').addEventListener('click', function() {
            const newAttractionInput = document.getElementById('new-attraction');
            const attractionName = newAttractionInput.value.trim();
            
            if (attractionName) {
                attractions.push({
                    name: attractionName,
                    completed: false
                });
                
                // ローカルストレージを更新
                localStorage.setItem('attractions', JSON.stringify(attractions));
                
                // 入力フィールドをクリア
                newAttractionInput.value = '';
                
                // リストを再描画
                renderAttractions();
            }
        });
        
        // Enter キーでも追加できるようにする
        document.getElementById('new-attraction').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('add-attraction-btn').click();
            }
        });
        
        function renderAttractions() {
            const attractionsList = document.getElementById('attractions-list');
            attractionsList.innerHTML = '';
            
            attractions = JSON.parse(localStorage.getItem('attractions')) || [];
            
            attractions.forEach((attraction, index) => {
                const li = document.createElement('li');
                
                // チェックボックス作成
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = attraction.completed;
                checkbox.addEventListener('change', function() {
                    attractions[index].completed = checkbox.checked;
                    localStorage.setItem('attractions', JSON.stringify(attractions));
                    renderAttractions();
                });
                
                // テキスト作成
                const span = document.createElement('span');
                span.textContent = attraction.name;
                if (attraction.completed) {
                    span.classList.add('completed');
                }
                
                // 削除ボタン作成
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '削除';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.addEventListener('click', function() {
                    attractions.splice(index, 1);
                    localStorage.setItem('attractions', JSON.stringify(attractions));
                    renderAttractions();
                });
                
                // 要素を追加
                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                attractionsList.appendChild(li);
            });
        }
    }

    // 思い出の写真機能
    function initMemories() {
        // ローカルストレージから思い出の写真を取得
        let memories = JSON.parse(localStorage.getItem('memories')) || [];
        
        // 思い出を表示
        renderMemories();
        
        // アップロードボタンのイベントリスナー
        document.getElementById('upload-memory').addEventListener('click', function() {
            const fileInput = document.getElementById('memory-file');
            const file = fileInput.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const imageData = e.target.result;
                    
                    memories.push({
                        id: Date.now(),
                        image: imageData
                    });
                    
                    // ローカルストレージを更新（画像が多い場合は容量の制限に注意）
                    localStorage.setItem('memories', JSON.stringify(memories));
                    
                    // ファイル入力をリセット
                    fileInput.value = '';
                    
                    // メモリーを再描画
                    renderMemories();
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        function renderMemories() {
            const memoriesContainer = document.getElementById('memories-container');
            memoriesContainer.innerHTML = '';
            
            memories = JSON.parse(localStorage.getItem('memories')) || [];
            
            memories.forEach((memory, index) => {
                const memoryItem = document.createElement('div');
                memoryItem.classList.add('memory-item');
                
                // 画像要素
                const img = document.createElement('img');
                img.src = memory.image;
                img.alt = 'ディズニーの思い出';
                
                // 削除ボタン
                const deleteBtn = document.createElement('div');
                deleteBtn.classList.add('delete-memory');
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.addEventListener('click', function() {
                    memories.splice(index, 1);
                    localStorage.setItem('memories', JSON.stringify(memories));
                    renderMemories();
                });
                
                memoryItem.appendChild(img);
                memoryItem.appendChild(deleteBtn);
                memoriesContainer.appendChild(memoryItem);
            });
        }
    }

    // サプライズメッセージ機能
    function initSurprises() {
        // ローカルストレージからサプライズメッセージを取得
        let surprises = JSON.parse(localStorage.getItem('surprises')) || [];
        
        // サプライズメッセージを表示
        renderSurprises();
        
        // 保存ボタンのイベントリスナー
        document.getElementById('save-surprise').addEventListener('click', function() {
            const surpriseInput = document.getElementById('surprise-message');
            const message = surpriseInput.value.trim();
            
            if (message) {
                surprises.push({
                    id: Date.now(),
                    message: message
                });
                
                // ローカルストレージを更新
                localStorage.setItem('surprises', JSON.stringify(surprises));
                
                // 入力フィールドをクリア
                surpriseInput.value = '';
                
                // サプライズを再描画
                renderSurprises();
            }
        });
        
        // ランダムサプライズ表示ボタンのイベントリスナー
        document.getElementById('show-random-surprise').addEventListener('click', function() {
            surprises = JSON.parse(localStorage.getItem('surprises')) || [];
            
            if (surprises.length > 0) {
                const randomIndex = Math.floor(Math.random() * surprises.length);
                const randomSurprise = surprises[randomIndex];
                
                alert(`💖 サプライズメッセージ 💖\n\n${randomSurprise.message}`);
            } else {
                alert('サプライズメッセージがまだ保存されていません！');
            }
        });
        
        function renderSurprises() {
            const surprisesContainer = document.getElementById('saved-surprises');
            surprisesContainer.innerHTML = '';
            
            surprises = JSON.parse(localStorage.getItem('surprises')) || [];
            
            surprises.forEach((surprise, index) => {
                const surpriseCard = document.createElement('div');
                surpriseCard.classList.add('surprise-card');
                
                // メッセージテキスト
                const messageText = document.createElement('p');
                messageText.textContent = surprise.message;
                
                // 削除ボタン
                const deleteBtn = document.createElement('span');
                deleteBtn.classList.add('delete-surprise');
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.addEventListener('click', function() {
                    surprises.splice(index, 1);
                    localStorage.setItem('surprises', JSON.stringify(surprises));
                    renderSurprises();
                });
                
                surpriseCard.appendChild(messageText);
                surpriseCard.appendChild(deleteBtn);
                surprisesContainer.appendChild(surpriseCard);
            });
        }
    }

    // ディズニーの名言機能
    function initQuotes() {
        const quotes = [
            "夢を信じて、それを追いかければ、夢は必ず叶うでしょう",
            "どんなに不可能だと思えることでも、いつも不可能と思わないことです",
            "心の中の想像力を生かせば、どこへでも行けるよ",
            "忘れないで。あなたがどこから来たかを。そうすれば、どこへだって行けるわ",
            "あなたにできないことなんてない、あなたが思い込んでいるだけよ",
            "今日をすばらしい1日にしようと決めるのは、あなた次第です",
            "笑顔は万国共通の言葉です",
            "不思議の国への扉はいつも開いています",
            "明日は今日よりもっと輝いているよ",
            "小さな魔法が日常にあふれている",
            "あきらめなければ、必ず夢は叶う"
        ];
        
        // 初期表示
        document.getElementById('quote').textContent = quotes[0];
        
        // 新しい名言ボタンのイベントリスナー
        document.getElementById('new-quote').addEventListener('click', function() {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            document.getElementById('quote').textContent = quotes[randomIndex];
        });
    }
    
    // 花火アニメーション作成
    function createFireworks() {
        const fireworks = document.querySelector('.fireworks');
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // ランダムな色
            const colors = ['#e91e63', '#3f51b5', '#ffeb3b', '#4caf50', '#ff5722'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // ランダムな位置
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // スタイル設定
            particle.style.backgroundColor = randomColor;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            particle.style.position = 'absolute';
            particle.style.width = '5px';
            particle.style.height = '5px';
            particle.style.borderRadius = '50%';
            particle.style.animation = `particle-animation ${Math.random() * 2 + 1}s ease-out`;
            particle.style.opacity = '0';
            
            fireworks.appendChild(particle);
            
            // アニメーション終了後に要素を削除
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }
        
        // 定期的に花火パーティクルを作成
        setInterval(() => {
            for (let i = 0; i < 5; i++) {
                createParticle();
            }
        }, 2000);
    }
    
    // CSSアニメーションのためのスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-animation {
            0% {
                transform: scale(0) translateY(0);
                opacity: 1;
            }
            100% {
                transform: scale(1) translateY(-100px);
                opacity: 0;
            }
        }
        
        @keyframes date-saved {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .date-saved {
            animation: date-saved 1s ease;
        }
    `;
    document.head.appendChild(style);
    
    // 初期化
    init();
});
