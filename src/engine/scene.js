game.module(
    'engine.scene',
    '1.0.0'
)
.body(function(){ 'use strict';

/**
    @class Scene
**/
game.Scene = game.Class.extend({
    /**
        Background color of scene.
        @property {Number} clearColor
    **/
    clearColor: 0x000000,
    /**
        @property {Array} sprites
    **/
    sprites: [],
    /**
        @property {Array} timers
    **/
    timers: [],
    /**
        @property {Array} tweens
    **/
    tweens: [],
    interactive: true,
    
    staticInit: function() {
        for (var i = game.system.stage.children.length - 1; i >= 0; i--) {
            game.system.stage.removeChild(game.system.stage.children[i]);
        }

        game.system.stage.setBackgroundColor(this.clearColor);
        game.system.stage.setInteractive(!!this.interactive);

        if(this.interactive) {
            game.system.stage.mousemove = game.system.stage.touchmove = this.mousemove.bind(this);
            game.system.stage.click = game.system.stage.tap = this.click.bind(this);
            game.system.stage.mousedown = game.system.stage.touchstart = this.mousedown.bind(this);
            game.system.stage.mouseup = game.system.stage.mouseupoutside = game.system.stage.touchend = game.system.stage.touchendoutside = this.mouseup.bind(this);
            game.system.stage.mouseout = this.mouseout.bind(this);
        }
    },
    
    /**
        This is called every frame.
        @method update
    **/
    update: function(){
        var i;
        if(this.world) this.world.update();
        for (i = this.timers.length - 1; i >= 0; i--) {
            if(this.timers[i].delta() >= 0) {
                if(typeof(this.timers[i].callback) === 'function') this.timers[i].callback();
                this.timers.erase(this.timers[i]);
            }
        }
        for (i = this.sprites.length - 1; i >= 0; i--) {
            this.sprites[i].update();
        }
    },

    /**
        @method addTween
        @param {Object} obj
        @param {Object} props
        @param {Number} duration
        @param {Object} [settings]
    **/
    addTween: function(obj, props, duration, settings) {
        var tween = new game.Tween(obj, props, duration, settings);
        this.tweens.push(tween);
        return tween;
    },

    /**
        @method getTween
        @param {Object} obj
    **/
    getTween: function(obj) {
        for (var i = 0; i < this.tweens.length; i++) {
            if(this.tweens[i]._object === obj) return this.tweens[i];
        }
        return false;
    },

    /**
        @method stopTweens
        @param {Object} [obj]
        @param {Boolean} [doComplete]
    **/
    stopTweens: function(obj, doComplete) {
        for (var i = 0; i < this.tweens.length; i++) {
            if(obj && this.tweens[i]._object === obj || !obj) this.tweens[i].stop(doComplete);
        }
    },

    /**
        @method pauseTweens
        @param {Object} [obj]
    **/
    pauseTweens: function(obj) {
        for ( var i = 0; i < this.tweens.length; i++ ) {
            if(obj && this.tweens[i]._object === obj || !obj) this.tweens[i].pause();
        }
    },

    /**
        @method resumeTweens
        @param {Object} [obj]
    **/
    resumeTweens: function (obj) {
        for ( var i = 0; i < this.tweens.length; i++ ) {
            if(obj && this.tweens[i]._object === obj || !obj) this.tweens[i].resume();
        }
    },

    /**
        Add timer to game scene.
        @method addTimer
        @param {Number} time Time in seconds
        @param {Function} callback Callback function to run, when timer ends.
    **/
    addTimer: function(time, callback) {
        var timer = new game.Timer(time);
        timer.callback = callback;
        this.timers.push(timer);
    },
    
    /**
        Callback for mouse click and touch tap on the scene stage.
        @method click
        @param {InteractionData} InteractionData
    **/
    click: function() {},

    /**
        Callback for mousedown and touchstart on the scene stage.
        @method mousedown
        @param {InteractionData} InteractionData
    **/
    mousedown: function() {},

    /**
        Callback for mouseup and touchend on the scene stage.
        @method mouseup
        @param {InteractionData} InteractionData
    **/
    mouseup: function() {},

    /**
        Callback for mousemove and touchmove on the scene stage.
        @method mousemove
        @param {InteractionData} InteractionData
    **/
    mousemove: function() {},

    /**
        Callback for mouseout on the scene stage.
        @method mouseout
        @param {InteractionData} InteractionData
    **/
    mouseout: function() {},

    run: function() {
        this.updateTweens();
        this.update();
        this.render();
    },

    render: function(){
        game.renderer.render(game.system.stage);
    },

    pause: function() {
        game.sound.muteAll();
    },

    unpause: function() {
        game.sound.unmuteAll();
    },

    updateTweens: function() {
        for (var i = this.tweens.length - 1; i >= 0; i--) {
            this.tweens[i].update();
            if(this.tweens[i].complete) this.tweens.erase(this.tweens[i]);
        }
    }
});

/**
    Main stage for scene.
    http://www.goodboydigital.com/pixijs/docs/classes/Stage.html
    @property {Class} stage
**/
Object.defineProperty(game.Scene.prototype, 'stage', {
    get: function() {
        if(!this._stage) {
            this._stage = new PIXI.DisplayObjectContainer();
            game.system.stage.addChild(this._stage);
        }
        return this._stage;
    }
});

});