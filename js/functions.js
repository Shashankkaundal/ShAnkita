
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // setup garden
	$loveHeart = $("#loveHeart");
	var offsetX = $loveHeart.width() / 2;
	var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
	gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height()
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);
	
	$("#content").css("width", $loveHeart.width() + $("#code").width());
	$("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
	$("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
	$("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
	var t = angle / Math.PI;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
	return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
	var interval = 50;
	var angle = 10;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeartPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.2;
		}
	}, interval);
}

(function($) {
    $.fn.typewriter = function() {
        this.each(function() {
            var $ele = $(this), str = $ele.html(), progress = 0;
            $ele.html('');
            
            // Array of keyboard click sounds (using free sound URLs)
            var keySounds = [
                'https://assets.mixkit.co/active_storage/sfx/279/279-preview.mp3',
                'https://assets.mixkit.co/active_storage/sfx/280/280-preview.mp3', 
                'https://assets.mixkit.co/active_storage/sfx/281/281-preview.mp3',
                'https://assets.mixkit.co/active_storage/sfx/282/282-preview.mp3'
            ];
            
            // Preload sounds
            var audioBuffers = [];
            var audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            function playRandomKeySound() {
                try {
                    // Create a simple click sound as fallback
                    var oscillator = audioContext.createOscillator();
                    var gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    // Realistic mechanical keyboard sound
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(80 + Math.random() * 60, audioContext.currentTime);
                    
                    // Very short, sharp envelope
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.03);
                    
                } catch (e) {
                    console.log('Sound error:', e);
                }
            }

            var timer = setInterval(function() {
                var current = str.substr(progress, 1);
                
                if (current == '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                    // Play sound for visible characters
                    if (current !== ' ' && current !== '>' && current !== '<' && current.trim() !== '') {
                        playRandomKeySound();
                    }
                }
                
                $ele.html(str.substring(0, progress) + (progress < str.length ? '_' : ''));
                
                if (progress >= str.length) {
                    clearInterval(timer);
                    setTimeout(function() {
                        $ele.html(str);
                    }, 500);
                }
            }, 75);
        });
        return this;
    };
})(jQuery);
function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
	$("#elapseClock").html(result);
}

function showMessages() {
	adjustWordsPosition();
	$('#messages').fadeIn(5000, function() {
		showLoveU();
	});
}

function adjustWordsPosition() {
	$('#words').css("position", "absolute");
	$('#words').css("top", $("#garden").position().top + 195);
	$('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}
// Heart animation that creates hearts at pointer locations
function initHeartTrail() {
    // Create a container for the hearts
    const heartContainer = document.createElement('div');
    heartContainer.id = 'heart-trail-container';
    heartContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(heartContainer);

    // Heart colors
    const heartColors = ['#ff3366', '#e91e63', '#ff6699', '#ff99cc', '#2e7d32', '#4caf50'];
    
    // Track mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let heartCreationEnabled = true;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (heartCreationEnabled) {
            createHeartAtPosition(mouseX, mouseY);
            
            // Throttle heart creation
            heartCreationEnabled = false;
            setTimeout(() => {
                heartCreationEnabled = true;
            }, 100); // Create hearts every 100ms
        }
    });
    
    // Also create hearts on touch devices
    document.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        
        if (heartCreationEnabled) {
            createHeartAtPosition(mouseX, mouseY);
            
            // Throttle heart creation
            heartCreationEnabled = false;
            setTimeout(() => {
                heartCreationEnabled = true;
            }, 150);
        }
    });
    
    function createHeartAtPosition(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: ${Math.random() * 20 + 15}px;
            color: ${heartColors[Math.floor(Math.random() * heartColors.length)]};
            pointer-events: none;
            user-select: none;
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
            transition: all 0.8s ease-out;
            z-index: 9999;
        `;
        
        heartContainer.appendChild(heart);
        
        // Trigger animation
        requestAnimationFrame(() => {
            heart.style.transform = `translate(-50%, -50%) scale(1) translateY(-${Math.random() * 50 + 30}px)`;
            heart.style.opacity = '0.8';
        });
        
        // Remove heart after animation
        setTimeout(() => {
            heart.style.opacity = '0';
            heart.style.transform = `translate(-50%, -50%) scale(0.5) translateY(-${Math.random() * 100 + 50}px)`;
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 800);
        }, 1000);
    }
    
    // Alternative: Create hearts on click/tap
    document.addEventListener('click', function(e) {
        createHeartBurst(e.clientX, e.clientY);
    });
    
    document.addEventListener('touchend', function(e) {
        const touch = e.changedTouches[0];
        createHeartBurst(touch.clientX, touch.clientY);
    });
    
    function createHeartBurst(x, y) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createHeartAtPosition(
                    x + (Math.random() - 0.5) * 50,
                    y + (Math.random() - 0.5) * 50
                );
            }, i * 50);
        }
    }
    
    console.log('Heart trail animation initialized!');
}

// Enhanced version with floating hearts
function initFloatingHearts() {
    const heartContainer = document.getElementById('heart-trail-container') || document.body;
    
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        const size = Math.random() * 25 + 15;
        const startX = Math.random() * window.innerWidth;
        
        heart.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${window.innerHeight + 50}px;
            font-size: ${size}px;
            color: ${['#ff3366', '#e91e63', '#ff6699'][Math.floor(Math.random() * 3)]};
            pointer-events: none;
            user-select: none;
            opacity: ${Math.random() * 0.6 + 0.2};
            z-index: 9998;
            transform: scale(0);
            transition: transform 0.3s ease-out;
        `;
        
        heartContainer.appendChild(heart);
        
        // Animate in
        setTimeout(() => {
            heart.style.transform = 'scale(1)';
        }, 10);
        
        // Floating animation
        const duration = Math.random() * 10000 + 8000;
        const endX = startX + (Math.random() - 0.5) * 200;
        
        const animation = heart.animate([
            { 
                transform: `translate(0, 0) scale(1)`,
                opacity: heart.style.opacity
            },
            { 
                transform: `translate(${endX - startX}px, -${window.innerHeight + 100}px) scale(0.5)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
        
        animation.onfinish = () => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        };
    }
    
    // Create floating hearts periodically
    setInterval(createFloatingHeart, 2000);
    
    // Create initial floating hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingHeart, i * 500);
    }
}

// Initialize both effects
function initAllHeartAnimations() {
    initHeartTrail();
    initFloatingHearts();
}

// Export functions for use in HTML
window.HeartAnimations = {
    initHeartTrail,
    initFloatingHearts,
    initAllHeartAnimations
};
