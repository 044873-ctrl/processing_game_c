const TILE = 40;
const GRAVITY = 0.8;
const MOVE_SPEED = 4.0;
const JUMP_SPEED = -13.0;
const MAX_FALL_SPEED = 20.0;
const CANVAS_W = 800;
const CANVAS_H = 480;
let levelRows = [];
let tiles = [];
let coins = [];
let enemies = [];
let goal = null;
let player = null;
let offsetX = 0;
let keys = {left:false,right:false,jump:false};
function clamp(val,min,max){if(val<min){return min;} if(val>max){return max;} return val;}
function rectOverlap(ax,ay,aw,ah,bx,by,bw,bh){return ax<bx+bw && ax+aw>bx && ay<by+bh && ay+ah>by;}
function createLevel(){levelRows = [
