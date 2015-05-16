/*
 * ScratchX with WebAudioAPI
 * http://scratchx.org/?url=http://geckoinc.github.io/scratchx-WebAudioAPI/AnalogSynth.js
 * Please check your Web browser Plugin for Web Audio
 * Thanks to 
 * Yokobond San (http://yokobond.github.io/scratchx-audio/)
 * Mactkg San (http://mactkg.hateblo.jp/)
 * Kawai San (https://html5experts.jp/ryoyakawai/12569/)
 */


(function(ext) {

    // ブロックは複数定義することが出来る。
    //それぞれのブロックで共有したい変数やオブジェクトをここで定義

    var audioctx;
    //SafariなどのwebKitを使うブラウザと、AudioContextを持つブラウザを判定。
    //おそらく今の状態だとIEは使えない
    //webkit使うものでもAudioContextでいけるかもしれない。
    if (typeof (webkitAudioContext) !== "undefined") {
        audioctx = new webkitAudioContext();
    }
    else if (typeof (AudioContext) !== "undefined") {
        audioctx = new AudioContext();
    }

    //audioNodeの定義、別名定義
    var vco0, vco1, lfo, vcf;
    var output = audioctx.destination;


    //音を発生するOscillatorの定義し、
    //音量調整用のGainNodeを追加
    vco0=audioctx.createOscillator();
    vco1=audioctx.createOscillator();
    gain0=audioctx.createGain();
    gain1=audioctx.createGain();
    lfo=audioctx.createOscillator();
    vcf=audioctx.createBiquadFilter();
	vcfgain=audioctx.createGain();

    //オブジェクトの初期設定
    vco0.type = 'sine';
    vco0.frequency.value = 440;
    gain0.gain.value = 0;
    vco1.type = 'sine';
    vco1.frequency.value = 220;
    gain1.gain.value = 0;
    vcfgain.gain.value = 100;

    //オブジェクトの接続
    vco0.connect(gain0);
    vco1.connect(gain1);
    gain0.connect(vcf);
    gain1.connect(vcf);
    lfo.connect(vco0.frequency);
    lfo.connect(vco1.frequency);
    lfo.connect(vcf.detune);
    vcf.connect(vcfgain);
    vcfgain.connect(output);

    //最後のoutputはaudioctx.destinationの別名、実際に音を発するために利用する部分

    //オブジェクト実行
    vco0.start(0);
    vco1.start(0);
    lfo.start(0);


    // shutdown時に呼ばれる
    ext._shutdown = function() {
		vco0.stop(0);
		vco1.stop(0);
	};

    // statusを返してやる。デバイスとつながってない時とかここで色々返せる。
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // blockが呼び出された時に呼ばれる関数を登録する。
    // 下にあるdescriptorでブロックと関数のひも付けを行っている。

    ext.obj_vol0 = function() {
       vco0.frequency.value = 0;
       vco1.frequency.value = 0;
    };
    ext.obj_defaultConnection = function() {
    	vco0.disconnect();
    	vco0.connect(gain0);
    	vco1.disconnect();
    	vco1.connect(gain1);
    	gain0.disconnect();
    	gain0.connect(vcf);
    	gain1.disconnect();
    	gain1.connect(vcf);
		lfo.disconnect()
    	lfo.connect(vco0.frequency);
    	lfo.connect(vco1.frequency);
    	lfo.connect(vcf.detune);
    	vcf.disconnect();
    	vcf.connect(vcfgain);
    	vcfgain.disconnect();
    	vcfgain.connect(output);
    };
    ext.obj_wait = function(ms) {
        console.log('Waiting for ' + ms + ' seconds');
        window.setTimeout(function() {
            callback();
        }, ms);
    };
    ext.obj_power = function(base, exponent) {
        return Math.pow(base, exponent);
    };
    ext.obj_freq = function(obj, freq) {
       eval(obj).frequency.value = freq;
    };
    ext.obj_wave = function(obj, wtype) {
       eval(obj).type = wtype;
    };
    ext.obj_gain = function(obj, gain) {
       eval(obj).gain.value = gain;
    };
    ext.obj_detune = function(obj, diffcent) {
       eval(obj).detune.value = diffcent;
    };
   ext.obj_connect = function(obj, toobj) {
       eval(obj).connect(eval(toobj));
    };
   ext.obj_connectParam = function(obj, param, toobj) {
       eval(obj).connect(eval(toobj+"."+param));
    };
   ext.obj_disconnect = function(obj) {
       eval(obj).disconnect();
    };
    // ブロックと関数のひも付け
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'All audioNodes set Volume 0', 'obj_vol0'],
            [' ', 'All audioNodes reset connection', 'obj_defaultConnection'],
            ['w', 'wait for %n ms', 'obj_wait', 100],
            ['r', '%n ^ %n','obj_power', 2, 0.5],
            [' ', '%m.audioNode set Freq %n Hz', 'obj_freq', 'vco0',440],
            [' ', '%m.waveNode set WaveType %m.waveType', 'obj_wave', 'vco0', 'sine'],
            [' ', '%m.waveNode set Detune %n cent', 'obj_detune', 'vco0', 0],
            [' ', '%m.gainNode set Volume %n', 'obj_gain', 'gain0', 30],
            [' ', '%m.audioNode connect %m.allNode', 'obj_connect', 'vco0', 'vcf'],
            [' ', '%m.audioNode connect param %m.nodeParam in %m.audioNode param ', 'obj_connectParam', 'lfo', 'detune', 'vcf'],
            [' ', '%m.audioNode disconnect', 'obj_disconnect', 'vco1']
        ],
        menus: {
            waveType: ["sine", "square", "sawtooth", "triangle"],
            allNode: ["vco0", "vco1", "gain0", "gain1", "lfo", "vcf","vcfgain", "output"],
            audioNode: ["vco0", "vco1", "gain0", "gain1", "lfo", "vcf"],
            waveNode: ["vco0", "vco1"],
            gainNode: ["gain0", "gain1", "vcfgain"],
            nodeParam: ["frequency", "detune"]
        }
    };

    // 最後にExtensionを登録する
    ScratchExtensions.register('Web Audio API 2osc Analog Synth', descriptor, ext);
})({});