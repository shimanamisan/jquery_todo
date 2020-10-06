const $ = require("jquery");
import "particles.js/particles";
const particlesJS = window.particlesJS;

particlesJS.load("particles-js", "../particles.json", function () {
  console.log("callback - particles.js config loaded");
});

$(function(){
    console.log('jQueryを読み込んでいます。。。')
})