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

    //音を発生するOscillatorの定義
    var vco0, vco1, lfo, vcf;
    vco0=audioctx.createOscillator();
    vco1=audioctx.createOscillator();
    lfo=audioctx.createOscillator();
    vcf=audioctx.createBiquadFilter();
    // GainNodeを追加
    vco0gain=audioctx.createGain();
    vco1gain=audioctx.createGain();
    vco0.connect(vco0gain); // vco0の接続先を変更、固定
    vco1.connect(vco1gain); // vco1の接続先を変更、固定

    //オブジェクトの初期設定
    vco0.type = 'sine';
    vco0.frequency.value = 440;
    vco0gain.gain.value = 10;
    vco1.type = 'sine';
    vco1.frequency.value = 220;
    vco1gain.gain.value = 10;

    vco0.start(0);
    vco1.start(0);
    lfo.start(0);

    //オブジェクトの接続
    vco0gain.connect(vcf);
    vco1gain.connect(vcf);
    lfo.connect(vco0.frequency);
    lfo.connect(vco1.frequency);
    lfo.connect(vcf.detune);
    vcf.connect(audioctx.destination);

    //最後のaudioctx.destinationは、実際に音を発するために利用する部分

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

    ext.obj_freq = function(obj,freq) {
       eval(obj).frequency.value = freq;
    };
    ext.obj_wave = function(obj,wtype) {
       eval(obj).type = wtype;
    };
    ext.obj_gain = function(obj,gain) {
       eval(obj + "gain").gain.value = gain;
    };
    ext.obj_detune = function(obj,diffcent) {
       eval(obj).detune.value = diffcent;
    };

    // ブロックと関数のひも付け
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', '%m.audioNode set Freq %n Hz', 'obj_freq', 'vco0',440],
            [' ', '%m.waveNode set WaveType %m.waveType', 'obj_wave', 'vco0', 'sine'],
            [' ', '%m.waveNode set Detune %n cent', 'obj_detune', 'vco0', 0],
            [' ', '%m.waveNode set Volume %n', 'obj_gain', 'vco0', 30]
        ],
        menus: {
            waveType: ["sine", "square", "sawtooth", "triangle"],
            allNode: ["vco0", "vco1", "lfo", "vcf", "Out", "None"],
            audioNode: ["vco0", "vco1", "lfo", "vcf"],
            waveNode: ["vco0", "vco1"]
        }
    };

    // 最後にExtensionを登録する
    ScratchExtensions.register('Web Audio API 2osc Analog Synth', descriptor, ext);
})({});