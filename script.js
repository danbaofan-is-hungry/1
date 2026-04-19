// 全局变量
let collections = [];
let currentPage = 'collection';

// 初始化应用
function initApp() {
    // 从localStorage加载数据
    loadCollections();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 渲染收藏列表
    renderCollectionList();
    
    // 初始化转一转页面
    initSpinWheel();
}

// 从localStorage加载数据
function loadCollections() {
    const savedCollections = localStorage.getItem('luoluo-collections');
    if (savedCollections) {
        collections = JSON.parse(savedCollections);
    } else {
        // 默认数据
        collections = [
            {
                id: 1,
                name: '东京迪士尼玩偶',
                date: '2024-03-15',
                location: '日本东京',
                description: '在东京迪士尼乐园购买的可爱米奇玩偶，非常柔软舒适。',
                images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20Mickey%20Mouse%20plush%20toy%20from%20Tokyo%20Disneyland&image_size=square'],
                likes: 0
            },
            {
                id: 2,
                name: '巴黎埃菲尔铁塔模型',
                date: '2024-02-20',
                location: '法国巴黎',
                description: '在埃菲尔铁塔附近的纪念品商店购买的精致模型，做工非常精细。',
                images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=miniature%20Eiffel%20Tower%20model%20souvenir&image_size=square'],
                likes: 0
            },
            {
                id: 3,
                name: '夏威夷贝壳项链',
                date: '2024-01-10',
                location: '美国夏威夷',
                description: '在夏威夷海滩上捡的贝壳制作的项链，充满了热带风情。',
                images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shell%20necklace%20from%20Hawaii%20beach&image_size=square'],
                likes: 0
            }
        ];
        saveCollections();
    }
}

// 保存数据到localStorage
function saveCollections() {
    localStorage.setItem('luoluo-collections', JSON.stringify(collections));
}

// 绑定事件监听器
function bindEventListeners() {
    // 导航切换
    document.querySelectorAll('.nav-link, .nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('href').substring(1);
            switchPage(targetPage);
        });
    });

    // 添加收藏按钮
    document.getElementById('add-collection').addEventListener('click', function() {
        document.getElementById('add-modal').classList.add('active');
    });

    // 关闭模态框
    document.getElementById('close-modal').addEventListener('click', closeAddModal);
    document.getElementById('cancel-add').addEventListener('click', closeAddModal);
    document.getElementById('close-detail').addEventListener('click', closeDetailModal);

    // 点击模态框外部关闭
    document.getElementById('add-modal').addEventListener('click', function(e) {
        if (e.target === this) closeAddModal();
    });
    document.getElementById('detail-modal').addEventListener('click', function(e) {
        if (e.target === this) closeDetailModal();
    });

    // 收藏表单提交
    document.getElementById('collection-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addCollection();
    });

    // 转动按钮
    document.getElementById('spin-btn').addEventListener('click', spinWheel);

    // 点赞按钮
    document.getElementById('like-btn').addEventListener('click', function() {
        const collectionId = parseInt(this.dataset.id);
        toggleLike(collectionId);
    });
}

// 切换页面
function switchPage(page) {
    // 更新当前页面
    currentPage = page;
    
    // 更新导航状态
    document.querySelectorAll('.nav-link, .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll(`[href="#${page}"]`).forEach(item => {
        item.classList.add('active');
    });
    
    // 更新页面显示
    document.querySelectorAll('.page').forEach(pageEl => {
        pageEl.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');
    
    // 如果切换到转一转页面，重新初始化转盘
    if (page === 'spin') {
        initSpinWheel();
    }
}

// 关闭添加模态框
function closeAddModal() {
    document.getElementById('add-modal').classList.remove('active');
    document.getElementById('collection-form').reset();
}

// 关闭详情模态框
function closeDetailModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

// 添加收藏
function addCollection() {
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const photos = document.getElementById('photos').files;
    
    // 处理图片（这里使用模拟图片，实际项目中需要上传）
    const images = [];
    for (let i = 0; i < photos.length; i++) {
        // 实际项目中这里应该上传图片并获取URL
        // 这里使用模拟图片
        images.push(`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(name)}&image_size=square`);
    }
    
    // 创建新收藏
    const newCollection = {
        id: Date.now(),
        name,
        date,
        location,
        description,
        images,
        likes: 0
    };
    
    // 添加到收藏列表
    collections.push(newCollection);
    saveCollections();
    
    // 重新渲染列表
    renderCollectionList();
    
    // 关闭模态框
    closeAddModal();
}

// 渲染收藏列表
function renderCollectionList() {
    const collectionList = document.getElementById('collection-list');
    collectionList.innerHTML = '';
    
    if (collections.length === 0) {
        collectionList.innerHTML = '<p class="empty-message">还没有收藏，点击"添加收藏"按钮开始收藏吧！</p>';
        return;
    }
    
    collections.forEach(collection => {
        const collectionItem = document.createElement('div');
        collectionItem.className = 'collection-item';
        collectionItem.innerHTML = `
            <img src="${collection.images[0]}" alt="${collection.name}" class="collection-image">
            <div class="collection-info">
                <h3>${collection.name}</h3>
                <p>${collection.description.substring(0, 50)}...</p>
                <div class="collection-meta">
                    <span>${collection.date}</span>
                    <span>${collection.location}</span>
                </div>
            </div>
        `;
        
        // 点击查看详情
        collectionItem.addEventListener('click', function() {
            showCollectionDetail(collection.id);
        });
        
        collectionList.appendChild(collectionItem);
    });
}

// 显示收藏详情
function showCollectionDetail(id) {
    const collection = collections.find(c => c.id === id);
    if (!collection) return;
    
    // 填充详情数据
    document.getElementById('detail-name').textContent = collection.name;
    document.getElementById('detail-date').textContent = collection.date;
    document.getElementById('detail-location').textContent = collection.location;
    document.getElementById('detail-description').textContent = collection.description;
    document.getElementById('like-count').textContent = collection.likes;
    
    // 填充图片
    const detailImages = document.getElementById('detail-images');
    detailImages.innerHTML = '';
    collection.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = collection.name;
        detailImages.appendChild(img);
    });
    
    // 设置点赞按钮数据
    const likeBtn = document.getElementById('like-btn');
    likeBtn.dataset.id = id;
    
    // 显示模态框
    document.getElementById('detail-modal').classList.add('active');
}

