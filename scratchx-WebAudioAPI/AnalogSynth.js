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


    //PitchShift（ピッチシフト）オブジェクト

//    var psin=audioctx.createGain();
//  var psout=audioctx.createGain();
//    var pshift=new pitchShift(audioctx);
//    psin.connect(pshift.getSrc());
//    pshift.connect(psout);

    //Delay（残響）オブジェクト

//    var delayin=audioctx.createGain();
//    var delayout=audioctx.createGain();
//    var delay=new delayProcess(audioctx);
//    delayin.connect(delay.getSrc());
//    delay.connect(delayout);

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
    vco0.oscillator.type = 'sine';
    vco0.oscillator.frequency.value = 440;
    vco0.gain.value = 50;
    vco1.oscillator.type = 'sine';
    vco1.oscillator.frequency.value = 1320;
    vco1.gain.value = 30;

    vco0.start(0);
    vco1.start(0);
    lfo.start(0);

    //オブジェクトの接続
    lfo.connect(vco0.frequency);
    lfo.connect(vco1.frequency);
    lfo.connect(vcf.detune);
    vcf.connect(audioctx.destination);

//   vcf.connect(psin);
//    psout.connect(delayin);
//    delayout.connect(audioctx.destination);
    //最後のaudioctx.destinationは、実際に音を発するために利用する部分

    // shutdown時に呼ばれる
    ext._shutdown = function() {};

    // statusを返してやる。デバイスとつながってない時とかここで色々返せる。
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // blockが呼び出された時に呼ばれる関数を登録する。
    // 下にあるdescriptorでブロックと関数のひも付けを行っている。
    ext.vco0_set = function(str) {
    };

    ext.vco0_tone = function(freq) {
       vco0.oscillator.frequency.value = freq;
    };
    ext.vco0_gain = function(gain) {
       vco0.gain.value = gain;
    };
    ext.vco0_wave = function(type) {
       vco0.oscillator.type = type;
    };
    ext.vco0_on = function() {
       vco0.oscillator.start(0);
    };
    ext.vco0_off = function() {
       vco0.oscillator.stop(0);
    };
    ext.vco1_freq = function(freq) {
       vco1.oscillator.frequency.value = freq;
    };
    ext.vco1_gain = function(gain) {
       vco1.gain.value = gain;
    };
    ext.vco1_wave = function(wtype) {
       vco1.oscillator.type = wtype;
    };
    ext.vco1_on = function() {
       vco1.oscillator.start(0);
    };
    ext.vco1_off = function() {
       vco1.oscillator.stop(0);
    };
    ext.lfo_freq = function(freq) {
       lfo.frequency.value = freq;
    };
    ext.lfo_on = function(str) {
       lfo.start(0);
    };
    ext.lfo_off = function(str) {
       lfo.stop(0);
    };
    ext.vcf_freq = function(freq) {
       vcf.frequency.value = freq;
    };


    // ブロックと関数のひも付け
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            [' ', 'vco0 On', 'vco0_on'],
            [' ', 'vco0 Off', 'vco0_off'],
            [' ', 'vco0 set Freq %n', 'vco0_freq', 440],
            [' ', 'vco0 set Volume %n', 'vco0_gain', 50],
            [' ', 'vco0 set WaveType %m.waveType', 'vco0_wave', 'sine'],
            [' ', 'vco1 On', 'vco1_on'],
            [' ', 'vco1 Off', 'vco1_off'],
            [' ', 'vco1 set Freq %n', 'vco1_tone', 440],
            [' ', 'vco1 set Volume %n', 'vco1_gain', 50],
            [' ', 'vco1 set WaveType %m.waveType', 'vco1_wave', 'sine'],
            [' ', 'lfo set Freq %n', 'lfo_freq', 2],
            [' ', 'lfo On', 'lfo_on'],
            [' ', 'lfo Off', 'lfo_off'],
            [' ', 'vcf set Freq %n', 'vcf_freq', 8000]
        ],
        menus: {
            waveType: ["sine", "square", "sawtooth", "triangle"]
        }
    };

    // 最後にExtensionを登録する
    ScratchExtensions.register('Simple extension', descriptor, ext);
})({});