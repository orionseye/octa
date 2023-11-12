document.addEventListener("DOMContentLoaded", function() {
  var lazyloadImages;    

  if ("IntersectionObserver" in window) {
    lazyloadImages = document.querySelectorAll(".lazy");
    var imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove("lazy");
          imageObserver.unobserve(image);
        }
      });
    });

    lazyloadImages.forEach(function(image) {
      imageObserver.observe(image);
    });
  } else {  
    var lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll(".lazy");
    
    function lazyload () {
      if(lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }    

      lazyloadThrottleTimeout = setTimeout(function() {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function(img) {
            if(img.offsetTop < (window.innerHeight + scrollTop)) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
            }
        });
        if(lazyloadImages.length == 0) { 
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }
  
});


/* 
--------------------------------------------------
Lazy load Video combined with isInViewport
--------------------------------------------------
Background:
For videos where playback is initiated by the user (that is, videos that don't autoplay), specifying  preload="none" will not preload it until 'play' is triggered manually

Problem:
We need the video to autoplay (e.g. autoplay loop muted) .. so  preload="none" is useless and will be ignored


Solution:
We use isInViewport.js to trigger .play once the video is in viewport
That way, we trick the browser by using  preload="none" and the video gets played once in viewport. 
Actually '.play' is now a replacement of 'autoplay'


I got the idea here:
https://walterebert.com/playground/video/autoplay-js-preload-none/

His initial code example:
<video id="autoplay" preload="none" muted playsinline controls>
   <source src="video.mp4" type="video/mp4">
   <source src="video.webm" type="video/webm">
</video>

<script>
document.getElementById('autoplay').play();
</script>
*/