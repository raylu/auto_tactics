/* eslint-disable camelcase */

import {JsfxrResource, type SoundConfig} from '@excaliburjs/plugin-jsfxr';
import {Sound} from 'excalibur';
import {loader} from './loader';

export const sounds: {[key: string]: SoundConfig} = {
	'kinetic': {
		oldParams: true,
		wave_type: 3,
		p_env_attack: 0.162,
		p_env_sustain: 0.023762675686034476,
		p_env_punch: 0.302,
		p_env_decay: 0.255,
		p_base_freq: 0.284,
		p_freq_limit: 0,
		p_freq_ramp: -0.42168049066005564,
		p_freq_dramp: 0,
		p_vib_strength: 0,
		p_vib_speed: 0,
		p_arp_mod: 0,
		p_arp_speed: 0,
		p_duty: 1,
		p_duty_ramp: 0,
		p_repeat_speed: 0,
		p_pha_offset: 0,
		p_pha_ramp: 0,
		p_lpf_freq: 1,
		p_lpf_ramp: 0,
		p_lpf_resonance: 0,
		p_hpf_freq: 0,
		p_hpf_ramp: 0,
		sound_vol: 0.25,
		sample_rate: 44100,
		sample_size: 8,
	},
	'spell': {
		oldParams: true,
		wave_type: 3,
		p_env_attack: 0,
		p_env_sustain: 0.3972902356476202,
		p_env_punch: 0.5463247139592835,
		p_env_decay: 0.30287740879283875,
		p_base_freq: 0.795,
		p_freq_limit: 0,
		p_freq_ramp: -0.3742957570445611,
		p_freq_dramp: 0,
		p_vib_strength: 0.615,
		p_vib_speed: 0.587,
		p_arp_mod: 0.018,
		p_arp_speed: 1,
		p_duty: 0,
		p_duty_ramp: 0,
		p_repeat_speed: 0,
		p_pha_offset: 0.299,
		p_pha_ramp: -0.09,
		p_lpf_freq: 1,
		p_lpf_ramp: 0,
		p_lpf_resonance: 0,
		p_hpf_freq: 0.9027109076840042,
		p_hpf_ramp: 0,
		sound_vol: 0.25,
		sample_rate: 44100,
		sample_size: 8,
	},
	'spellBig': {
		oldParams: true,
		wave_type: 3,
		p_env_attack: 0,
		p_env_sustain: 0.3069558272395913,
		p_env_punch: 0.44937032348450734,
		p_env_decay: 0.39946354351285196,
		p_base_freq: 0.826,
		p_freq_limit: 0,
		p_freq_ramp: -0.280954146450867,
		p_freq_dramp: 0,
		p_vib_strength: 0,
		p_vib_speed: 0,
		p_arp_mod: 0,
		p_arp_speed: 0,
		p_duty: 0,
		p_duty_ramp: 0,
		p_repeat_speed: 0,
		p_pha_offset: -0.1747669886328175,
		p_pha_ramp: -0.17895866866367888,
		p_lpf_freq: 1,
		p_lpf_ramp: 0,
		p_lpf_resonance: 0,
		p_hpf_freq: 0,
		p_hpf_ramp: 0,
		sound_vol: 0.25,
		sample_rate: 44100,
		sample_size: 8,
	},
} as const;

export const sndPlugin = new JsfxrResource();
void sndPlugin.init();
for (const sound in sounds)
	sndPlugin.loadSoundConfig(sound, sounds[sound]);

export const iceSound = new Sound('static/audio/ice.m4a');
export const fireSound = new Sound('static/audio/fire.ogg');
export const fireHold = new Sound('static/audio/fire_hold.ogg');
export const fireExplosion = new Sound('static/audio/fire_explosion.ogg');

loader.addResources([iceSound, fireSound, fireHold, fireExplosion]);
