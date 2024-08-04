AOS.init({
    // offset: 90,
    disable: 'mobile',
    duration: 500,
  });

$(window).scroll(function () {
  var sticky = $('header'),
      scroll = $(window).scrollTop();
  if (scroll >= 50) sticky.addClass('stickyHeader');
  else sticky.removeClass('stickyHeader');
});

$(document).ready(function () {
            $('#sidebarCollapse').on('click', function () {
                $('#sidebar').toggleClass('active');
            });
        });

let min = 10;
let max = 100;

const calcLeftPosition = value => 100 / (100 - 10) *  (value - 10);

$('#rangeMin').on('input', function(e) {
  const newValue = parseInt(e.target.value);
  if (newValue > max) return;
  min = newValue;
  $('#thumbMin').css('left', calcLeftPosition(newValue) + '%');
  $('#min').html(newValue);
  $('#line').css({
    'left': calcLeftPosition(newValue) + '%',
    'right': (100 - calcLeftPosition(max)) + '%'
  });
});

$('#rangeMax').on('input', function(e) {
  const newValue = parseInt(e.target.value);
  if (newValue < min) return;
  max = newValue;
  $('#thumbMax').css('left', calcLeftPosition(newValue) + '%');
  $('#max').html(newValue);
  $('#line').css({
    'left': calcLeftPosition(min) + '%',
    'right': (100 - calcLeftPosition(newValue)) + '%'
  });
});

var swiper = new Swiper(".mySwiper1", {
  slidesPerView: 4,
  spaceBetween: 20,
  // effect: "fade",
  loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
   breakpoints: {
        // when window width is <= 499px
        320: {
            slidesPerView: 1,
            spaceBetweenSlides: 10
        },
        // when window width is <= 999px
        768: {
            slidesPerView: 2,
            spaceBetweenSlides: 10
        },
        1201: {
            slidesPerView: 4,
            spaceBetweenSlides: 15
        },
    },
});
var swiper = new Swiper(".mySwiper2", {
  slidesPerView: 4,
  spaceBetween: 20,
  // effect: "fade",
  loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
   breakpoints: {
        // when window width is <= 499px
        320: {
            slidesPerView: 1,
            spaceBetweenSlides: 10
        },
        // when window width is <= 999px
        768: {
            slidesPerView: 2,
            spaceBetweenSlides: 10
        },
        1201: {
            slidesPerView: 4,
            spaceBetweenSlides: 15
        },
    },
});
var swiper = new Swiper(".mySwiper3", {
  slidesPerView: 4,
  spaceBetween: 20,
  // effect: "fade",
  loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
   breakpoints: {
        // when window width is <= 499px
        320: {
            slidesPerView: 1,
            spaceBetweenSlides: 10
        },
        // when window width is <= 999px
        768: {
            slidesPerView: 2,
            spaceBetweenSlides: 10
        },
        1201: {
            slidesPerView: 4,
            spaceBetweenSlides: 15
        },
    },
});
var swiper = new Swiper(".mySwiper4", {
  slidesPerView: 4,
  spaceBetween: 20,
  // effect: "fade",
  loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
   breakpoints: {
        // when window width is <= 499px
        320: {
            slidesPerView: 1,
            spaceBetweenSlides: 10
        },
        // when window width is <= 999px
        768: {
            slidesPerView: 2,
            spaceBetweenSlides: 10
        },
        1201: {
            slidesPerView: 4,
            spaceBetweenSlides: 15
        },
    },
});
var swiper = new Swiper(".mySwiper5", {
  slidesPerView: 4,
  spaceBetween: 20,
  // effect: "fade",
  loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
   breakpoints: {
        // when window width is <= 499px
        320: {
            slidesPerView: 1,
            spaceBetweenSlides: 10
        },
        // when window width is <= 999px
        768: {
            slidesPerView: 2,
            spaceBetweenSlides: 10
        },
        1201: {
            slidesPerView: 4,
            spaceBetweenSlides: 15
        },
    },
});
var swiper = new Swiper(".mySwiper6", {
  slidesPerView: 4,
  spaceBetween: 20,
  // effect: "fade",
  loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
   breakpoints: {
        // when window width is <= 499px
        320: {
            slidesPerView: 1,
            spaceBetweenSlides: 10
        },
        // when window width is <= 999px
        768: {
            slidesPerView: 2,
            spaceBetweenSlides: 10
        },
        1201: {
            slidesPerView: 4,
            spaceBetweenSlides: 15
        },
    },
});
var swiper = new Swiper(".mySwiper7", {
  slidesPerView: 3,
  spaceBetween: 20,
  // effect: "fade",
  loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
   breakpoints: {
        // when window width is <= 499px
        320: {
            slidesPerView: 1,
            spaceBetweenSlides: 10
        },
        // when window width is <= 999px
        768: {
            slidesPerView: 2,
            spaceBetweenSlides: 10
        },
        1201: {
            slidesPerView: 3,
            spaceBetweenSlides: 15
        },
    },
});