// 切换点赞状态
function toggleLike(id) {
    const collection = collections.find(c => c.id === id);
    if (!collection) return;
    
    collection.likes++;
    saveCollections();
    
    // 更新UI
    document.getElementById('like-count').textContent = collection.likes;
    
    // 点赞动画
    const likeBtn = document.getElementById('like-btn');
    likeBtn.classList.add('liked');
    setTimeout(() => {
        likeBtn.classList.remove('liked');
    }, 300);
}

// 初始化转一转转盘
function initSpinWheel() {
    const wheel = document.getElementById('wheel');
    wheel.innerHTML = '';
    
    if (collections.length === 0) {
        wheel.innerHTML = '<p class="empty-message">还没有收藏，无法转动转盘！</p>';
        return;
    }
    
    const sectorCount = collections.length;
    const anglePerSector = 360 / sectorCount;
    
    collections.forEach((collection, index) => {
        const sector = document.createElement('div');
        sector.className = 'wheel-sector';
        sector.style.transform = `rotate(${index * anglePerSector}deg)`;
        sector.style.backgroundColor = getRandomColor();
        sector.textContent = collection.name.substring(0, 6);
        
        // 点击扇区查看详情
        sector.addEventListener('click', function() {
            showCollectionDetail(collection.id);
        });
        
        wheel.appendChild(sector);
    });
}

// 转动转盘
function spinWheel() {
    if (collections.length === 0) return;
    
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    
    // 禁用按钮
    spinBtn.disabled = true;
    spinBtn.textContent = '转动中...';
    
    // 随机转动角度
    const randomAngle = 3600 + Math.random() * 360;
    wheel.style.transform = `rotate(${randomAngle}deg)`;
    
    // 计算最终指向的扇区
    setTimeout(() => {
        const finalAngle = randomAngle % 360;
        const sectorCount = collections.length;
        const anglePerSector = 360 / sectorCount;
        const selectedIndex = Math.floor(finalAngle / anglePerSector);
        const selectedCollection = collections[selectedIndex];
        
        // 显示结果
        showSpinResult(selectedCollection);
        
        // 启用按钮
        spinBtn.disabled = false;
        spinBtn.textContent = '转动';
    }, 5000);
}

// 显示转动结果
function showSpinResult(collection) {
    const spinResult = document.getElementById('spin-result');
    spinResult.innerHTML = `
        <h3>🎉 恭喜你！</h3>
        <p>你转到了：</p>
        <div class="result-collection">
            <img src="${collection.images[0]}" alt="${collection.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px; margin-bottom: 15px;">
            <h4>${collection.name}</h4>
            <p>${collection.description.substring(0, 100)}...</p>
        </div>
        <button onclick="showCollectionDetail(${collection.id})" class="btn btn-primary" style="margin-top: 20px;">查看详情</button>
    `;
}

// 获取随机颜色
function getRandomColor() {
    const colors = [
        '#ff9a9e', '#fad0c4', '#fad0c4', '#a8edea', '#fed6e3',
        '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea', '#ffc6ff'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initApp);

// 添加空消息样式
const style = document.createElement('style');
style.textContent = `
    .empty-message {
        text-align: center;
        color: #999;
        padding: 40px;
        font-size: 16px;
    }
    
    .result-collection {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: center;
    }
    
    .result-collection h4 {
        margin: 10px 0;
        color: #333;
    }
`;
document.head.appendChild(style);